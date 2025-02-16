const express= require("express")
const User = require("../models/user.model")

const profileRouter = express.Router()
// const {userAuth }= require("../middlewares/auth.middleware")
const {userAuth} = require("../middlewares/auth.middleware")
const { validateProfileEditData } = require("../utils/validations")
// const {userAuthh} = userAuth
profileRouter.get("/profile",userAuth ,async(req,res)=>{
    try{
        // console.log("in profile section")
        const user = req.user;

        if(!user){
            throw new Error("User not found")
        }

        res.status(200).json({message:"success",data:user})
    }
    catch(error){
        res.status(400).send(error + "something went wrong")
    }
    // const {token} = req.cookies;
    
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    // const user = req.user;
    // const {_id} = user;
    // // console.log(userId)
    // // console.log(_id)
    // console.log(req.body)
    // const data = req.body;
    // console.log(data)
    try{
        console.log("profile edit")
        const formData = req.body;
        // console.log(formData)
        if(!validateProfileEditData(formData)){
            return res.status(400).send(" on update edit profile data")
        }
    
    // console.log("in the edit profile section")
    const loggedInUser = req.user;
    // console.log(formData)
    Object.keys(formData).forEach((key) => (loggedInUser[key] = formData[key]))
    // console.log()
    await loggedInUser.save()
    // res.status(200).send(`${loggedInUser.firstName} your Profile updated successfully`)
    
    res.status(200).json({message:"success",data:loggedInUser})

} catch (error) {
    // console.log("some error while profile updation")
    res.status(500).json({message:"User updatation failed " , error:error.message})
    
}
})
module.exports = profileRouter