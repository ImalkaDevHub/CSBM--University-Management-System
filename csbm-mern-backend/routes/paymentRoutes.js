const express = require('express');
const crypto = require('crypto');
const Payment = require('../models/Payment.js');
const User = require('../models/User.js');
const { protect } = require('../middlewares/authMiddleware.js');
const authorize = require('../middlewares/authorize');

const router = express.Router();

const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;

// Generate PayHere hash
const generateHash = (merchantId, orderId, amount, currency, secret) => {
  const secretHash = crypto
    .createHash('md5')
    .update(secret)
    .digest('hex')
    .toUpperCase();

  return crypto
    .createHash('md5')
    .update(merchantId + orderId + amount + currency + secretHash)
    .digest('hex')
    .toUpperCase();
};



// POST /api/payments/initiate
router.post('/initiate', protect, async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const {
      paymentType,
      referenceId,
      itemName,
      amount,
      firstName,
      lastName,
      email,
      phone
    } = req.body;

    // Generate unique order ID
    const orderId = 'ORD-' +
      Date.now().toString(36).toUpperCase() +
      '-' +
      Math.random().toString(36).substr(2, 4).toUpperCase();

    const formattedAmount = parseFloat(amount).toFixed(2);

    // Generate hash
    const hash = generateHash(MERCHANT_ID, orderId, formattedAmount, 'LKR', MERCHANT_SECRET);

    // Get student details
    const student = await User.findById(studentId).select('name email');

    // Save pending payment
    await Payment.create({
      student: studentId,
      studentName: student?.name || firstName,
      studentEmail: student?.email || email,
      orderId,
      paymentType,
      referenceId,
      itemName,
      amount: parseFloat(amount),
      currency: 'LKR',
      status: 'pending'
    });

    res.json({
      success: true,
      paymentData: {
        merchant_id: MERCHANT_ID,
        return_url: process.env.FRONTEND_URL + '/student-dashboard?payment=success&order_id=' + orderId,
        cancel_url: process.env.FRONTEND_URL + '/student-dashboard?payment=cancelled&order_id=' + orderId,
        notify_url: process.env.BACKEND_URL + '/api/payments/webhook',
        order_id: orderId,
        items: itemName,
        currency: 'LKR',
        amount: formattedAmount,
        first_name: firstName || student?.name?.split(' ')[0] || 'Student',
        last_name: lastName || student?.name?.split(' ')[1] || '',
        email: email || student?.email || '',
        phone: phone || '0771234567',
        address: 'CSBM Campus',
        city: 'Colombo',
        country: 'Sri Lanka',
        hash: hash
      }
    });
  } catch (err) {
    console.error('Initiate payment:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/webhook
// PayHere calls this after payment
router.post('/webhook', async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      method
    } = req.body;

    console.log('PayHere webhook:', req.body);

    // Verify signature
    const secretHash = crypto
      .createHash('md5')
      .update(MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();

    const localSig = crypto
      .createHash('md5')
      .update(
        merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        secretHash
      )
      .digest('hex')
      .toUpperCase();

    if (localSig !== md5sig) {
      console.log('Invalid signature!');
      return res.sendStatus(400);
    }

    const payment = await Payment.findOne({ orderId: order_id });

    if (!payment) {
      return res.sendStatus(404);
    }

    // Update status
    // 2=Success, 0=Pending, -1=Cancelled, -2=Failed
    if (status_code === '2') {
      payment.status = 'completed';
      payment.payherePaymentId = payment_id;
      payment.paymentMethod = method;
      payment.paidAt = new Date();
    } else if (status_code === '-1') {
      payment.status = 'cancelled';
    } else if (status_code === '-2') {
      payment.status = 'failed';
    } else if (status_code === '0') {
      payment.status = 'pending';
    }

    await payment.save();
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

// GET /api/payments/my-payments
router.get('/my-payments', protect, async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const payments = await Payment.find({ student: studentId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/check/:orderId
router.get('/check/:orderId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/admin/all
// Admin - get all payments
router.get('/admin/all', protect, authorize(['finance_staff']), async (req, res) => {
  try {

    const payments = await Payment.find({}).populate('student', 'name email').sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/admin/stats
// Admin - revenue statistics
router.get('/admin/stats', protect, authorize(['finance_staff']), async (req, res) => {
  try {

    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalTransactions = await Payment.countDocuments();
    const completedCount = await Payment.countDocuments({ status: 'completed' });
    const pendingCount = await Payment.countDocuments({ status: 'pending' });

    const courseRevenue = await Payment.aggregate([
      { $match: { status: 'completed', paymentType: 'course' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const workshopRevenue = await Payment.aggregate([
      { $match: { status: 'completed', paymentType: 'workshop' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly revenue for chart
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: {
        _id: { month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalTransactions,
      completedCount,
      pendingCount,
      courseRevenue: courseRevenue[0]?.total || 0,
      workshopRevenue: workshopRevenue[0]?.total || 0,
      monthlyRevenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/payments/admin/refund/:id
router.put('/admin/refund/:id', protect, authorize(['finance_staff']), async (req, res) => {
  try {

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'refunded' },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
