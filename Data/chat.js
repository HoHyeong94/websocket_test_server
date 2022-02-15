let chats = [
  {
    id: "1",
    text: "hi",
    createdAt: new Date().toString(),
    roomname: "roomTest1",
  },
  {
    id: "2",
    text: "hello",
    createdAt: new Date().toString(),
    roomname: "roomTest2",
  },
  {
    id: "1",
    text: "haha",
    createdAt: new Date().toString(),
    roomname: "roomTest1",
  },
  {
    id: "2",
    text: "hoho",
    createdAt: new Date().toString(),
    roomname: "roomTest1",
  },
];

export async function getAllByRoomName(roomname) {

  return chats.filter((tweet) => tweet.roomname === roomname);
}
