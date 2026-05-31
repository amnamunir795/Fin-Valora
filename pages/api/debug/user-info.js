export default function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Debug endpoints are disabled in production' });
  }
  return res.status(403).json({ success: false, message: 'Debug endpoint disabled. Remove this guard to re-enable during development.' });
}
