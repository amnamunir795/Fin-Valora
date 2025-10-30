import connectDB from '../../../lib/mongodb';
import Budget from '../../../models/Budget';
import { authenticateToken } from '../../../middleware/auth';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to DB
    await connectDB();

    // Support authenticateToken middleware that calls next(req, res)
    const user = await new Promise((resolve, reject) => {
      // If authenticateToken returns a promise, prefer that
      try {
        const maybePromise = authenticateToken(req, res, (err) => {
          if (err) return reject(err);
          // expect authenticateToken to set req.user
          if (!req.user) return reject(new Error('Authentication failed: no user on request'));
          resolve(req.user);
        });

        // If authenticateToken returns a Promise (async version), await it
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise
            .then(() => {
              if (!req.user) return reject(new Error('Authentication failed: no user on request'));
              resolve(req.user);
            })
            .catch(reject);
        }
      } catch (err) {
        reject(err);
      }
    });

    // user id may be on user.id or user._id
    const userId = user.id || user._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Make sure we pass an ObjectId or string accepted by mongoose
    const idToQuery = mongoose.Types.ObjectId.isValid(userId)
  ? new mongoose.Types.ObjectId(userId)
  : userId;

    // Find current month's budget
    const currentBudget = await Budget.findCurrentBudget(idToQuery);

    if (!currentBudget) {
      return res.status(404).json({
        success: false,
        message: 'No active budget found for current month'
      });
    }

    // Return summary (getSummary is an instance method on schema)
    return res.status(200).json({
      success: true,
      budget: currentBudget.getSummary()
    });
  } catch (error) {
    console.error('Get current budget error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
