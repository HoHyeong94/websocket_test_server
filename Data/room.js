let rooms = [{
    id: "1",
    roomname: "roomTest1",
    createdAt: new Date().toString(),
}, {
    id: "2",
    roomname: "roomTest2",
    createdAt: new Date().toString(),
}]

export async function getRooms() {
    return Promise.resolve(rooms);
}