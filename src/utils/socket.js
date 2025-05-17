const socket = require('socket.io');
const Message = require('../models/Message.model');
const initializeSocket = (server) => {
    // console.log("initializing socket");
    // console.log(process.env.ORIGIN)
    const allowedOrigins = ['http://localhost:5173', 'https://dev-tinder-ui-six.vercel.app'];
    const base = socket(server, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST"],
        credentials: true,
      }
    });
    const io = base.of("/api");

    io.on("connection", (socket)=>{
  
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            // console.log(targetUserId)
            // console.log("joining chat",userId,targetUserId);
            const roomId = [userId,targetUserId].sort().join("_");
   
            socket.join(roomId);

        })
        socket.on("sendMessage",async({firstName ,userId,targetUserId,text})=>{
            
            console.log("message sent",userId,targetUserId,text);
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
                time: new Date(),
                senderId: userId
                
            })
            // if (targetUserId === userId) return;
                // console.log(firstName  + " is sending message",text);
         

        })
        socket.on("disconnect",()=>{ })
    })
    
}
module.exports = initializeSocket;