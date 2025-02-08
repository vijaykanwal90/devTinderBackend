const express = require("express");
const paymentRouter = express.Router();
paymentRouter.post("/payment/create", async (req, res) => {
    try{
        
    }
    catch(error){
        res.status(500).send("Payment failed: " + error.message);
    }
})

module.exports = { paymentRouter };