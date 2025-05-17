const express = require('express');
const messageRouter = express.Router();
const Message = require('../models/Message.model');
const  User  = require( '../models/user.model');
const { userAuth } = require('../middlewares/auth.middleware');
const mongoose = require('mongoose');
// const User = require("../models/user.model");
 
messageRouter.get('/getMessage/:roomId', userAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log("Fetching messages for room:", roomId);

    const roomMessages = await Message.findOne({ roomId });

    if (!roomMessages) {
      return res.status(404).json({ message: 'No messages found for this room', messages: [] });
    }

    res.status(200).json({
      message: 'Messages fetched successfully',
      messages: roomMessages.messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

  
module.exports = messageRouter;