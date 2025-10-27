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
        // Return user data from middleware
        res.status(200).json({
          success: true,
          user: req.user
        });
        resolve();
      } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
        resolve();
      }
    });
  });
}