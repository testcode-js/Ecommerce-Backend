const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');

// User route
router.post('/apply', auth, applyCoupon);

// Admin routes
router.get('/', auth, admin, getCoupons);
router.post('/', auth, admin, createCoupon);
router.put('/:id', auth, admin, updateCoupon);
router.delete('/:id', auth, admin, deleteCoupon);

module.exports = router;
