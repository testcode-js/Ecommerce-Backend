const express = require('express');
const router = express.Router();
const auth = require('../middleware/user');
const { initiatePayment, confirmPayment, getPaymentStatus } = require('../controllers/paymentController');

router.post('/initiate', auth, initiatePayment);
router.post('/confirm', auth, confirmPayment);
router.get('/status/:sessionId', auth, getPaymentStatus);

module.exports = router;
