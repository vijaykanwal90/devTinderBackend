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
const server = http.createServer(app);
require('dotenv').config();

// Initialize express app
const app = express();

// ✅ CORS Setup
const allowedOrigins = ['https://dev-tinder-ui-seven.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from frontend or if origin is undefined (i.e., no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies, headers, etc.
}));

// Middlewares for JSON and cookies parsing
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
app.use('/api', authRouter);
app.use('/api', profileRouter);
app.use('/api', requestRouter);
app.use('/api', userRouter);
app.use('/api', paymentRouter);

// Example: Handle POST request for signup
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  // Your signup logic here (e.g., create a user, save to DB)
  // After creating the user, send a response
  res.status(200).json({ message: 'User signed up successfully', data: { email } });
});

// Handle preflight requests (OPTIONS)
app.options('*', cors());

// Home route (for testing)
app.get('/', (req, res) => {
  res.send('Welcome to DevTinder Backend');
});

// Server configuration
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

