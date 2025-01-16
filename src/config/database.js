const mongoose = require("mongoose")
const connectDB = async ()=>{


    await mongoose.connect("mongodb+srv://vijaykanwal90:e5SNgIVhr5RHHYFo@cluster0.vqu1t.mongodb.net/devHub")
}

module.exports = connectDB;