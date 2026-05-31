import connectDB from '../../../lib/mongodb';
import ActivityLog from '../../../models/ActivityLog';
import { verifyRequestAuth } from '../../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const authResult = await verifyRequestAuth(req);
    if (!authResult.success) {
      return res.status(401).json({ success: false, message: authResult.message });
    }

    const userId = authResult.user.id;
    const { limit = 20, action, summary } = req.query;

    // If summary=true, return activity counts by type
    if (summary === 'true') {
      const days = parseInt(req.query.days) || 30;
      const counts = await ActivityLog.getActivitySummary(userId, days);
      return res.status(200).json({
        success: true,
        summary: counts,
        periodDays: days
      });
    }

    // Otherwise return activity list
    const query = { userId };
    if (action) {
      query.action = action;
    }

    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit) || 20, 100))
      .lean();

    return res.status(200).json({
      success: true,
      count: activities.length,
      activities: activities.map(a => ({
        id: a._id,
        action: a.action,
        entityType: a.entityType,
        entityId: a.entityId,
        description: a.description,
        amount: a.amount,
        currency: a.currency,
        category: a.category,
        metadata: a.metadata,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    console.error('Activity log API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
