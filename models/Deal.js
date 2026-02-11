const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Deal description is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price cannot be negative']
  },
  dealPrice: {
    type: Number,
    required: [true, 'Deal price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fashion', 'Electronics', 'Home', 'Sports', 'Books', 'Toys', 'Food', 'Health', 'Beauty', 'Other']
  },
  featuredImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'scheduled', 'expired'],
    default: 'active'
  },
  flashDeal: {
    type: Boolean,
    default: false
  },
  clearance: {
    type: Boolean,
    default: false
  },
  seasonalDeal: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  maxUsage: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  terms: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
dealSchema.index({ title: 'text', description: 'text' });

// Method to check if deal is expired
dealSchema.methods.isExpired = function () {
  return new Date() > this.endDate;
};

// Method to calculate discount percentage
dealSchema.methods.getDiscountPercentage = function () {
  if (this.discountType === 'percentage') {
    return this.discountValue;
  }
  return Math.round((this.discountValue / this.originalPrice) * 100);
};

module.exports = mongoose.model('Deal', dealSchema);
