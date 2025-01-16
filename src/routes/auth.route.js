const express = require("express")
const authRouter = express.Router()
const {validateSignupdata }= require("../utils/validations")
const User = require("../models/user.model")
// const {userAuth} = require("../middlewares/auth.middleware")
const { userAuth} = require("../middlewares/auth.middleware")
// const {userAuth} = userAuth
const bcrypt = require("bcryptjs")
authRouter.post("/signup",async(req,res)=>{

    // console.log(email)
    try{
    //    const isSignUpValid = await validateSignupdata(req);
    const {firstName, lastName, email, password} = req.body;
        // console.log(firstName)
        console.log("in signup")
    validateSignupdata(req)
    console.log("after validate ")
    const exists = await User.findOne({email})
    // const exists = await User.find(firstName);
    const hashedPassword = await bcrypt.hash(password,10);
    // console.log(hashedPassword)
   
        if(exists){
            return res.status(400).send("User with this email already exists")
        }
        else {
        const user = new User({
        firstName,
        lastName,
        password:hashedPassword,
        email
        });

            await user.save( );

            res.status(200).send("user added successfully")
        }
        
    } 
    catch(error){
        res.status(400).send("user registration failed  " + error.message)
    }
})
authRouter.post("/login",async(req,res)=>{
    const {email,password}= req.body;
    

    try{
        console.log(email)

        const user = await User.findOne({email})
        // console.log("find one error ")
        if(!user){
            throw new Error("Invalid email")
        }
        // console.log(user.password)
        // const value = "helohgfglfhgdkhflkghdflbvfvkjdfbgdfgkjdfgkfh";
        const checkPassword = await user.verifyPassword(password);
        const token =  await user.getJWT();
        // console.log(token)
        if(!checkPassword){
            throw new Error("invalid password")
        }
            res.cookie("token",token)
            // res.cookie("newToken","VijayKanwal")
            return  res.status(200).json({
                message: "User logged in successfully",
                user: user,
                token: token
            });
            
        
    }
    catch(error){
        return res.status(400).send("user login failed  " + error.message)

    }
})
authRouter.post("/logout",userAuth , async(req,res)=>{
    try{
        // other way of login is 
        // res.cookie("token",null,{
        //     expiresIn:new Date(Date.now()),
        // })
        res.clearCookie('token')
        
        return res.status(200).json({message:"user logged out successfully"})
    }
    catch(error){
       
        return res.status(400).send("Something went wrong: " + error.message)
    }
})
authRouter.get('/check', async(req,res)=>{
    res.status(200).send("everthing is okay")
  })
module.exports = authRouter