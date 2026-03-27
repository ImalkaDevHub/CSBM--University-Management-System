const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/stats', analyticsController.getStats);
router.get('/export', analyticsController.exportToCSV);
router.post('/notify', analyticsController.sendNotification);

module.exports = router;
