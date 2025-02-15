const express = require("express");
// import express from 'express'
const   paymentRouter = express.Router();
// const Razorpay = require("razorpay");
const razorPayInstance = require("../utils/razorpay");
const Payment = require("../models/payment.model");
const { userAuth } = require("../middlewares/auth.middleware");
// const validateWebhook = require("")
// const validateWebhookSignature = require("")
const {membershipAmount} = require("../utils/constants");
const { validate } = require("../models/user.model");
const User = require("../models/user.model");
paymentRouter.post("/payment/create",userAuth, async (req, res) => {
    try{
        const {membershipType} = req.body;
        const {firstName,lastName,email} = req.user;
        const order  = await razorPayInstance.orders.create({
            amount:membershipAmount[membershipType]*100,
            currency:"INR",
            receipt:"receipt#1",
            notes:{
                firstName,
                lastName,
                emailId:email,
                membershipType:membershipType
            },

        })
        console.log(order)
        const payment = new Payment({
            userId:req.user._id,
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes,
            status:order.status
        })
        const savedPayment = await payment.save();
        res.status(200).json({...savedPayment.JSON(),keyId:process.env.RAZORPAY_KEY_ID})
    }
    catch(error){
        res.status(500).send("Payment failed: " + error.message);
    }
})
paymentRouter.post("/payment/webhook",async(req,res)=>{
    try{
        const webhookSignature = req.get("x-razorpay-signature");
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );
        if(!isWebhookValid){
            return res.status(400).json({msg:"Webhook signature verification failed"});
        }

        const paymentDetails = req.body.payload.entity;
        const payment = await Payment.findOne({
            orderId:paymentDetails.order_id
        })
        payment.status= paymentDetails.status;
        await payment.save();
        const user = await User.findOne({
            _id:payment.userId
        })
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();
        res.status(200).json({msg:"webhook received"});

    }

    catch(error){
        res.status(500).send("Payment failed: " + error.message);
    }
})
paymentRouter.get("/premium/verify",userAuth,async(req,res)=>{
    if(req.user.isPremium){
        res.status(200).json({isPremium:true});
    }
    else{
        res.status(200).json({isPremium:false});
    }
})
module.exports =  paymentRouter ;