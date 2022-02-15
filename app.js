import express from "express";
import cors from "cors";
import Router from "./Router/room.js";
import { initSocket } from "./websocket/index.js";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/chats", Router);
const server = app.listen(8080);
initSocket(server);