const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  markOrderPaid,
  getAdminStats,
} = require('../controllers/orderController');

// Admin routes (must come BEFORE dynamic :id routes)
router.get('/admin/stats', auth, admin, getAdminStats);

// User routes (protected)
router.post('/', auth, createOrder);
router.get('/myorders', auth, getMyOrders);
router.put('/:id/cancel', auth, cancelOrder);

// Admin routes with dynamic ids
router.get('/', auth, admin, getAllOrders);
router.put('/:id/status', auth, admin, updateOrderStatus);
router.put('/:id/pay', auth, admin, markOrderPaid);

// Get single order (must come LAST since it's a catch-all dynamic route)
router.get('/:id', auth, getOrderById);

module.exports = router;
