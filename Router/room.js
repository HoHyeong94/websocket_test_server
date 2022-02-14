import express from 'express';
import * as chatController from "../Controller/room.js";

const router = express.Router();


// GET /tweet
// GET /tweets?username=:username
router.get('/', chatController.getChats);

// GET /tweets/:id
router.get('/:id', chatController.getChat);

// POST /tweeets
router.post('/', chatController.createChat);

export default router;