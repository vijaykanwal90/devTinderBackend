const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/connectionRequest.model");
userRouter.get("/user/connections",userAuth,async(req,res)=>{
try {
        const loggedInUser = req.user;
        // console.log(loggedInUser)
        // res.json({message:success},toUser)
        const connection = await ConnectionRequest.find({
            $or:[
                {   toUserId:loggedInUser._id,
                    status:"accepted"},
                    {   fromUserId:loggedInUser._id,
                        status:"accepted",}
            ]
         
        }).populate("fromUserId",["firstName","lastName","photoUrl","about"])

        if(!connection){
            console.log("no connection found")
        }
        // console.log("the connection details are " + connection)
        // res.status(200).send("connections fetched successfully")
        // const data = ConnectionRequest.map((row)=> row.fromUserId)
        // res.json({message:"success", connection})
        // console.log("to check userId " + connection)
        res.json({message:"success",connection})



} catch (error) {
        res.json({message:"Error while fetching the connections"})
}
})
userRouter.get("/user/received",userAuth, async(req,res)=>{
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