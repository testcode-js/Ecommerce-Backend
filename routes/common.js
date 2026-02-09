// routes/common.js
const express = require('express');
const router = express.Router();

// Home Route
router.get('/home', (req, res) => {
    res.render('home');
});

// About Route
router.get('/about', (req, res) => {
    res.render('about');
});

// Contact Route
router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;
