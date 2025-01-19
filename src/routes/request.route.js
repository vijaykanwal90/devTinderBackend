const express = require("express");
const User = require("../models/user.model");
const { userAuth } = require("../middlewares/auth.middleware");
const ConnectionRequest  = require("../models/connectionRequest.model")
const requestRouter = express.Router();
const mongoose = require("mongoose")
requestRouter.post(
  "/sendConnectionRequest/:status/:toUser",
  userAuth,
  async (req, res) => {
    try {
      console.log("sendConnectionRequest")
      const fromUserId = req.user._id;
      // console.log(fromUserId)
      // console.log(toUserId)
      // console.log(status)
      // console.log(fromUserId)

      const toUserId = req.params.toUser;
      const status = req.params.status;
      // console.log(fromUserId)
      console.log(toUserId)
      console.log(status)
      const allowedStatus = ["ignored","interested"]
      // if(fromUserId.equals(toUserId)){
      //   throw new Error("Cannont send request to yourself")

      // }
      if(!allowedStatus.includes(status)){
        // res.send("status is not allowd")
        throw new Error("Status is not allowd")
      }
      const receiver = await User.findById({_id:toUserId})
      if(!receiver){
        // res.send("user not found")
        throw new Error("User  not found")

      }
      const existingRequest = await ConnectionRequest.findOne({
        $or:[
          {fromUserId,toUserId},
          {fromUserId:toUserId,toUserId:fromUserId}
        ]
      })
      if(existingRequest){
        throw new Error("Request already exists")
      }
      const connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })
      const data   = await connection.save();
      console.log(data)
      res.json({
        message:`${req.user.firstName} is ${status} in ${receiver.firstName} successfully`,
        data,
    });

    } catch (error) {
        res.status(400).send("error while sending request " + error.message)
    }
  }
);
// requestRouter.post("/reviewConnectionRequest/:status/:fromUserId",userAuth, async(req,res)=>{
//   try {
//       //  other way is to send the connectionId in the params instead of fromUserId
//         const loggedInUser = req.user;
//         const response = req.params.status;
        
//         const {fromUserId }= req.params;
//         const allowedStatus= ["rejected","accepted"]
//         console.log(req.params)
//         console.log(loggedInUser)
//         console.log(fromUserId)
//         // console.log(loggedInUser)

//         const connection = await ConnectionRequest.findOne({
//           toUserId: loggedInUser._id,
//           fromUserId: fromUserId
//         });
        
//         // console.log(response)
//         if(!allowedStatus.includes(response)){
//           return res.status(404).send("invalid status")

//         }
//         if(!connection ){
//           return res.status(404).send("no request found")
//         }
//         if(connection.status=='ignored'){
//             return res.status(200).send("connecton status is ignored")
//         }
//         const updateConnection = await ConnectionRequest.findByIdAndUpdate({_id:connection._id},{
//           status:response
//         })
//         await updateConnection.save();
//         res.status(200).send("connection" + response + "successfully")


//   } catch (error) {
//       res.status(400).send(error.message + " error in reviewing the request")
//   }

// })
requestRouter.post("/reviewConnectionRequest/:status/:requestId",userAuth,async(req,res)=>{
  try{
    // what i am going to do here
    console.log("on reviewing the connection request")
      const loggedInUser = req.user;
      const {status,requestId} = req.params;
      console.log(status)
      // const {requestId} = req.params;
      console.log(requestId)
      const allowedStatus = ["rejected","accepted"]
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"request is ", status})
      }
      const connection = await ConnectionRequest.findOne({
        // _id:mongoose.Types.ObjectId(requestId),
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"}
      )
      if(!connection){
        return res.status(404)
        .json({message:"Connection request not found"})
      }
      // console.log(connection)
      
      connection.status = status;
      const data = await connection.save();
      // res.send("reviewing the connecions")
      res.json({message:"connection request " + status,data})
  }
  catch(error){
    res.status(400).json({error : error.message + "error while reviewing the requests"})
  }
})
module.exports = requestRouter;
