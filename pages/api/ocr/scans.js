import connectDB from '../../../lib/mongodb';
import OCRScan from '../../../models/OCRScan';
import { verifyRequestAuth } from '../../../middleware/auth';

export default async function handler(req, res) {
  await connectDB();

  // Verify authentication
  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const { status, limit = 10, needsReview } = req.query;

        let scans;

        if (needsReview === 'true') {
          scans = await OCRScan.getScansNeedingReview(userId);
        } else if (status) {
          scans = await OCRScan.find({ 
            userId, 
            status 
          }).sort({ createdAt: -1 }).limit(parseInt(limit));
        } else {
          scans = await OCRScan.getRecentScans(userId, parseInt(limit));
        }

        res.status(200).json({
          success: true,
          scans: scans.map(scan => scan.getSummary())
        });
      } catch (error) {
        console.error('Error fetching OCR scans:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch OCR scans'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
  }
}