import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken, createTokenPayload } from '../../../lib/jwt';

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

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
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

    // Find user by email and include password for comparison
    const user = await User.findByEmail(email).select('+password');
    
    if (!user) {
      console.log(`Login attempt failed: User not found for email: ${email.toLowerCase().trim()}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log(`Login attempt: User found for email: ${email.toLowerCase().trim()}, isActive: ${user.isActive}`);

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log(`Login attempt failed: Invalid password for email: ${email.toLowerCase().trim()}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log(`Login successful for email: ${email.toLowerCase().trim()}`);

    // Create JWT token
    const tokenPayload = createTokenPayload(user);
    const token = generateToken(tokenPayload);

    // Set token as HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);

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

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
}