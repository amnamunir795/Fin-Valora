import { authenticateToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  // Apply authentication middleware
  return new Promise((resolve) => {
    authenticateToken(req, res, () => {
      try {
        // This is a protected route - user data is available in req.user
        res.status(200).json({
          success: true,
          message: 'This is a protected route',
          user: req.user,
          timestamp: new Date().toISOString()
        });
        resolve();
      } catch (error) {
        console.error('Protected route error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
        resolve();
      }
    });
  });
}