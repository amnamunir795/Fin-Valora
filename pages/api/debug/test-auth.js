import { authenticateToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Apply authentication middleware
  return new Promise((resolve) => {
    authenticateToken(req, res, () => {
      try {
        res.status(200).json({
          success: true,
          message: 'Authentication successful',
          user: req.user,
          headers: {
            authorization: req.headers.authorization,
            cookie: req.headers.cookie
          }
        });
        resolve();
      } catch (error) {
        console.error('Test auth error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
        resolve();
      }
    });
  });
}