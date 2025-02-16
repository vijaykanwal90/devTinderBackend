const socket = require('socket.io');

const initializeSocket = (server) => {
    // console.log("initializing socket");
    const io = socket(server, {
        cors:{
            origin:"http://localhost:5173",
        }
    })
    io.on("connection",(socket)=>{
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            // console.log(targetUserId)
            // console.log("joining chat",userId,targetUserId);
            const roomId = [userId,targetUserId].sort().join("_");
            // console.log(firstName + " " + "joined room");
            socket.join(roomId);

        })
        socket.on("sendMessage",({firstName ,userId,targetUserId,text})=>{
        
            const roomId = [userId,targetUserId].sort().join("_");
            io.to(roomId).emit("messageReceived",{
                firstName,
                text
            })
                // console.log(firstName  + " is sending message",text);

        })
        socket.on("disconnect",()=>{ })
    })
    
}
module.exports = initializeSocket;