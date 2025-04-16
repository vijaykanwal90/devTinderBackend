const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user.model.js");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { userAuth } = require("./middlewares/auth.middleware.js");
const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const requestRouter = require("./routes/request.route.js");
const userRouter = require("./routes/user.route.js");
const paymentRouter = require("./routes/payment.route.js");
const ConnectionRequest = require("./models/connectionRequest.model.js");

const initializeSocket = require('./utils/socket.js');
const http= require('http');
const server = http.createServer(app);

// Middleware for JSON and cookies
require('dotenv').config();

const originURL = process.env.ORIGIN || 'http://localhost:3000';
console.log(originURL)
// console.log(process.env.ORIGIN)
app.use(cors({
    credentials: true, 
    origin: originURL,
    // origin:true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    // enablePreflight: true,
    maxAge: 3600,
    allowedHeaders: ['Content-Type', 'Authorization'],
    
    // maxAge: 3600
  

    }));

// Headers('Access-Control-Allow-Origin', 'https://dev-tinder-ui-eight.vercel.app');
// Headers('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
// Headers('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// Headers('Access-Control-Allow-Credentials', true);
// Headers('Access-Control-Max-Age', 3600);
// Headers('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');

// app.options('*',cors())
initializeSocket(server);

const corsOptions = {
    origin: originURL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600
  };
  
  app.use(cors(corsOptions));
  
  // Explicitly handle preflight OPTIONS
  app.options('*', cors(corsOptions));
  

app.use(express.json());
app.use(cookieParser());
app.use("/api/", authRouter);
app.use("/api/", profileRouter);
app.use("/api/", requestRouter);
app.use("/api/", userRouter);
app.use("/api/",paymentRouter);
app.get("/", (req, res) => {
    
    console.log("dsfksfhk")
    
    res.send("Welcome to DevTinder Backend");
});
// Get user by email
// app.get("/user", async (req, res) => {
//     const useremail = req.body.email;
//     try {
//         const user = await User.findOne({ email: useremail });
//         res.send(user);
//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }
// });

// // Get user by ID
// app.get("/user/:id", async (req, res) => {
//     const userId = req.params.id;
//     try {
//         const user = await User.findById(userId);
//         res.send(user);
//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }
// });

// Update user
// app.patch("/userUpdate/:id", async (req, res) => {
//     const userId = req.params.id;
//     const data = req.body;
//     try {
//         const user = await User.findByIdAndUpdate(
//             { _id: userId },
//             data,
//             {
//                 returnDocument: "after",
//                 runValidators: true
//             }
//         );
//         if (!user) {
//             res.status(404).send("User not found");
//         } else if (data.skills.length > 10) {
//             throw new Error("Too many skills are added");
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(500).send("User updatation failed: " + error.message);
//     }
// });

// Server and database setup
const PORT = process.env.PORT || 5000;
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        server.listen(PORT, () => {
            console.log(`Server is successfully listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error)
        console.log("Some error occurred during connection");
    });
