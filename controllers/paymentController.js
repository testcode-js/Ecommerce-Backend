const fakePaymentService = require('../services/fakePaymentService');

const validateCardPayload = ({ cardNumber, cardHolder, expiry, cvv }) => {
  const sanitized = (cardNumber || '').replace(/\s|-/g, '');
  if (sanitized.length !== 16) {
    throw new Error('Card number must be 16 digits');
  }

  if (!cardHolder || cardHolder.length < 3) {
    throw new Error('Card holder name is required');
  }

  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry || '')) {
    throw new Error('Expiry must be in MM/YY format');
  }

  if (!/^[0-9]{3,4}$/.test(cvv || '')) {
    throw new Error('CVV must be 3 or 4 digits');
  }

  return sanitized;
};

const validateUpiPayload = (upiId = '') => {
  if (!upiId.includes('@')) {
    throw new Error('Enter a valid UPI ID');
  }
  return upiId.trim();
};

const initiatePayment = async (req, res) => {
  try {
    const { amount, method, currency = 'INR', cardNumber, cardHolder, expiry, cvv, upiId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const metadata = {};

    if (method === 'Card') {
      const sanitizedCard = validateCardPayload({ cardNumber, cardHolder, expiry, cvv });
      metadata.cardNumber = sanitizedCard;
      metadata.cardHolder = cardHolder.trim();
      metadata.expiry = expiry;
    }

    if (method === 'UPI') {
      metadata.upiId = validateUpiPayload(upiId);
    }

    const session = fakePaymentService.createSession({
      amount,
      currency,
      method,
      metadata,
      customer: {
        name: req.user.name,
        email: req.user.email,
      },
    });

    const instantResult = session.requiresOtp
      ? null
      : fakePaymentService.verifyOtp(session.id, null, req.user.email);

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        amount: session.amount,
        currency: session.currency,
        method: session.method,
        requiresOtp: session.requiresOtp,
        maskedCard: session.metadata.maskedCard,
        cardBrand: session.metadata.cardBrand,
        maskedUpi: session.metadata.maskedUpi,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        otpHint: process.env.NODE_ENV !== 'production' ? session.otp : undefined,
      },
      paymentResult: instantResult,
      message: session.requiresOtp
        ? 'OTP sent to your registered mobile number'
        : 'Payment authorized successfully',
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { sessionId, otp } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }

    const paymentResult = fakePaymentService.verifyOtp(sessionId, otp, req.user.email);

    res.json({
      success: true,
      paymentResult,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const session = fakePaymentService.getSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Payment session not found or expired' });
    }

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        method: session.method,
        requiresOtp: session.requiresOtp,
        maskedCard: session.metadata.maskedCard,
        maskedUpi: session.metadata.maskedUpi,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  initiatePayment,
  confirmPayment,
  getPaymentStatus,
};
