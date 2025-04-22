const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { userAuth } = require('./middlewares/auth.middleware');
const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const requestRouter = require('./routes/request.route');
const userRouter = require('./routes/user.route');
const paymentRouter = require('./routes/payment.route');
const ConnectionRequest = require('./models/connectionRequest.model');
const initializeSocket = require('./utils/socket');
const http = require('http');
const app = express();

const server = http.createServer(app);
require('dotenv').config();

// CORS setup - must come BEFORE routes
const allowedOrigins = ['http://localhost:5173', 'https://dev-tinder-ui-seven.vercel.app'];
console.log("on backend")
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Respond to preflight requests
  } else {
    next();
  }
});

console.log("o backend2")

// Handle preflight requests (place this BEFORE routes)
// app.options('*', cors());
// Then add your middleware and routes
app.use(express.json());
app.use(cookieParser());


// Connect to the database
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.log('Database connection error:', error);
  });

// Initialize Socket.io
initializeSocket(server);

// Define your routes here

app.use('/api/auth', authRouter);
app.use('/api/dashboard', profileRouter);
app.use('/api/request', requestRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRouter);

// Home route (for testing)
app.get('/', (req, res) => {
  res.send('Welcome to DevTinder Backend');
});

// Handle preflight requests (OPTIONS)
// app.options('*', cors());  // This ensures preflight requests are allowed

// Server configuration
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
