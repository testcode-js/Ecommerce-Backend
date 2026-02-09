const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  price: Number,
  image: String,
  brand: String,
  stock: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    couponCode: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
