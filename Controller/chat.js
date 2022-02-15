import * as chatRepo from "../Data/chat.js"; 
 
export async function getChats(req, res, next) {
    const roomname = req.params.roomname;
   
    const tweet = await chatRepo.getAllByRoomName(roomname);
    if (tweet) {
      res.status(200).json(tweet);
    } else {
      res.status(404).json({ message: `Tweet id(${id}) not found` });
    }
}

export async function createChat(req, res, next) {

}