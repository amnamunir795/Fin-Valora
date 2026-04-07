import mongoose from 'mongoose';

const ocrScanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Original file information
  originalFile: {
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  // OCR processing status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  // Raw OCR text output
  rawText: {
    type: String,
    default: ''
  },
  // Extracted structured data
  extractedData: {
    amount: {
      value: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      rawText: String
    },
    merchant: {
      value: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      rawText: String
    },
    date: {
      value: Date,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      rawText: String
    },
    category: {
      value: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      suggestedCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    },
    currency: {
      value: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    // Additional extracted fields
    tax: {
      value: Number,
      confidence: Number
    },
    tip: {
      value: Number,
      confidence: Number
    },
    subtotal: {
      value: Number,
      confidence: Number
    }
  },
  // Overall confidence score
  overallConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Processing metadata
  processingTime: {
    type: Number, // milliseconds
    default: 0
  },
  ocrEngine: {
    type: String,
    default: 'tesseract' // or 'google-vision', 'aws-textract', etc.
  },
  // User actions
  isReviewed: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  userCorrections: {
    amount: Number,
    merchant: String,
    date: Date,
    category: String,
    notes: String
  },
  // Related transaction (if created)
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  },
  // Error information (if processing failed)
  error: {
    message: String,
    code: String,
    details: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
ocrScanSchema.index({ userId: 1, createdAt: -1 });
ocrScanSchema.index({ userId: 1, status: 1 });
ocrScanSchema.index({ userId: 1, isReviewed: 1 });

// Static method to get recent scans
ocrScanSchema.statics.getRecentScans = function(userId, limit = 10) {
  return this.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};

// Static method to get pending scans
ocrScanSchema.statics.getPendingScans = function(userId) {
  return this.find({ 
    userId, 
    status: { $in: ['pending', 'processing'] }
  }).sort({ createdAt: -1 });
};

// Static method to get scans needing review
ocrScanSchema.statics.getScansNeedingReview = function(userId) {
  return this.find({ 
    userId, 
    status: 'completed',
    isReviewed: false
  }).sort({ createdAt: -1 });
};

// Instance method to mark as reviewed
ocrScanSchema.methods.markAsReviewed = function(approved = false, corrections = {}) {
  this.isReviewed = true;
  this.isApproved = approved;
  if (Object.keys(corrections).length > 0) {
    this.userCorrections = corrections;
  }
  return this.save();
};

// Instance method to get processing summary
ocrScanSchema.methods.getSummary = function() {
  return {
    id: this._id,
    filename: this.originalFile.originalName,
    status: this.status,
    extractedData: this.extractedData,
    overallConfidence: this.overallConfidence,
    isReviewed: this.isReviewed,
    isApproved: this.isApproved,
    createdAt: this.createdAt,
    hasTransaction: !!this.transactionId,
    error: this.error,
  };
};

// Instance method to check if data is reliable
ocrScanSchema.methods.isDataReliable = function(threshold = 70) {
  return this.overallConfidence >= threshold;
};

export default mongoose.models.OCRScan || mongoose.model('OCRScan', ocrScanSchema);