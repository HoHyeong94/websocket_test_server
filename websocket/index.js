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
        // console.log(message);
        switch (message.type) {
          case "init":
            socket["username"] = message.username;
            socket["userid"] = message.userid;
            socket["roomname"] = false;
            socket["offer"] = false;
            socket["answer"] = false;
            if (!clients.has(message.userid)) {
              clients.set(message.userid, socket);
            }
            break;
          case "all_users":
            socket.roomname = message.roomname;
            let allUsers = [];
            for (const [key, value] of clients) {
              if (value.roomname === message.roomname) {
                allUsers.push({
                  username: value.username,
                  userid: value.userid,
                  roomname: value.roomname
                })
              }
            }
            socket.send(JSON.stringify({
              type: "all_users",
              data: allUsers
            }));
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
          case "offer":
            for (const value of clients.values()) {
              if (
                value.roomname === message.roomname &&
                value.userid === message.userid
              ) {
                value.send(
                  JSON.stringify({
                    type: "offer",
                    offer: message.offer,
                    userid: value.userid,
                    username: value.username,
                    offerUsername: message.sendUsername,
                    offerUserid: message.sendUserid,
                    roomname: message.roomname,
                  })
                );
              }
            }
            break;
          case "answer":
            for (const value of clients.values()) {
              if (value.username === message.sendUsername && value.roomname === message.roomname) {
                value.send(
                  JSON.stringify({
                    type: "answer",
                    answer: message.answer,
                    roomname: message.roomname,
                    username: value.username,
                    userid: message.userid,
                    sendUserid: message.sendUserid,
                    sendUsername: message.sendUsername
                  })
                );
              }
            }
            break;
          case "ice":
            for (const value of clients.values()) {
              if (value.roomname === message.roomname && value.username === message.username) {
                value.send(
                  JSON.stringify({
                    type: "ice",
                    candidate: message.candidate,
                    roomname: message.roomname,
                    username: value.username,
                    userid: value.userid,
                    sendUsername: message.sendUsername,
                    sendUserid: message.sendUserid
                  })
                );
              }
            }
            break;
            case "exit":
              console.log("EXIT")
              clients.get(message.userid).roomname = false;
              break;
        }
      });

      socket.on("close", () => {
        console.log("close")
        clients.delete(socket.userid);
      })
    });
  }
}
