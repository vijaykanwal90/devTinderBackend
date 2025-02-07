const express = require("express");
const authRouter = express.Router();
const { validateSignupdata } = require("../utils/validations");
const User = require("../models/user.model");
// const {userAuth} = require("../middlewares/auth.middleware")
const { userAuth } = require("../middlewares/auth.middleware");
// const {userAuth} = userAuth
const bcrypt = require("bcryptjs");
authRouter.all('*',cors())
authRouter.post("/signup", async (req, res) => {
  // console.log(email)
  try {
    //    const isSignUpValid = await validateSignupdata(req);
    const { firstName, lastName, email, password } = req.body;
    // console.log(firstName)
    console.log("in signup");
    validateSignupdata(req);
    console.log("after validate ");
    const exists = await User.findOne({ email });
    // const exists = await User.find(firstName);
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword)

    if (exists) {
      return res.status(400).send("User with this email already exists");
    } else {
      const user = new User({
        firstName,
        lastName,
        password: hashedPassword,
        email,
      });

      await user.save();

      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "user registration failed  ", error: error.message });
  }
});


authRouter.post('/login', async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
// res.setHeader("Access-Control-Allow-Credentials", "true");
// res.setHeader("Access-Control-Max-Age", "1800");
// res.setHeader("Access-Control-Allow-Headers", "content-type");
// res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
  const { email, password } = req.body;
  console.log("in login")
  try {
    // console.log(email);

    const user = await User.findOne({ email });
    // console.log("find one error ")
    if (!user) {
      throw new Error("Invalid email");
    }
    // console.log(user.password)
    // const value = "helohgfglfhgdkhflkghdflbvfvkjdfbgdfgkjdfgkfh";
    const checkPassword = await user.verifyPassword(password);
    const token = await user.getJWT();
    // console.log(token)
    if (!checkPassword) {
      // console.log("in invalid password")
      // return res.status(401).send("Invalid password");
      throw new Error("invalid password");
    }
    res.cookie("token", token);
    // res.cookie("newToken","VijayKanwal")
    // const userData = await user.json();
  return res.header("Access-Control-Allow-Origin", 'https://dev-tinder-ui-five.vercel.app').res.status(200).json({
      message: "User logged in successfully",
      data: user,
      token: token,
    });
  // res.status(200).send( user, token);
  } catch (error) {
    if (error.message === "Invalid email") {
      return res.status(401).send("Invalid email");
    }
    if (error.message === "invalid password") {
      return res.status(401).send("invalid password");
    }
    return res
      .status(501)
      .json({ message: "user login failed  ", error: error.message });
  }
});
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    // other way of login is
    // res.cookie("token",null,{
    //     expiresIn:new Date(Date.now()),
    // })
    console.log("in logout")
    console.log(req.user.token);

    res.clearCookie("token");
    console.log("after clear cookie");
    console.log(req.user.token)

    res.status(200).json({ message: "user logged out successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "user login failed  ", error: error.message });
  }
});

module.exports = authRouter;
