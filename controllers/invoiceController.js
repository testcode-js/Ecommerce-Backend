const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

// Helper to format currency
const formatCurrency = (amount) => {
   return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
   }).format(amount);
};

// @desc    Generate and download invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private/Admin
const generateInvoice = async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
         .populate('user', 'name email')
         .populate('orderItems.product', 'name image');

      if (!order) {
         return res.status(404).json({ message: 'Order not found' });
      }

      // Check authorization
      const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
         return res.status(403).json({ message: 'Not authorized to download this invoice' });
      }

      // Create PDF document
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      // Set headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="Invoice_${order._id.toString().slice(-8).toUpperCase()}.pdf"`);

      doc.pipe(res);

      // --- COLORS & FONTS ---
      const primaryColor = '#2c3e50';
      const secondaryColor = '#95a5a6';
      const accentColor = '#3498db';
      const tableHeaderBg = '#f8f9fa';

      // --- HEADER ---
      doc.fillColor(primaryColor)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('INVOICE', 50, 50, { align: 'right' });

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor(secondaryColor)
         .text(`Invoice #: INV-${order._id.toString().slice(-8).toUpperCase()}`, 50, 80, { align: 'right' })
         .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 50, 95, { align: 'right' });

      // Company Info (Left side)
      doc.fillColor(primaryColor)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('EASY SHOP', 50, 50)
         .fontSize(10)
         .font('Helvetica')
         .text('123 Commerce Street,', 50, 75)
         .text('Bandra Kurla Complex, Mumbai', 50, 90)
         .text('Maharashtra, India - 400051', 50, 105)
         .text('GSTIN: 27AAAPL1234C1ZV', 50, 120);

      doc.moveDown();
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 140).lineTo(550, 140).stroke();

      // --- BILL TO / SHIP TO ---
      const yAddress = 160;

      // Bill To
      doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor).text('BILL TO:', 50, yAddress);
      const user = order.user || {};
      doc.font('Helvetica').fillColor('#000000')
         .text(user.name || 'Guest User', 50, yAddress + 15)
         .text(user.email || '', 50, yAddress + 30);

      // Ship To
      doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor).text('SHIP TO:', 300, yAddress);

      const addr = order.shippingAddress || {};
      const shipToX = 300;
      let currentY = yAddress + 15;

      doc.font('Helvetica').fillColor('#000000');
      doc.text(addr.fullName || 'N/A', shipToX, currentY);
      currentY += 15;
      doc.text(addr.address || '', shipToX, currentY, { width: 250 });
      // Calculate height of address (could be multiple lines)
      const addressHeight = doc.heightOfString(addr.address || '', { width: 250 });
      currentY += addressHeight;
      doc.text(`${addr.city || ''}, ${addr.state || ''} - ${addr.postalCode || ''}`, shipToX, currentY);
      currentY += 15;
      doc.text(`Phone: ${addr.phone || 'N/A'}`, shipToX, currentY);

      // --- PAID STAMP ---
      if (order.isPaid) {
         doc.save();
         doc.rotate(-10, { origin: [250, 180] });
         doc.fontSize(30).font('Helvetica-Bold').fillColor('#27ae60').opacity(0.2)
            .text('PAID', 220, 160);
         doc.restore();
      }

      // --- ORDER ITEMS TABLE ---
      let yTable = Math.max(currentY + 30, 260);

      // Header
      const col1 = 50;  // Item
      const col2 = 280; // Price
      const col3 = 350; // Qty
      const col4 = 400; // Total (Net)

      doc.rect(50, yTable, 500, 25).fill(tableHeaderBg);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10);
      doc.text('ITEM', col1 + 10, yTable + 8);
      doc.text('PRICE', col2, yTable + 8, { width: 60, align: 'right' });
      doc.text('QTY', col3, yTable + 8, { width: 40, align: 'center' });
      doc.text('TOTAL', col4 + 40, yTable + 8, { width: 100, align: 'right' }); // Adjusted align

      yTable += 25;
      doc.moveTo(50, yTable).lineTo(550, yTable).strokeColor('#e0e0e0').stroke();

      // Items
      doc.font('Helvetica').fontSize(10).fillColor('#000000');

      (order.orderItems || []).forEach((item, i) => {
         yTable += 10;

         const name = item.name;
         const price = formatCurrency(item.price);
         const qty = item.quantity;
         const total = formatCurrency(item.price * item.quantity);

         // Item Name (can wrap)
         doc.text(name, col1 + 10, yTable, { width: 220 });
         const h = doc.heightOfString(name, { width: 220 });

         // Other columns
         doc.text(price, col2, yTable, { width: 60, align: 'right' });
         doc.text(qty.toString(), col3, yTable, { width: 40, align: 'center' });
         doc.text(total, col4 + 40, yTable, { width: 100, align: 'right' });

         yTable += h + 10;
         doc.moveTo(50, yTable).lineTo(550, yTable).strokeColor('#f0f0f0').stroke();
      });

      // --- TOTALS ---
      yTable += 20;
      const rightColX = 350;
      const valColX = 450;
      const colWidth = 100;

      // Subtotals (Items Price)
      doc.font('Helvetica').fontSize(10).fillColor('#000000');

      // Helper for totals row
      const addTotalRow = (label, value) => {
         doc.text(label, rightColX, yTable, { width: 100, align: 'right' });
         doc.text(value, valColX, yTable, { width: colWidth, align: 'right' });
         yTable += 15;
      };

      addTotalRow('Subtotal:', formatCurrency(order.itemsPrice || 0));
      addTotalRow('Tax (18%):', formatCurrency(order.taxPrice || 0));
      addTotalRow('Shipping:', formatCurrency(order.shippingPrice || 0));

      if (order.discount > 0) {
         doc.fillColor('#e74c3c');
         addTotalRow('Discount:', `-${formatCurrency(order.discount)}`);
         doc.fillColor('#000000');
      }

      yTable += 5;
      // Grand Total
      doc.rect(rightColX, yTable - 5, 200, 30).fill('#f8f9fa');
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(12);

      doc.text('Grand Total:', rightColX + 10, yTable + 5);
      doc.text(formatCurrency(order.totalPrice || 0), valColX, yTable + 5, { width: colWidth, align: 'right' });

      // --- FOOTER ---
      const bottomY = 730;
      doc.fontSize(9).font('Helvetica').fillColor(secondaryColor);
      doc.text('Thank you for your business!', 50, bottomY, { align: 'center' });
      doc.text('For questions, contact support@easyshop.com', 50, bottomY + 15, { align: 'center' });

      doc.end();

   } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ message: error.message });
   }
};

module.exports = { generateInvoice };
