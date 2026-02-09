const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts,
  getAllProductsAdmin,
} = require('../controllers/productController');

// Public routes (specific routes BEFORE dynamic :id)
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);

// Admin routes (specific routes BEFORE dynamic :id)
router.get('/admin/all', auth, admin, getAllProductsAdmin);
router.post('/', auth, admin, upload.single('image'), createProduct);

// Dynamic :id routes (must come AFTER specific routes)
router.get('/:id', getProductById);
router.post('/:id/reviews', auth, addReview);
router.put('/:id', auth, admin, upload.single('image'), updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
