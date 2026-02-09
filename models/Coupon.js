const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount cannot be negative'],
  },
  minimumPurchase: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: 0, // 0 means no cap
  },
  usageLimit: {
    type: Number,
    default: 0, // 0 means unlimited
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiry date is required'],
  },
}, {
  timestamps: true,
});

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiresAt < new Date()) return false;
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) return false;
  return true;
};

module.exports = mongoose.model('Coupon', couponSchema);
