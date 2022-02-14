import express from "express";
// import Router from "./Router/room.js";
import { initSocket } from "./websocket/index.js";

const app = express();

// app.use("/chat", Router);
const server = app.listen(8080);
initSocket(server);