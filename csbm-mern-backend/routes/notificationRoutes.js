const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { verifyToken: auth } = require('../middlewares/authMiddleware');

// GET /api/notifications/my-notifications
router.get('/my-notifications', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ email: req.user.email }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
    }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, email: req.user.email },
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark as read', details: error.message });
    }
});

module.exports = router;
