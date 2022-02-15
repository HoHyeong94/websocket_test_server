import express from 'express';
import * as roomController from "../Controller/room.js";
import * as chatController from "../Controller/chat.js";

const router = express.Router();


router.get('/', roomController.getRooms);

// router.get('/:roomname', chatController.getChats);

router.post('/:roomname', chatController.createChat);

export default router;