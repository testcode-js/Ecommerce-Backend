// routes/user.js
const express = require('express');
const Product = require('../models/Product');
const isUser = require('../middlewares/user');  // Import user middleware

const router = express.Router();

// User Dashboard Route
router.get('/dashboard', isUser, (req, res) => {
    res.render('user/dashboard');
});

// Shop Page Route
router.get('/shop', isUser, async (req, res) => {
    const products = await Product.find().populate('brand category');
    res.render('shop', { products });
});

// Cart Page Route (Placeholder)
router.get('/cart', isUser, (req, res) => {
    res.render('cart');
});

module.exports = router;
