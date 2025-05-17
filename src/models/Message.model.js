const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageContentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}); // Disable _id for each message object if not needed

const MessageSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomId:{
    type: String,
    required: true,
    unique: true,
  },
  messages: [messageContentSchema], // renamed `message` to `messages`
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
