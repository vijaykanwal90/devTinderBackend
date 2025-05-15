require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Middleware to protect routes by verifying JWT.
 */
async function userAuth(req, res, next) {
  try {
    // console.log("one auth middleware")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    // console.log(token)
    // Verify token and get payload
    const payload = jwt.verify(token, 'devTinder@123');

    // Support both `userId` and `id` keys
    const userId = payload.userId || payload.id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Fetch user and exclude sensitive fields
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { userAuth };
