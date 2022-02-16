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

let sockets = [];
class Socket {
  constructor(server) {
    this.wss = new Server({
      httpServer: server,
      autoAcceptConnections: true,
    });

    this.wss.on("connect", function (socket) {
      console.log("server socket start");
      socket["username"] = "anon"
      sockets.push(socket)
      socket.on("message", (msg) => {
        const message = JSON.parse(msg.utf8Data)
        switch (message.type) {
          case "Username":
            socket["username"] = message.username;
            break;
          case "Message":
            sockets.forEach((asocket) => asocket.send(`${socket.username}: ${message.text}`))
            break;
        }
      })
    });
  }
}