const mongoose   = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.ObjectId,
        required:true,
        index:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        index:true,
        ref:"User"

    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","interested","rejected"],
            message: `{VALUE} is  not a valid status`
        },
        
        required:true
    }

},{timestamps:true})
connectionRequestSchema.index({fromUserId:1,toUserId:1})
connectionRequestSchema.pre('save',function (next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
          throw new Error("Cannont send request to yourself")
  
        }
    next()
})
const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema)
module.exports = ConnectionRequest