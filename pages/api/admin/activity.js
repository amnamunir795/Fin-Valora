import connectDB from '../../../lib/mongodb';
import ActivityLog from '../../../models/ActivityLog';
import User from '../../../models/User';
import { verifyAdminAuth } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const adminAuth = verifyAdminAuth(req);
    if (!adminAuth.success) {
      return res.status(401).json({ success: false, message: adminAuth.message });
    }

    const { limit = 50, page = 1, action, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    if (action && action !== 'all') {
      query.action = action;
    }
    if (userId) {
      query.userId = userId;
    }

    const [activities, total, userCount, actionSummary] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.min(parseInt(limit), 100))
        .populate('userId', 'firstName lastName email')
        .lean(),
      ActivityLog.countDocuments(query),
      User.countDocuments({ isActive: true }),
      ActivityLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Get daily activity for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyActivity = await ActivityLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      activities: activities.map(a => ({
        id: a._id,
        action: a.action,
        entityType: a.entityType,
        description: a.description,
        amount: a.amount,
        currency: a.currency,
        category: a.category,
        user: a.userId ? {
          id: a.userId._id,
          name: `${a.userId.firstName || ''} ${a.userId.lastName || ''}`.trim() || 'Unknown',
          email: a.userId.email
        } : null,
        createdAt: a.createdAt
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: {
        totalActivities: total,
        activeUsers: userCount,
        actionSummary,
        dailyActivity
      }
    });
  } catch (error) {
    console.error('Admin activity API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
