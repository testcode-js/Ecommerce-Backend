const crypto = require('crypto');

class FakePaymentService {
  constructor() {
    this.sessions = new Map();
    this.TTL = 5 * 60 * 1000; // 5 minutes
  }

  generateId(prefix = 'pay') {
    return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
  }

  maskCard(cardNumber = '') {
    const sanitized = cardNumber.replace(/\D/g, '');
    if (sanitized.length < 4) return 'XXXX-XXXX-XXXX-0000';
    const last4 = sanitized.slice(-4);
    return `XXXX-XXXX-XXXX-${last4}`;
  }

  maskUpi(upiId = '') {
    if (!upiId.includes('@')) return `${upiId.slice(0, 2)}***@upi`;
    const [handle, provider] = upiId.split('@');
    const maskedHandle = handle.length <= 2 ? `${handle}***` : `${handle.slice(0, 2)}***`;
    return `${maskedHandle}@${provider}`;
  }

  deriveCardBrand(cardNumber = '') {
    const sanitized = cardNumber.replace(/\D/g, '');
    if (/^4/.test(sanitized)) return 'VISA';
    if (/^5[1-5]/.test(sanitized)) return 'MASTERCARD';
    if (/^3[47]/.test(sanitized)) return 'AMEX';
    if (/^6/.test(sanitized)) return 'RUPAY';
    return 'CARD';
  }

  createSession({ amount, currency = 'INR', method, metadata = {}, customer = {} }) {
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const requiresOtp = ['Card', 'UPI', 'NetBanking'].includes(method);
    const sessionId = this.generateId('session');
    const otp = requiresOtp ? String(Math.floor(100000 + Math.random() * 900000)) : null;

    const session = {
      id: sessionId,
      amount,
      currency,
      method,
      status: requiresOtp ? 'requires_action' : 'succeeded',
      requiresOtp,
      otp,
      metadata: {
        ...metadata,
        maskedCard: metadata.cardNumber ? this.maskCard(metadata.cardNumber) : undefined,
        cardBrand: metadata.cardNumber ? this.deriveCardBrand(metadata.cardNumber) : undefined,
        maskedUpi: metadata.upiId ? this.maskUpi(metadata.upiId) : undefined,
      },
      customer,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.TTL,
      paymentResult: null,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  completeSession(session, emailAddress) {
    const transactionId = this.generateId('txn');
    const reference = this.generateId('ref');

    const paymentResult = {
      id: transactionId,
      status: 'succeeded',
      updateTime: new Date().toISOString(),
      emailAddress,
      method: session.method,
      currency: session.currency,
      amount: session.amount,
      reference,
      cardBrand: session.metadata.cardBrand,
      cardLast4: session.metadata.maskedCard?.slice(-4),
      maskedCard: session.metadata.maskedCard,
      maskedUpi: session.metadata.maskedUpi,
    };

    session.status = 'succeeded';
    session.paymentResult = paymentResult;
    this.sessions.delete(session.id);
    return paymentResult;
  }

  verifyOtp(sessionId, otp, emailAddress) {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Payment session not found or expired');
    }

    if (session.status === 'succeeded') {
      return session.paymentResult;
    }

    if (!session.requiresOtp) {
      return this.completeSession(session, emailAddress);
    }

    if (!otp) {
      throw new Error('OTP is required');
    }

    if (session.otp !== otp) {
      throw new Error('Invalid OTP code');
    }

    return this.completeSession(session, emailAddress);
  }
}

module.exports = new FakePaymentService();
