import * as roomRepo from "../Data/room.js";


export async function getRooms(req, res) {
    const data = await roomRepo.getRooms()
    res.status(200).json(data);
}
