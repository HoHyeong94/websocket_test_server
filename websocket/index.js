import { server as Server } from "websocket";

let socket;

export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  if (origin.includes("localhost:3000")) {
    return true;
  }
  return false;
}

export function getSocket() {
  return socket;
}

class Socket {
  constructor(server) {
    this.io = new Server({
      httpServer: server,
      autoAcceptConnections: false,
    });

    this.io.on("request", function (request) {
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log(
          new Date() +
            " Connection from origin " +
            request.origin +
            " rejected."
        );
        return;
      }
      console.log("server socket start");
      let connection = request.accept("echo-protocol", request.origin);
      console.log(request)

      connection.on("message", function (message) {
        if (message.type === "utf8") {
          console.log("Received Message: " + message.utf8Data);
          connection.sendUTF(message.utf8Data);
        } else if (message.type === "binary") {
          console.log(
            "Received Binary Message of " + message.binaryData.length + " bytes"
          );
          connection.sendBytes(message.binaryData);
        }
      });

      connection.on("close", function (reasonCode, description) {
        console.log(
          new Date() + " Peer " + connection.remoteAddress + " disconnected."
        );
      });

    });
  }
}