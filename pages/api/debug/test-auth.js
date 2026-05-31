export default function handler(req, res) {
  return res.status(403).json({ success: false, message: 'Debug endpoint disabled' });
}
