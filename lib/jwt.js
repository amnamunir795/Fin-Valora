import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('[FinValora] WARNING: JWT_SECRET not set — using insecure dev key. Set JWT_SECRET in .env.local for production.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET || 'dev-insecure-key-do-not-use-in-production', {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'finvalora',
    audience: 'finvalora-users'
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET || 'dev-insecure-key-do-not-use-in-production', {
      issuer: 'finvalora',
      audience: 'finvalora-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

// Create token payload from user object
export const createTokenPayload = (user) => {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    currency: user.currency,
    fullName: user.fullName,
    iat: Math.floor(Date.now() / 1000) // issued at time
  };
};