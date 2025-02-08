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
const ConnectionRequest = require("./models/connectionRequest.model.js");

// Middleware for JSON and cookies



// const corsOptions = {
//     credentials: true, // Enable credentials sharing (cookies, authorization headers)
//     origin: 'https://dev-tinder-ui-five.vercel.app', // Frontend origin
//     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allowed methods
//   };
// app.use(cors(corsOptions));
// app.options('*', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://dev-tinder-ui-five.vercel.app');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.status(200).end();  // Send 200 OK response for preflight
//   });
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'https://dev-tinder-ui-five.vercel.app');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//     next();
// });
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    }));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//     next();
// });
// app.all('*',cors())
// app.options('*', cors());
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
//     // res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//     next();
//     })
app.use(express.json());
app.use(cookieParser());
app.use("/api/", authRouter);
app.use("/api/", profileRouter);
app.use("/api/", requestRouter);
app.use("/api/", userRouter);
app.get("/", (req, res) => {
    res.send("Welcome to DevTinder Backend");
});
// Get user by email
app.get("/user", async (req, res) => {
    const useremail = req.body.email;
    try {
        const user = await User.findOne({ email: useremail });
        res.send(user);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Get user by ID
app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        res.send(user);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Update user
app.patch("/userUpdate/:id", async (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            { _id: userId },
            data,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        if (!user) {
            res.status(404).send("User not found");
        } else if (data.skills.length > 10) {
            throw new Error("Too many skills are added");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send("User updatation failed: " + error.message);
    }
});

// Server and database setup
const PORT = 3000;
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is successfully listening on port ${PORT}`);
        });
    })
    .catch(() => {
        console.log("Some error occurred during connection");
    });
