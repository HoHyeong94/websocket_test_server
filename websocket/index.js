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
            if (!clients.has(message.userid)) {
              clients.set(message.userid, socket);
            }
            break;
          case "connected_users":
            socket.roomname = message.roomname;
            let connectedUsers = [];
            for (const [key, value] of clients) {
              if (value.roomname === message.roomname) {
                connectedUsers.push({
                  username: value.username,
                  userid: value.userid,
                  roomname: value.roomname
                })
              }
            }
            socket.send(JSON.stringify({
              type: "connected_users",
              connectedUsers: connectedUsers
            }));
            break;
          case "createroom":
            console.log("CREATEROOM");
            let info = {
              hostid: message.id,
              hostname: message.username,
              roomname: message.roomname,
            };
            roomLists.data.push(info);
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
                value.userid === message.remoteUserid
              ) {
                value.send(
                  JSON.stringify({
                    type: "offer",
                    offer: message.offer,
                    remoteUsername: message.localUsername,
                    remoteUserid: message.localUserid,
                    roomname: message.roomname,
                  })
                );
              }
            }
            break;
          case "answer":
            for (const value of clients.values()) {
              if (
                value.username === message.remoteUsername &&
                value.roomname === message.roomname
              ) {
                value.send(
                  JSON.stringify({
                    type: "answer",
                    answer: message.answer,
                    roomname: message.roomname,
                    remoteUsername: message.localUsername,
                    remoteUserid: message.localUserid,
                  })
                );
              }
            }
            break;
          case "ice":
            for (const value of clients.values()) {
              if (
                value.roomname === message.roomname &&
                value.username === message.remoteUsername
              ) {
                value.send(
                  JSON.stringify({
                    type: "ice",
                    candidate: message.candidate,
                    roomname: message.roomname,
                    remoteUsername: message.localUsername,
                    remoteUserid: message.localUserid,
                  })
                );
              }
            }
            break;
            case "exit":
              console.log("EXIT")
              for (const value of clients.values()) {
                if (value.roomname === message.roomname) {
                  value.send(
                    JSON.stringify({
                      type: "exit",
                      username: message.username,
                      userid: message.userid,
                    })
                  );
                }
              }
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
