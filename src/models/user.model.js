// const { JsonWebTokenError } = require("jsonwebtoken")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const validator = require("validator")
const validateSignupdata = require("../utils/validations")
const userSchema = new mongoose.Schema({
      firstName:{
        type:String,
        required:true,
        // unique:true,
        minLength:4,
        maxLength:50
      },
      lastName:{
        type:String
      },
      email:{
        type:String,
        required:true,
        unique:true,
        
        lowercase:true,
        trim:true,
        validate(value){
          if(!validator.isEmail(value)){
            throw new Error("email is not valid")
          }
        }

      },
      password:{
        type:String
      },
      age:{
        type:Number,
        default:18
      },
      photoUrl:{
        type: String,
        default:"https://cdn-icons-png.flaticon.com/512/21/21104.png"
      },
      gender:{
        type:String,
        // validate by default only work while creating a new document to use it while updating the document we have to pass the runValidator as option
        validate(value){
          if(!["male","female","other"].includes(value)){
            throw new Error ("Gender data is not valid")
          }
        }
      },
      about:{
        type:String,
        maxLength:500,
        default: "this is about me "
      },
      skills: {
        type: [String],  // Assuming skills should be an array of strings
        
      }
      
},{timestamps:true})
userSchema.methods.verifyPassword = async function (passwordByUser){
  const user = this;
  const passwordHash = user.password;
  const isValid = await bcrypt.compare(passwordByUser, passwordHash);
  return isValid;
}

userSchema.methods.getJWT = async function (){
  // this doest not work with arrow functions
  const user = this;
  const token = await jwt.sign({id:user._id},"devTinder@123",{expiresIn:"1d"});
  return token;
}

const User = mongoose.model("User",userSchema)
// User.init().catch(error => console.log("Error creating indexes: ", error));
module.exports = User