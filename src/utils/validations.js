const validator = require("validator")
const validateSignupdata = (req)=>{
    const {firstName,lastName,email,password} = req.body;
    console.log( "in validation " + email)
    if(!firstName || !lastName){
        throw new Error("first name or last name cannot be empty")
    }
    else if(!validator.isEmail(email)){
        console.log("email is wrong")
        throw new Error("invalid email")

    }
    else if(!validator.isStrongPassword(password)){
        console.log("password is weak")
        throw new Error("password is weak")
    }
}
const validateProfileEditData = (formData)=>{
    const allowedEditField= ["firstName","lastName","photoUrl","gender","age","about"]
    console.log("in validate profile edit data")
    const isEditAllowed =  Object.keys(formData).every(field =>allowedEditField.includes(field))
    console.log("done")
    return isEditAllowed
}
module.exports = {
    validateSignupdata,
    validateProfileEditData

}