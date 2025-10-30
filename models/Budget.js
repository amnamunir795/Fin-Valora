import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  monthlyIncome: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  spendingLimit: {
    type: Number,
    required: true,
    min: 0
  },
  savingGoal: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  // Track actual spending and savings
  currentSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  currentSaved: {
    type: Number,
    default: 0,
    min: 0
  },
  // Budget period (month/year for reference)
  budgetMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  budgetYear: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
budgetSchema.index({ userId: 1, budgetYear: 1, budgetMonth: 1 });

// Virtual for remaining budget
budgetSchema.virtual('remainingBudget').get(function() {
  return this.spendingLimit - this.currentSpent;
});

// Virtual for savings progress percentage
budgetSchema.virtual('savingsProgress').get(function() {
  if (this.savingGoal === 0) return 0;
  return Math.min((this.currentSaved / this.savingGoal) * 100, 100);
});

// Virtual for spending progress percentage
budgetSchema.virtual('spendingProgress').get(function() {
  if (this.spendingLimit === 0) return 0;
  return Math.min((this.currentSpent / this.spendingLimit) * 100, 100);
});

// Ensure virtuals are included in JSON output
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

// Static method to find current budget for user
budgetSchema.statics.findCurrentBudget = function(userId) {
  const now = new Date();
  return this.findOne({
    userId,
    budgetYear: now.getFullYear(),
    budgetMonth: now.getMonth() + 1,
    isActive: true
  });
};

// Instance method to check if budget is over limit
budgetSchema.methods.isOverBudget = function() {
  return this.currentSpent > this.spendingLimit;
};

// Instance method to get budget summary
budgetSchema.methods.getSummary = function() {
  return {
    totalIncome: this.monthlyIncome,
    spendingLimit: this.spendingLimit,
    currentSpent: this.currentSpent,
    remainingBudget: this.remainingBudget,
    savingGoal: this.savingGoal,
    currentSaved: this.currentSaved,
    savingsProgress: this.savingsProgress,
    spendingProgress: this.spendingProgress,
    currency: this.currency,
    isOverBudget: this.isOverBudget()
  };
};

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);