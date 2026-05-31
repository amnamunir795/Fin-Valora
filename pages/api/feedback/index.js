import connectDB from '../../../lib/mongodb';
import Feedback from '../../../models/Feedback';
import { verifyRequestAuth } from '../../../middleware/auth';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    // Submit feedback - auth optional (logged in = linked to user, anonymous = saved as guest)
    try {
      let userInfo = { id: null, name: 'Anonymous', email: null };
      try {
        const authResult = await verifyRequestAuth(req);
        if (authResult.success) {
          userInfo = {
            id: authResult.user.id,
            name: authResult.user.fullName || authResult.user.firstName || 'User',
            email: authResult.user.email
          };
        }
      } catch {
        // Not logged in — that's fine, save as anonymous
      }

      const { mood, rating, features, message, feedbackType, subject } = req.body;

      if (!rating) {
        return res.status(400).json({ success: false, message: 'Rating is required' });
      }

      const feedback = await Feedback.create({
        userId: userInfo.id,
        userName: userInfo.name,
        userEmail: userInfo.email,
        mood: mood || undefined,
        rating: Number(rating),
        features: features || [],
        message: message || '',
        feedbackType: feedbackType || 'general',
        subject: subject || '',
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null
      });

      return res.status(201).json({ success: true, feedback });
    } catch (error) {
      console.error('Feedback submit error:', error);
      return res.status(500).json({ success: false, message: 'Failed to save feedback' });
    }
  }

  if (req.method === 'GET') {
    // List feedback - requires admin auth
    try {
      const { verifyAdminAuth } = await import('../../../lib/adminAuth');
      const adminAuth = verifyAdminAuth(req);
      if (!adminAuth.success) {
        return res.status(401).json({ success: false, message: adminAuth.message });
      }

      const { limit = 50, page = 1 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [feedbacks, total, avgResult, moodDist, featurePop] = await Promise.all([
        Feedback.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Math.min(parseInt(limit), 100))
          .lean(),
        Feedback.countDocuments(),
        Feedback.getAverageRating(),
        Feedback.getMoodDistribution(),
        Feedback.getFeaturePopularity()
      ]);

      return res.status(200).json({
        success: true,
        feedbacks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: {
          averageRating: avgResult[0]?.avg ? Math.round(avgResult[0].avg * 10) / 10 : 0,
          totalFeedbacks: avgResult[0]?.count || 0,
          moodDistribution: moodDist,
          featurePopularity: featurePop
        }
      });
    } catch (error) {
      console.error('Feedback list error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load feedback' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
