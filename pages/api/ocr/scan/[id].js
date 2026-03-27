import connectDB from '../../../../lib/mongodb';
import OCRScan from '../../../../models/OCRScan';
import { verifyToken } from '../../../../middleware/auth';

export default async function handler(req, res) {
  await connectDB();

  // Verify authentication
  const authResult = await verifyToken(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const userId = authResult.user.id;
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const scan = await OCRScan.findOne({ _id: id, userId });
        
        if (!scan) {
          return res.status(404).json({
            success: false,
            message: 'Scan not found'
          });
        }

        res.status(200).json({
          success: true,
          scan: scan.getSummary()
        });
      } catch (error) {
        console.error('Error fetching scan:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch scan'
        });
      }
      break;

    case 'PATCH':
      try {
        const scan = await OCRScan.findOne({ _id: id, userId });
        
        if (!scan) {
          return res.status(404).json({
            success: false,
            message: 'Scan not found'
          });
        }

        const { approved, corrections } = req.body;

        await scan.markAsReviewed(approved, corrections);

        res.status(200).json({
          success: true,
          message: 'Scan updated successfully',
          scan: scan.getSummary()
        });
      } catch (error) {
        console.error('Error updating scan:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update scan'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
  }
}
