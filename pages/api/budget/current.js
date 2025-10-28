import { connectToDatabase } from '../../../lib/mongodb';
import Budget from '../../../models/Budget';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Connect to database
    await connectToDatabase();

    // Find current month's budget
    const currentBudget = await Budget.findCurrentBudget(userId);

    if (!currentBudget) {
      return res.status(404).json({ 
        message: 'No active budget found for current month' 
      });
    }

    return res.status(200).json({
      success: true,
      budget: currentBudget.getSummary()
    });

  } catch (error) {
    console.error('Get current budget error:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
}