import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Get all users (without passwords)
    const users = await User.find({}).select('-password');
    
    return res.status(200).json({
      success: true,
      userCount: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Debug test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}