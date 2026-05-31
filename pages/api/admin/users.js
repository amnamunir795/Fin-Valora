import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import ActivityLog from '../../../models/ActivityLog';
import Feedback from '../../../models/Feedback';
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

    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with their activity counts
    const [users, totalUsers, totalFeedback, recentSignups] = await Promise.all([
      User.find({ isActive: true })
        .select('firstName lastName email currency createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.min(parseInt(limit), 100))
        .lean(),
      User.countDocuments({ isActive: true }),
      Feedback.countDocuments(),
      User.find({ isActive: true })
        .select('firstName lastName email createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // Get activity count per user
    const userActivityCounts = await ActivityLog.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 }, lastActivity: { $max: '$createdAt' } } }
    ]);

    const activityMap = {};
    userActivityCounts.forEach(u => {
      activityMap[u._id.toString()] = { count: u.count, lastActivity: u.lastActivity };
    });

    const usersWithActivity = users.map(u => ({
      id: u._id,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      email: u.email,
      currency: u.currency,
      joinedAt: u.createdAt,
      activityCount: activityMap[u._id.toString()]?.count || 0,
      lastActivity: activityMap[u._id.toString()]?.lastActivity || null
    }));

    return res.status(200).json({
      success: true,
      users: usersWithActivity,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalUsers / parseInt(limit))
      },
      stats: {
        totalUsers,
        totalFeedback,
        recentSignups: recentSignups.map(u => ({
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          email: u.email,
          joinedAt: u.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
