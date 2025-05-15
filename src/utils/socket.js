const socket = require('socket.io');
const Message = require('../models/Message.model');
const initializeSocket = (server) => {
    // console.log("initializing socket");
    const io = socket(server, {
        cors:{
            origin:"http://localhost:5173",
        }
    })
    io.on("connection", (socket)=>{
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            // console.log(targetUserId)
            // console.log("joining chat",userId,targetUserId);
            const roomId = [userId,targetUserId].sort().join("_");
            // console.log(firstName + " " + "joined room");
            socket.join(roomId);

        })
        socket.on("sendMessage",async({firstName ,userId,targetUserId,text})=>{
            

            const room = await Message.findOneAndUpdate(
              { roomId: [userId, targetUserId].sort().join("_")},
              {
                $push: {
                  messages: {
                    text,
                    senderId: userId,
                    time: new Date()
                  }
                },
                $setOnInsert: {
                  senderId: userId,
                  receiverId: targetUserId,
                  roomId:[userId, targetUserId].sort().join("_")}
                
              },
              { new: true, upsert: true }
            );
            
              
            
            const roomId = [userId,targetUserId].sort().join("_");
            io.to(roomId).emit("messageReceived",{
                firstName,
                text,
                
            })
                // console.log(firstName  + " is sending message",text);
         

        })
        socket.on("disconnect",()=>{ })
    })
    
}
module.exports = initializeSocket;