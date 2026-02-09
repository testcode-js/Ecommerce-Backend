const transporter = require('../config/email');

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

// Send OTP Email
const sendOtpEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: 'Your OTP Code - Easy Shop',
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#f9f9f9;padding:30px;border-radius:8px;border:1px solid #eee;">
        <div style="text-align:center;margin-bottom:18px;">
          <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="Easy Shop" style="height:50px;" />
        </div>
        <h2 style="color:#1e90ff;text-align:center;">Your OTP Code</h2>
        <div style="background:#e6f2ff;padding:20px;border-radius:6px;text-align:center;margin:20px 0;">
          <h1 style="color:#1e90ff;letter-spacing:8px;margin:0;">${otp}</h1>
        </div>
        <p style="text-align:center;color:#666;">This OTP will expire in 10 minutes.</p>
        <p style="text-align:center;color:#999;font-size:12px;">&copy; ${new Date().getFullYear()} Easy Shop. All rights reserved.</p>
      </div>
    `,
  });
};

// Send Login Confirmation Email
const sendLoginConfirmation = async (email) => {
  return sendEmail({
    to: email,
    subject: 'Login Successful - Easy Shop',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#f9f9f9;padding:30px 24px;border-radius:8px;border:1px solid #eee;">
        <div style="text-align:center;margin-bottom:18px;">
          <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="Easy Shop" style="height:50px;" />
        </div>
        <h2 style="color:#1e90ff;text-align:center;">Login Notification</h2>
        <p style="font-size:16px;color:#222;text-align:center;">
          Hello,<br>We noticed a successful login to your <b>Easy Shop</b> account (<b>${email}</b>).
        </p>
        <div style="background:#e6f2ff;padding:14px 18px;border-radius:6px;margin:22px 0;text-align:center;">
          <b>Login Details:</b>
          <ul style="list-style:none;padding:0;margin:12px 0;font-size:15px;color:#333;">
            <li>🕒 <b>Date & Time:</b> ${new Date().toLocaleString()}</li>
            <li>📧 <b>Email:</b> ${email}</li>
          </ul>
        </div>
        <p style="color:#e53935;text-align:center;">
          If this wasn't you, please reset your password immediately.
        </p>
        <p style="font-size:12px;color:#aaa;text-align:center;">&copy; ${new Date().getFullYear()} Easy Shop. All rights reserved.</p>
      </div>
    `,
  });
};

// Send Order Confirmation Email
const sendOrderConfirmation = async (email, order) => {
  const itemsList = order.orderItems.map(item =>
    `<li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`
  ).join('');

  return sendEmail({
    to: email,
    subject: `Order Confirmed #${order._id} - Easy Shop`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#f9f9f9;padding:30px 24px;border-radius:8px;border:1px solid #eee;">
        <div style="text-align:center;margin-bottom:18px;">
          <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="Easy Shop" style="height:50px;" />
        </div>
        <h2 style="color:#28a745;text-align:center;">Order Confirmed! 🎉</h2>
        <p style="text-align:center;">Thank you for your order. Here are your order details:</p>
        <div style="background:#fff;padding:15px;border-radius:6px;border:1px solid #eee;margin:15px 0;">
          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>Items:</b></p>
          <ul>${itemsList}</ul>
          <hr>
          <p><b>Total:</b> ₹${order.totalPrice.toFixed(2)}</p>
          <p><b>Payment:</b> ${order.paymentMethod}</p>
          <p><b>Status:</b> ${order.orderStatus}</p>
        </div>
        <p style="font-size:12px;color:#aaa;text-align:center;">&copy; ${new Date().getFullYear()} Easy Shop. All rights reserved.</p>
      </div>
    `,
  });
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, resetUrl) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset - Easy Shop',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#f9f9f9;padding:30px 24px;border-radius:8px;border:1px solid #eee;">
        <div style="text-align:center;margin-bottom:18px;">
          <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="Easy Shop" style="height:50px;" />
        </div>
        <h2 style="color:#1e90ff;text-align:center;">Password Reset Request</h2>
        <p style="text-align:center;">You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align:center;margin:25px 0;">
          <a href="${resetUrl}" style="display:inline-block;background:#1e90ff;color:#fff;text-decoration:none;font-size:16px;padding:12px 32px;border-radius:25px;font-weight:600;">
            Reset Password
          </a>
        </div>
        <p style="text-align:center;color:#999;font-size:13px;">This link will expire in 30 minutes. If you didn't request this, please ignore this email.</p>
        <p style="font-size:12px;color:#aaa;text-align:center;">&copy; ${new Date().getFullYear()} Easy Shop. All rights reserved.</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendLoginConfirmation,
  sendOrderConfirmation,
  sendPasswordResetEmail,
};
