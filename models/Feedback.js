import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    default: 'Anonymous'
  },
  userEmail: {
    type: String,
    default: null
  },
  mood: {
    type: String,
    enum: ['happy', 'neutral', 'sad'],
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  feedbackType: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'general'],
    default: 'general'
  },
  subject: {
    type: String,
    maxlength: 200,
    default: ''
  },
  features: [{
    type: String,
    enum: ['integration', 'search', 'customize']
  }],
  message: {
    type: String,
    maxlength: 600,
    default: ''
  },
  ip: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ userId: 1, createdAt: -1 });

// Average rating static
FeedbackSchema.statics.getAverageRating = function() {
  return this.aggregate([
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
};

// Mood distribution static
FeedbackSchema.statics.getMoodDistribution = function() {
  return this.aggregate([
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

// Feature popularity static
FeedbackSchema.statics.getFeaturePopularity = function() {
  return this.aggregate([
    { $unwind: '$features' },
    { $group: { _id: '$features', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
