import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken, createTokenPayload } from '../../../lib/jwt';
import { SUPPORTED_CURRENCIES } from '../../../constants/currencies';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Connect to database
    await connectDB();

    const { firstName, lastName, email, password, confirmPassword, currency } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !currency) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate currency
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      return res.status(400).json({
        success: false,
        message: `Currency ${currency} is not supported`
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user with all required data
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      currency,
      isActive: true, // Explicitly set active status
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating user with data:', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      currency: userData.currency,
      isActive: userData.isActive
    });

    const user = new User(userData);

    // Save user to database
    await user.save();
    
    console.log('User saved successfully:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      currency: user.currency,
      isActive: user.isActive,
      createdAt: user.createdAt
    });

    // Create JWT token
    const tokenPayload = createTokenPayload(user);
    const token = generateToken(tokenPayload);

    // Return success response with token
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currency: user.currency,
      fullName: user.fullName,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse,
      token: token
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}