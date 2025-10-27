import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

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

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user with all fields (including password for verification)
    const user = await User.findByEmail(email).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        searchedEmail: email.toLowerCase().trim()
      });
    }

    // Return comprehensive user info (for debugging only)
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currency: user.currency,
        isActive: user.isActive,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        fullName: user.fullName
      },
      message: 'User found successfully'
    });

  } catch (error) {
    console.error('User info debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}