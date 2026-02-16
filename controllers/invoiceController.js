const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

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

      // Check if user is authorized (is the owner or an admin)
      const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
         return res.status(403).json({ message: 'Not authorized to download this invoice' });
      }

      // Create PDF document
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Invoice_${order._id.toString().slice(-8).toUpperCase()}.pdf"`);

      // Pipe PDF to response
      doc.pipe(res);

      // --- Header ---
      doc.fillColor('#000000')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('EASY SHOP', 50, 45);

      doc.fontSize(10)
         .font('Helvetica')
         .text('Tax Invoice/Bill of Supply/Cash Memo', 50, 70)
         .text('(Original for Recipient)', 50, 82);

      // --- Invoice Metadata ---
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Invoice Number:', 350, 50)
         .font('Helvetica')
         .text(`INV-${order._id.toString().slice(-8).toUpperCase()}`, 450, 50)

         .font('Helvetica-Bold')
         .text('Order ID:', 350, 65)
         .font('Helvetica')
         .text(order._id.toString(), 450, 65)

         .font('Helvetica-Bold')
         .text('Order Date:', 350, 80)
         .font('Helvetica')
         .text(new Date(order.createdAt).toLocaleDateString(), 450, 80)

         .font('Helvetica-Bold')
         .text('Invoice Date:', 350, 95)
         .font('Helvetica')
         .text(new Date().toLocaleDateString(), 450, 95);

      doc.moveTo(50, 115).lineTo(550, 115).stroke('#CCCCCC');

      // --- Billing and Shipping Addresses ---
      let yAddress = 130;

      // Bill To
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('Sold By:', 50, yAddress);

      doc.fontSize(10)
         .font('Helvetica')
         .text('Easy Shop E-commerce Private Limited', 50, yAddress + 15)
         .text('123 Commerce Street, Bandra Kurla Complex', 50, yAddress + 27)
         .text('Mumbai, Maharashtra, 400051, IN', 50, yAddress + 39)
         .text('PAN: AAAPL1234C | GST: 27AAAPL1234C1ZV', 50, yAddress + 51);

      // Ship To
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('Billing Address:', 350, yAddress);

      const addr = order.shippingAddress || {};
      doc.fontSize(10)
         .font('Helvetica')
         .text(addr.fullName || order.user?.name || 'Customer Name', 350, yAddress + 15)
         .text(addr.address || '', 350, yAddress + 27, { width: 200 })
         .text(`${addr.city || ''}, ${addr.state || ''} ${addr.postalCode || ''}`, 350, doc.y + 2)
         .text(addr.country || 'India', 350, doc.y + 2)
         .text(`Phone: ${addr.phone || 'N/A'}`, 350, doc.y + 2);

      doc.moveTo(50, 220).lineTo(550, 220).stroke('#CCCCCC');

      // --- Order Items Table ---
      let yTable = 240;

      // Table Header
      doc.rect(50, yTable, 500, 20).fill('#F3F3F3');
      doc.fillColor('#000000')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('SI No.', 55, yTable + 6)
         .text('Description', 100, yTable + 6)
         .text('Unit Price', 300, yTable + 6, { width: 60, align: 'right' })
         .text('Qty', 370, yTable + 6, { width: 30, align: 'right' })
         .text('Net Amount', 410, yTable + 6, { width: 60, align: 'right' })
         .text('Tax', 480, yTable + 6, { width: 20, align: 'right' })
         .text('Total', 505, yTable + 6, { width: 40, align: 'right' });

      yTable += 25;

      const items = order.orderItems || [];
      items.forEach((item, index) => {
         const netAmount = (item.price * item.quantity);
         // Mock tax (18%)
         const taxRate = 0.18;
         const taxAmount = netAmount * taxRate;
         const totalItem = netAmount + taxAmount;

         doc.fontSize(9)
            .font('Helvetica')
            .text((index + 1).toString(), 55, yTable)
            .text(item.name || 'Product', 100, yTable, { width: 180 })
            .text(`₹${item.price.toFixed(2)}`, 300, yTable, { width: 60, align: 'right' })
            .text(item.quantity.toString(), 370, yTable, { width: 30, align: 'right' })
            .text(`₹${netAmount.toFixed(2)}`, 410, yTable, { width: 60, align: 'right' })
            .text(`₹${(taxAmount).toFixed(2)}`, 480, yTable, { width: 20, align: 'right' })
            .text(`₹${(netAmount + taxAmount).toFixed(2)}`, 505, yTable, { width: 40, align: 'right' });

         yTable = doc.y + 10;
      });

      doc.moveTo(50, yTable).lineTo(550, yTable).stroke('#CCCCCC');
      yTable += 15;

      // --- Totals Section ---
      const totalX = 350;
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Total Net Amount:', totalX, yTable)
         .font('Helvetica')
         .text(`₹${(order.itemsPrice || 0).toFixed(2)}`, 500, yTable, { align: 'right' });

      yTable += 15;
      doc.font('Helvetica-Bold')
         .text('Tax Amount:', totalX, yTable)
         .font('Helvetica')
         .text(`₹${(order.taxPrice || 0).toFixed(2)}`, 500, yTable, { align: 'right' });

      yTable += 15;
      doc.font('Helvetica-Bold')
         .text('Shipping:', totalX, yTable)
         .font('Helvetica')
         .text(`₹${(order.shippingPrice || 0).toFixed(2)}`, 500, yTable, { align: 'right' });

      if (order.discount > 0) {
         yTable += 15;
         doc.font('Helvetica-Bold')
            .text('Discount:', totalX, yTable)
            .font('Helvetica')
            .text(`-₹${(order.discount || 0).toFixed(2)}`, 500, yTable, { align: 'right' });
      }

      yTable += 20;
      doc.rect(350, yTable - 5, 200, 25).fill('#F3F3F3');
      doc.fillColor('#000000')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Order Total:', 360, yTable)
         .text(`₹${(order.totalPrice || 0).toFixed(2)}`, 500, yTable, { align: 'right' });

      // --- Footer ---
      const bottomY = 750;
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#666666')
         .text('Whether tax is payable under reverse charge - No', 50, bottomY)
         .text('Thank you for shopping on Easy Shop!', 50, bottomY + 12)
         .text('This is a computer-generated document and does not require signature.', 50, bottomY + 24);

      // Finalize PDF
      doc.end();

   } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ message: error.message });
   }
};

module.exports = { generateInvoice };
