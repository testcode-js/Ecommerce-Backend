const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  toggleDealStatus,
  getDealCategories,
  getFlashDeals,
} = require('../controllers/dealController');

// Public routes
router.get('/', getDeals);
router.get('/categories', getDealCategories);
router.get('/flash', getFlashDeals);
router.get('/:id', getDealById);

// Admin routes
router.post('/', auth, admin, createDeal);
router.put('/:id', auth, admin, updateDeal);
router.delete('/:id', auth, admin, deleteDeal);
router.put('/:id/status', auth, admin, toggleDealStatus);

module.exports = router;
