const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');

// All wishlist routes are protected
router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/clear', auth, clearWishlist);
router.delete('/:productId', auth, removeFromWishlist);

module.exports = router;
