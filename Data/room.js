let rooms = [{
    id: "1",
    name: "roomTest1",
    createdAt: new Date().toString(),
}, {
    id: "2",
    name: "roomTest2",
    createdAt: new Date().toString(),
}]

export async function getRooms() {
    return Promise.resolve(rooms);
}