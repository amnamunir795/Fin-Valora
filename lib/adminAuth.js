import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'admin-dev-secret-change-me';

/**
 * Verify admin token from request.
 * Checks Authorization header first, then cookie fallback.
 */
export function verifyAdminAuth(req) {
  let token = null;

  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token && req.cookies?.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return { success: false, message: 'Admin authentication required' };
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET, {
      issuer: 'finvalora-admin',
      audience: 'finvalora-admin'
    });

    if (!decoded.isAdmin) {
      return { success: false, message: 'Not an admin token' };
    }

    return {
      success: true,
      admin: {
        username: decoded.username,
        loginAt: decoded.loginAt
      }
    };
  } catch (error) {
    return { success: false, message: 'Invalid or expired admin token' };
  }
}

/**
 * Generate admin JWT token
 */
export function generateAdminToken(username) {
  return jwt.sign(
    {
      username,
      isAdmin: true,
      loginAt: new Date().toISOString()
    },
    ADMIN_JWT_SECRET,
    {
      expiresIn: '24h',
      issuer: 'finvalora-admin',
      audience: 'finvalora-admin'
    }
  );
}
