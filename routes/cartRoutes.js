const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCouponToCart,
  removeCouponFromCart,
  syncCart,
} = require('../controllers/cartController');

// All routes are protected
router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/apply-coupon', applyCouponToCart);
router.delete('/remove-coupon', removeCouponFromCart);
router.post('/sync', syncCart);

module.exports = router;
