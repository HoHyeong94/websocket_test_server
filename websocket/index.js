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
      socket["username"] = "guest";

      socket.on("message", (msg) => {
        const message = JSON.parse(msg.utf8Data);
        console.log(message);
        switch (message.type) {
          case "init":
            socket["username"] = message.username;
            socket["userid"] = message.userid;
            socket["roomname"] = false;
            if (!clients.has(message.userid)) {
              clients.set(message.userid, socket);
            }
            break;
          case "createroom":
            console.log("CREATEROOM");
            let Data = {
              hostid: message.id,
              hostname: message.username,
              roomname: message.roomname,
            };
            roomLists.data.push(Data);
            clients.forEach((client) => client.send(JSON.stringify(roomLists)));
            break;
          case "roomlist":
            console.log("ENTERROOMLIST");
            clients.forEach((client) => client.send(JSON.stringify(roomLists)));
            break;
          case "join_room":
            socket.roomname = message.roomname;
            for (const value of clients.values()) {
              if (value.username === message.username) continue;
              if (value.roomname === message.roomname) {
                value.send(
                  JSON.stringify({
                    type: "welcome",
                    roomname: message.roomname,
                  })
                );
              }
            }
            break;
          case "offer":
            for (const value of clients.values()) {
              if (value.username === message.username) continue;
              if (value.roomname === message.roomname) {
                value.send(
                  JSON.stringify({
                    type: "offer",
                    offer: message.offer,
                    roomname: message.roomname,
                  })
                );
              }
            }
            break;
          case "answer":
            for (const value of clients.values()) {
              if (value.username === message.username) continue;
              if (value.roomname === message.roomname) {
                value.send(
                  JSON.stringify({
                    type: "answer",
                    answer: message.answer,
                    roomname: message.roomname,
                  })
                );
              }
            }
            break;
          case "ice":
            for (const value of clients.values()) {
              if (value.username === message.username) continue;
              if (value.roomname === message.roomname) {
                value.send(
                  JSON.stringify({
                    type: "ice",
                    candidate: message.candidate,
                    roomname: message.roomname,
                  })
                );
              }
            }
            break;
        }
      });
    });
  }
}
