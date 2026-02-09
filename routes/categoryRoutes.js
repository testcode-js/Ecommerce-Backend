const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesAdmin,
} = require('../controllers/categoryController');

// Public routes (specific routes BEFORE dynamic :id)
router.get('/', getCategories);

// Admin routes (specific routes BEFORE dynamic :id)
router.get('/admin/all', auth, admin, getAllCategoriesAdmin);
router.post('/', auth, admin, upload.single('image'), createCategory);

// Dynamic :id routes (must come AFTER specific routes)
router.get('/:id', getCategoryById);
router.put('/:id', auth, admin, upload.single('image'), updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

module.exports = router;
