import { verifyToken, extractTokenFromHeader } from '../lib/jwt';
import connectDB from '../lib/mongodb';
import User from '../models/User';

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = extractTokenFromHeader(authHeader);

    // If no token in header, check cookies as fallback
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    // Connect to database and get user
    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user to request object
    req.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      currency: user.currency,
      fullName: user.fullName,
      createdAt: user.createdAt
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      await connectDB();
      const user = await User.findById(decoded.id);

      if (user && user.isActive) {
        req.user = {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          currency: user.currency,
          fullName: user.fullName,
          createdAt: user.createdAt
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};