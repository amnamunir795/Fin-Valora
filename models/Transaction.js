import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  merchant: {
    type: String,
    trim: true,
    maxlength: [100, 'Merchant name cannot be more than 100 characters'],
    default: ''
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['Income', 'Expense'],
      message: '{VALUE} is not a valid transaction type'
    }
  },
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    index: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  // OCR related fields
  isFromOCR: {
    type: Boolean,
    default: false
  },
  ocrData: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    originalText: String,
    extractedFields: {
      amount: String,
      merchant: String,
      date: String,
      category: String
    }
  },
  // Receipt/bill attachment
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  // Additional metadata
  tags: [String],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters'],
    default: ''
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    interval: {
      type: Number,
      min: 1
    },
    endDate: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1, date: -1 });
transactionSchema.index({ budgetId: 1, type: 1 });

// Static method to get transactions by date range
transactionSchema.statics.findByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('categoryId').sort({ date: -1 });
};

// Static method to get transactions by category
transactionSchema.statics.findByCategory = function(userId, categoryId, limit = 10) {
  return this.find({ userId, categoryId })
    .populate('categoryId')
    .sort({ date: -1 })
    .limit(limit);
};

// Static method to get monthly summary
transactionSchema.statics.getMonthlySummary = function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get category breakdown
transactionSchema.statics.getCategoryBreakdown = function(userId, type, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: type,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $unwind: '$category'
    },
    {
      $group: {
        _id: '$categoryId',
        categoryName: { $first: '$category.name' },
        categoryColor: { $first: '$category.color' },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

// Instance method to get transaction summary
transactionSchema.methods.getSummary = function() {
  return {
    id: this._id,
    amount: this.amount,
    description: this.description,
    merchant: this.merchant,
    type: this.type,
    date: this.date,
    currency: this.currency,
    isFromOCR: this.isFromOCR,
    tags: this.tags,
    notes: this.notes
  };
};

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);