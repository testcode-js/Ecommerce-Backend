// routes/admin.js
const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const isAdmin = require('../middlewares/admin'); // Import admin middleware

const router = express.Router();

// Admin Dashboard Route
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// Manage Products Route
router.get('/manage-products', isAdmin, async (req, res) => {
    const products = await Product.find().populate('brand category');
    res.render('admin/manage-products', { products });
});

// Manage Categories Route
router.get('/manage-categories', isAdmin, async (req, res) => {
    const categories = await Category.find();
    res.render('admin/manage-categories', { categories });
});

module.exports = router;
