const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

// GET /api/schedule/weekly
// Schedule not yet implemented — returns empty array to prevent 404
router.get('/weekly', verifyToken, async (req, res) => {
    try {
        res.json([]);
    } catch (err) {
        console.error('Schedule error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
