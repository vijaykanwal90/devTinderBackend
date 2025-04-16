const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
// const cookieParser = require("cookie-parser")
// const jwt = require("jsonwebtoken")
const userAuth = async(req,res,next)=>{
    try {
        // const cookies = req.cookies;
        // console.log(cookies)
        // const {token} = req.cookies;
        // console.log("token is " + token)
        const authHeader = req.headers.authorization;

        // Check if token exists in the Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ message: "No token provided" });
        }
      
        // Extract token from header
        const token = authHeader.split(" ")[1];
        if(!token){
        
           return  res.status(401).send("You are not logged in please login")
        }
        const decodedJwt = await jwt.verify(token,"devTinder@123")
        // console.log(token)
        const {id} = decodedJwt;
        // console.log(id)
        const user = await User.findById({_id:id});
        if(!user){
            throw new Error("user not found")
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
   
}

module.exports = {
    userAuth

}
