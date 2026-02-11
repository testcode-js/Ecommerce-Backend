const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const admin = require('../middleware/admin');
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  likeBlog,
  getBlogCategories,
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:id', getBlogById);
router.post('/:id/like', auth, likeBlog);

// Admin routes
router.post('/', auth, admin, createBlog);
router.put('/:id', auth, admin, updateBlog);
router.delete('/:id', auth, admin, deleteBlog);
router.put('/:id/status', auth, admin, toggleBlogStatus);

module.exports = router;
