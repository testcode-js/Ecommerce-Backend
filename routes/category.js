// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // adjust path as needed

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find(); // fetch all categories
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});




module.exports = router;
