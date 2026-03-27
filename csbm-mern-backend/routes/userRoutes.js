const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', userController.registerUser);
router.get('/all', userController.listUsers);

// GET /api/users/profile (auth required)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // JWT payload has email; find user by email
        const user = await User.findOne({ email: req.user.email }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user.id || user._id,
            name: user.fullName || user.name || 'Student', // model uses fullName
            email: user.email,
            role: user.role,
            program: user.program || null,
            semester: user.semester || null,
            gpa: user.gpa || null
        });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
