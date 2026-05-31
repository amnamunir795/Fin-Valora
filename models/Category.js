import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: {
      values: ['Income', 'Expense'],
      message: '{VALUE} is not a valid category type'
    }
  },
  color: {
    type: String,
    default: '#6B7280', // Default gray color
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
  },
  icon: {
    type: String,
    default: null
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false // System default categories
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Static method to get categories by type
categorySchema.statics.findByType = function(userId, type) {
  return this.find({ 
    userId, 
    type, 
    isActive: true 
  }).sort({ name: 1 });
};

// Static method to get all user categories
categorySchema.statics.findUserCategories = function(userId) {
  return this.find({ 
    userId, 
    isActive: true 
  }).sort({ type: 1, name: 1 });
};

// Instance method to get category summary
categorySchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    color: this.color,
    icon: this.icon,
    description: this.description
  };
};

export default mongoose.models.Category || mongoose.model('Category', categorySchema);