import connectDB from '../../../lib/mongodb';
import { generateAdminToken } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Read admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('[Admin] ADMIN_USERNAME or ADMIN_PASSWORD not set in .env.local');
      return res.status(500).json({ success: false, message: 'Admin credentials not configured' });
    }

    // Compare credentials
    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Generate admin token
    const token = generateAdminToken(username);

    // Set as HTTP-only cookie
    res.setHeader('Set-Cookie',
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict`
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: { username }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
