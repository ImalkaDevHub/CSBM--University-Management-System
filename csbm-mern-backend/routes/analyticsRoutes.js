const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// Administrative Registration Workflow & Approval Engine Endpoints
router.get('/dashboard', verifyToken, authorize(['registration_staff', 'super_admin']), analyticsController.getDashboardStats);
router.get('/trends', verifyToken, authorize(['registration_staff', 'super_admin']), analyticsController.getTrends);
router.get('/export/applications', verifyToken, authorize(['registration_staff', 'super_admin']), analyticsController.exportToCSV);
router.post('/notify', verifyToken, authorize(['registration_staff', 'super_admin']), analyticsController.sendNotification);

module.exports = router;
