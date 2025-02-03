const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user.model.js");
const cookieParser = require("cookie-parser")
const cors = require('cors')
const {userAuth }= require("./middlewares/auth.middleware.js")
// const {userAuth} = require("./middlewares/auth.middleware.js")
const authRouter = require("./routes/auth.route.js")
const profileRouter = require("./routes/profile.route.js")
const requestRouter = require("./routes/request.route.js")
const userRouter = require("./routes/user.route.js");
const ConnectionRequest = require("./models/connectionRequest.model.js");
// always ensure to connect database first then start server

// app.post("/signup", async (req,res)=>{
//         // const {firstName,lastName,email, password,age,gender} = req.body;
//         const userObj = {
//                 firstName:"Vijay",
//                 lastName:"Kanwal",
//                 emailId:"vijay@gmail.com",
//                 age:22,
//                 password:"1234321",
//                 gender:"Male"

//         }
//         // creating a new instinct of User
//         const user = new User(userObj);
//         await user.save();
//         res.send("user added successfully")

// })

app.use(express.json());
app.use(cookieParser())
var corsOptions = {
    origin:'http://localhost:5173',
    // allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials:true
}
app.use(cors(corsOptions))

app.use("/",authRouter)
app.use("/api/",profileRouter)
app.use("/api/",requestRouter)
app.use("/",userRouter)



// get user by email

app.get("/user", async (req,res)=>{
    const useremail = req.body.email;
    try{
        const user = await User.findOne({email:useremail})
        res.send(user);

    }
    catch(error){
        res.status(400).send("something went wrong")
    }

})


app.get("/user/:id", async (req,res)=>{
    const userId = req.params.id;
    try{
        const user = await User.findById(userId)
        res.send(user);

    }
    catch(error){
        res.status(400).send("something went wrong")
    }

})
// feed api


// update the user

app.patch("/userUpdate/:id", async(req,res)=>{
    const userId = req.params?.id;
    // console.log(userId)
    const data = req.body;
    // console.log("Received data:", data);
    // console.log("Object keys:", Object.keys(data));

    // console.log(data)
   
    // console.log(user)
    

    // const isUpdateAllowed = Object.keys(data).every(k=>)
// "id":"67418039b38041c13e8af19a",
    // "email":"alia22t@gmail.com"
    // "firstName":"Virat ",
    try {
    //     const allowedUpdates = ["age","gender"]
    //     // console.log(typeof(allowedUpdates[0])
    //     const keyss = Object.keys(data)
    //     console.log(keyss)
    //     const isUpdateAllowed = Object.keys(data).every( (k)=>{
    //         // console.log(typeof(k))
    //        allowedUpdates.includes(k)
    //     //    console.log(res)
        
    // })
    // console.log(allowedUpdates)
    // console.log(isUpdateAllowed)
    // if(!isUpdateAllowed){

    //     // res.status(400).send("update not allowed")
    //     throw new Error("isUpdateAllowed is false")
    // }
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true
        })
        if(!user){
            // console.log("user not found");
        res.status(404).send("User not found")

        }
        if(data.skills.length> 10){
            throw new Error("too many skills are addedd")
        }
        res.send(user)
    } catch (error) {
        // console.log("user not found")
        res.status(500).send("User updatation failed " + error.message)
        
    }
})

// app.use("/",(req,res,next)=>{
//     console.log("home route")
//     // res.send("home res")
//     // next()
//     // next()
// },(req,res,next)=>{
//     console.log("user route")
//     // res.send("user respone ") 
//     // next()
// })













// app.use("/user",)
const PORT = 3000
console.log(PORT)
connectDB()
.then(()=>{
    console.log("datbase connected succefully")
    app.listen(PORT,()=>{
        console.log(`server is successfully listening on port ${PORT}`)
    })
})
.catch(()=>{
    console.log("some error occured during connection ")
})
