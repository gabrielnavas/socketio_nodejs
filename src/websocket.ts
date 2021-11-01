import {io} from './http'

interface RoomUser{
  socketID: string
  username: string
  room: string
}

interface Message {
  room: string
  text: string
  createdAt: Date,
  username: string
}

const users: RoomUser[] = []

const messages: Message[] = []

io.on("connection", socket => {

  socket.on('select_room', (data, getMessagesCallback) => {
    // join user to room
    socket.join(data.room)

    const userInRoom = users.find(
      user => user.username === data.username && 
      user.room === data.room
    )

    if(userInRoom) {
      // update socket id
      userInRoom.socketID = socket.id
    } else {
      // add user to my user list persistence
      users.push({
        room: data.room,
        username: data.username,
        socketID: socket.id
      })
    }

    // get allm essages
    const messagesRoom = getMessagesRoom(data.room)
    getMessagesCallback(messagesRoom)
  })

  socket.on("message", data => {
    // add message to my message list persistence
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date()
    }
    messages.push(message)
    
    // send message to room
    // all user that is logged on this room, will receive this message
    io.to(data.room).emit("message", message)
  })

  socket.on("close", data => {
    socket.leave(data.room)
    const userIndex = users.findIndex(user => user.username === data.username)
    users.splice(userIndex, 1)
    const message: Message = {
      room: data.room,
      username: data.username,
      text: "saiu da sala",
      createdAt: new Date()
    }
    io.to(data.room).emit("message", message)
    console.log(users);
    
  });
})


function getMessagesRoom(room: string) {
  const messagesRoom = messages.filter(message => message.room === room)
  return messagesRoom
} 