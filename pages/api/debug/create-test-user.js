import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Check if test user already exists
    const existingUser = await User.findByEmail('test@example.com');
    
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: 'Test user already exists',
        user: {
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName
        }
      });
    }
    
    // Create test user
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      currency: 'USD'
    });
    
    await testUser.save();
    
    return res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      user: {
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName
      },
      credentials: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
  } catch (error) {
    console.error('Create test user error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}