const mongoose = require("mongoose")
// console.log(process.env.ORIGIN)

const connectDB = async ()=>{
    const url = process.env.MONGO_URL;
    console.log(url)
    
    await mongoose.connect(process.env.MONGO_URL)
}

module.exports = connectDB;