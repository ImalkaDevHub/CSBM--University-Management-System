const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/stats', verifyToken, authorize(['finance_staff']), analyticsController.getStats);
router.get('/export', verifyToken, authorize(['finance_staff']), analyticsController.exportToCSV);
router.post('/notify', verifyToken, authorize(['finance_staff']), analyticsController.sendNotification);

module.exports = router;
