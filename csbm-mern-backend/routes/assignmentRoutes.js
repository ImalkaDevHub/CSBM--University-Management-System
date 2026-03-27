const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

// GET /api/assignments/upcoming
// Assignments not yet implemented — returns empty array to prevent 404
router.get('/upcoming', verifyToken, async (req, res) => {
    try {
        res.json([]);
    } catch (err) {
        console.error('Assignments error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
