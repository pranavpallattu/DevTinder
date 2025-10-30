const socket=require("socket.io")


const initializeSocket=(server)=>{

const io= socket(server,{
  cors:{
    origin:"http://localhost:5173"
  }
})

io.on("connection",(socket)=>{
  // Handle events

  socket.on("joinChat",({firstName,userId,toUserId})=>{
    const roomId=[userId,toUserId].sort().join("_")
    console.log(firstName +" is Joining Room, RoomId : "+roomId);
    
    socket.join(roomId)
  })

  socket.on("sendMessage",({firstName, userId, toUserId, text})=>{
    const roomId=[userId,toUserId].sort().join("_")
    console.log({firstName , text});
    
      io.to(roomId).emit("messageReceived",{firstName, text})
  })

  socket.on("disconnect",()=>{

  })
})
}


module.exports = initializeSocket;