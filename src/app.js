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
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    // origin: 'http://localhost:5173',
    //   // Frontend origin
    origin:'https://dev-tinder-ui-five.vercel.app',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    optionsSuccessStatus: 200,
    credentials:'true',

}));

// Handle preflight requests (OPTIONS)
// app.options('*', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.sendStatus(204);  // No content for preflight request
// });

// Route handling
app.use("/api/", authRouter);
app.use("/api/", profileRouter);
app.use("/api/", requestRouter);
app.use("/api/", userRouter);

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
