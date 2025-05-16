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
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
      console.log("→ PATCH /profile/edit called");
  
      const formData = req.body;
      const loggedInUser = req.user;
  
      // Validate data
      if (!validateProfileEditData(formData)) {
        return res.status(400).json({ message: "Invalid profile data" });
      }
  
      // Update fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined) {
          loggedInUser[key] = formData[key];
        }
      });
  
      // Save updated user
      await loggedInUser.save();
  
      res.status(200).json({
        message: "Profile updated successfully",
        data: loggedInUser
      });
  
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res.status(500).json({
        message: "User update failed",
        error: error.message
      });
    }
  });
module.exports = profileRouter