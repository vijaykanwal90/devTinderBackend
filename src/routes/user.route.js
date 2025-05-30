const express = require("express")
const userRouter = express.Router()
const User = require("../models/user.model")
const {userAuth} = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
// userRouter.get("/user/connections",userAuth,async(req,res)=>{
// try {
//         const loggedInUser = req.user;
//         // console.log(loggedInUser)
//         // res.json({message:success},toUser)
//         const connection = await ConnectionRequest.find({
//             $or:[
//                 {toUserId:loggedInUser._id,status:"accepted"},
//                 {fromUserId:loggedInUser._id, status:"accepted",}
//             ]
         
//         })
//     //    .populate({
//     //     path:"fromUserId",
//     //     select:["firstName","lastName","about","photoUrl"],
//     //     match:{loggedInUser._id:fromUserId}
//     //    })
//     //    .populate({
//     //     path:"toUserId",
//     //     select:["firstName","lastName","about","photoUrl"],
//     //     match:{loggedInUser?._id:toUserId}
//     //    })


//         if(!connection){
//             console.log("no connection found")
//         }
//         // console.log("the connection details are " + connection)
//         // res.status(200).send("connections fetched successfully")
//         // const data = ConnectionRequest.map((row)=> row.fromUserId)
//         // res.json({message:"success", connection})
//         // console.log("to check userId " + connection)
//         res.json({message:"success",connection})



// } catch (error) {
//         res.status(500).json({message:"Error while fetching the connections"})
// }
// })
userRouter.get("/viewConnections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    }).populate("fromUserId", ["firstName", "lastName", "about", "photoUrl"])
      .populate("toUserId", ["firstName", "lastName", "about", "photoUrl"]);

    // Dynamically adjust the response based on which side the logged-in user is
    const formattedConnections = connections.map((conn) => {
      if (conn.toUserId.equals(loggedInUser._id)) {
        return {
          connection: conn.fromUserId,  // Show the fromUserId's details
          relationship: "You received the connection"
        };
      } else {
        return {
          connection: conn.toUserId,  // Show the toUserId's details
          relationship: "You sent the connection"
        };
      }
    });

    res.json({ message: "success", connection: formattedConnections });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching the connections" });
  }
});

userRouter.get("/chat/:userId", userAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedInUser = req.user;
    //  console.log(userId)
    // Prevent viewing own profile
    if (userId === String(loggedInUser._id)) {
      return res.status(400).json({ message: "You cannot view your own profile" });
    }

    // Fetch user by ID and exclude sensitive fields
    const user = await User.findById(userId).select("firstName lastName about photoUrl");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Success",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return res.status(500).json({ message: "Error while fetching user details", error: error.message });
  }
});


userRouter.get("/feed",userAuth, async(req,res)=>{
    //  all users card except  
    // profile of  his own
    // and those to which user have reject the current user
    // user which are already connected
    // console.log("at fetch api")
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;

        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50: limit;
        const skip = (page -1) * limit;
    const connectionRequest = ConnectionRequest.find({
        $or:[{toUserId:loggedInUser._id},
            {fromUserId:loggedInUser._id}],
    }).select("fromUserId toUserId")
    // .populate("fromUserId","firstName")
    // .populate("toUserId","firstName")
    const hideUserFromFeed = new Set();
    (await connectionRequest).forEach(req =>{
        hideUserFromFeed.add(req.fromUserId);
        hideUserFromFeed.add(req.toUserId);
    })
    const users = await User.find(
        {
           $and:[  {_id:{$nin: Array.from(hideUserFromFeed)}},
            {_id:{$nin:loggedInUser._id}}]
        }
    ).select("firstName lastName photoUrl about skills gender")
    .skip(skip)
    .limit(limit)
        // res.send(users)
        res.json({message:"success",data:users})
    } catch (error) {
        res.status(400).send("something went wrong" + error.message)
        
    }
})
userRouter.get("/received",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connection = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName","lastName","photoUrl","about"])

        // console.log(" the connection lists are : " + connection);
        res.json({message:"success",connection})
    }
    catch(error){
        res.status(400).send( error.message + "error while fetching the received requests")
    }
})
module.exports = userRouter