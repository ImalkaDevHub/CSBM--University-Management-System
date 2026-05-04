const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const StudentApplication = require('../models/StudentApplication');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// Helper to easily define admin roles
const adminOnly = [verifyToken, authorize(['super_admin', 'marketing_coordinator', 'registration_staff'])];

// GET /api/courses/enrolled (auth required)
// Must be declared BEFORE /:id to avoid route conflict
router.get('/enrolled', verifyToken, async (req, res) => {
    try {
        const application = await StudentApplication
            .findOne({ email: req.user.email, status: 'APPROVED' })
            .sort({ createdAt: -1 });

        if (!application) {
            return res.json([]); 
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

// Public Check (Automated Eligibility Checker)
router.post('/check-eligibility', courseController.checkEligibility);

// 1. CRUD endpoints
router.post('/', ...adminOnly, courseController.addCourse);
router.get('/', courseController.listCourses);
router.get('/all', courseController.listCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', ...adminOnly, courseController.updateCourse);
router.delete('/:id', ...adminOnly, courseController.deleteCourse);

// 2. INTAKE MANAGEMENT
router.put('/:id/intake', ...adminOnly, courseController.updateIntake);

// 3. VERSION CONTROL
router.put('/:id/curriculum', ...adminOnly, courseController.updateCurriculum);
router.get('/:id/history', courseController.getCourseHistory);

// 4. ELIGIBILITY CHECK & ENROLLMENT (STUDENT/AUTHED)
router.post('/:id/check-eligibility', verifyToken, courseController.checkEligibility);
router.post('/:id/enroll', verifyToken, courseController.enrollCourse);

module.exports = router;