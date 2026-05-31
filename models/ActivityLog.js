import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'transaction_created',
      'transaction_updated',
      'transaction_deleted',
      'budget_created',
      'budget_updated',
      'category_created',
      'category_updated',
      'category_deleted',
      'ocr_uploaded',
      'ocr_expense_created',
      'user_login',
      'user_signup',
      'report_generated'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: ['Transaction', 'Budget', 'Category', 'OCRScan', 'User', 'Report']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  amount: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  ip: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, action: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, entityType: 1, createdAt: -1 });

// Static: get recent activity for user
activityLogSchema.statics.getRecentActivity = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static: get activity by type
activityLogSchema.statics.getActivityByType = function(userId, action, limit = 20) {
  return this.find({ userId, action })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static: get activity summary (counts by action type)
activityLogSchema.statics.getActivitySummary = function(userId, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: since } } },
    { $group: { _id: '$action', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

// Instance: get safe JSON
activityLogSchema.methods.getSummary = function() {
  return {
    id: this._id,
    action: this.action,
    entityType: this.entityType,
    entityId: this.entityId,
    description: this.description,
    metadata: this.metadata,
    amount: this.amount,
    currency: this.currency,
    category: this.category,
    createdAt: this.createdAt
  };
};

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
