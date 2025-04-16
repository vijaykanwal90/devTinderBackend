const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user.model.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { userAuth } = require("./middlewares/auth.middleware.js");
const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const requestRouter = require("./routes/request.route.js");
const userRouter = require("./routes/user.route.js");
const paymentRouter = require("./routes/payment.route.js");
const ConnectionRequest = require("./models/connectionRequest.model.js");
const initializeSocket = require("./utils/socket.js");
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();

// ✅ CORS Config
const originURL = process.env.ORIGIN || "http://localhost:3000";
console.log("Allowed CORS origin:", originURL);

const corsOptions = {
  origin: originURL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};

// ✅ Apply CORS Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight

// ✅ Body Parser & Cookie Parser
app.use(express.json());
app.use(cookieParser());

// ✅ Socket.io Setup
initializeSocket(server);

// ✅ Routes
app.use("/api/", authRouter);
app.use("/api/", profileRouter);
app.use("/api/", requestRouter);
app.use("/api/", userRouter);
app.use("/api/", paymentRouter);

app.get("/", (req, res) => {
  res.send("Welcome to DevTinder Backend");
});

// ✅ Start Server & Connect DB
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("DB Connection Error:", error);
  });
