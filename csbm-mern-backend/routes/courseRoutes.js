const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const StudentApplication = require('../models/StudentApplication');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// 🚀 TRACKER 1: Prove the file is loading
console.log("----------------------------------------");
console.log("🚀 BOOT SEQUENCE: courseRoutes.js is loading!");

// Define routes
router.post('/', verifyToken, authorize(['marketing_coordinator']), courseController.addCourse);
router.get('/', courseController.listCourses);
router.get('/all', courseController.listCourses);

// 🚀 TRACKER 2: Prove the Eligibility Route is attached
router.post('/check-eligibility', courseController.checkEligibility);
console.log("✅ SUCCESS: /check-eligibility route is officially attached!");
console.log("----------------------------------------");

// GET /api/courses/enrolled (auth required)
// Must be declared BEFORE /:id to avoid route conflict
router.get('/enrolled', verifyToken, async (req, res) => {
    try {
        // StudentApplication stores email as a string (not ObjectId ref)
        const application = await StudentApplication
            .findOne({ email: req.user.email, status: 'APPROVED' })
            .sort({ createdAt: -1 });

        if (!application) {
            return res.json([]); // empty is ok — student may not be enrolled yet
        }

        const courses = [{
            _id: application.id || application._id,
            name: application.courseName || application.programName || 'Your Course',
            progress: 0,
            status: 'active'
        }];

        res.json(courses);
    } catch (err) {
        console.error('Enrolled courses error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', verifyToken, authorize(['marketing_coordinator']), courseController.updateCourse);

module.exports = router;