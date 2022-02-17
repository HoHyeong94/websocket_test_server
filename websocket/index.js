import { server as Server } from "websocket";

let socket;

export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

export function getSocket() {
  return socket;
}

let clients = new Map();
let roomLists = {
  type: "roomlist",
  data: []
}
class Socket {
  constructor(server) {
    this.wss = new Server({
      httpServer: server,
      autoAcceptConnections: true,
    });

    this.wss.on("connect", function (socket) {
      console.log("server socket start");
      socket["username"] = "guest"
      
      socket.on("message", (msg) => {
        const message = JSON.parse(msg.utf8Data)
        console.log(message)
        switch (message.type) {
          case "init":
            console.log("INIT")
            console.log(clients.size)
            socket["username"] = message.username;
            socket["userid"] = message.userid;
            socket["roomname"] = false;
            if(!clients.has(message.userid)) {
              clients.set(message.userid, socket);
            }
            break;
          case "join":
            console.log("JOIN")
            clients.get(message.userid).roomname = message.roomname;
            break;
          case "message":
            console.log("MESSAGE")
            let data = {
              type:"message",
              username: message.username,
              roomname: message.roomname,
              text: `${message.username}: ${message.text}`
            }
            for (const value of clients.values()) {
              if (value.roomname === data.roomname) {
                value.send(JSON.stringify(data));
              }
            }
            break;
          case "exit":
            console.log("EXIT")
            clients.get(message.userid).roomname = false;
            break;
          case "createroom":
            console.log("CREATEROOM")
            let Data = {
              hostid: message.id,
              hostname: message.username,
              roomname: message.roomname
            }
            roomLists.data.push(Data)
            clients.forEach((client) => client.send(JSON.stringify(roomLists)))
            break;
          case "roomlist":
            console.log("ENTERROOMLIST")
            clients.forEach((client) => client.send(JSON.stringify(roomLists)))
            break;
        }
      })
    });
  }
}