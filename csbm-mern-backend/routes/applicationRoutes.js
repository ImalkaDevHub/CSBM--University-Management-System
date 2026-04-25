const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// ── SUBMIT APPLICATION ──────────────────────────────────────────────────────
// Receives JSON with Cloudinary URLs from the frontend (no multer needed)
router.post('/submit', applicationController.submitApplication);

// ── STUDENT ACTIONS ─────────────────────────────────────────────────────────
// Fetch the logged-in student's specific application
router.get('/my-application', verifyToken, applicationController.getMyApplication);

// Fetch application status by email (for public tracking if needed)
router.get('/my-status', applicationController.getMyStatus);

// ── ADMIN ACTIONS ───────────────────────────────────────────────────────────
router.get('/all', verifyToken, authorize(['registration_staff']), applicationController.getAllApplications);
router.get('/admin', verifyToken, authorize(['registration_staff']), applicationController.getAdminApplications);
router.put('/:id/status', verifyToken, authorize(['registration_staff']), applicationController.updateStatus);
router.put('/:id/approve', verifyToken, authorize(['registration_staff']), applicationController.approveApplication);
router.put('/:id/reject', verifyToken, authorize(['registration_staff']), applicationController.rejectApplication);

// ── COURSE APPLICATIONS (NESTED LOGIC) ──────────────────────────────────────
router.post('/apply-course', verifyToken, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const { courseId, courseName, courseCode, courseFee, intake } = req.body;

        if (!courseName) {
            return res.status(400).json({ message: 'Course name is required' });
        }

        const StudentApplication = require('../models/StudentApplication');
        const email = req.user.email;
        
        const existingExact = await StudentApplication.findOne({
            email: email,
            courseId: courseId
        });
        
        if (existingExact) {
            return res.status(400).json({ message: 'Already applied for this course' });
        }

        const mainApp = await StudentApplication.findOne({ email: email }).sort({ createdAt: -1 });

        if (mainApp) {
            mainApp.set('courseId', courseId, { strict: false });
            mainApp.set('courseName', courseName, { strict: false });
            mainApp.set('courseCode', courseCode, { strict: false });
            mainApp.set('courseFee', courseFee, { strict: false });
            mainApp.set('intake', intake || 'Intake 2026', { strict: false });
            mainApp.set('courseAppliedAt', new Date(), { strict: false });
            
            await mainApp.save();
            return res.json({ success: true, message: 'Course application saved!', application: mainApp });
        }

        const application = await StudentApplication.create({
            email: email,
            fullName: req.user.name || 'Student',
            mobileNumber: req.user.mobile || 'Pending',
            address: 'Pending',
            courseName: courseName,
            status: 'PENDING',
            digitalSignature: 'SystemGenerated',
            nicFileName: 'Pending',
            birthCertFileName: 'Pending',
            passportPhotoFileName: 'Pending'
        });
        
        application.set('courseId', courseId, { strict: false });
        application.set('courseCode', courseCode, { strict: false });
        application.set('courseFee', courseFee, { strict: false });
        application.set('intake', intake || 'Intake 2026', { strict: false });
        application.set('courseAppliedAt', new Date(), { strict: false });
        application.set('submittedAt', new Date(), { strict: false });
        await application.save();

        res.status(201).json({ success: true, message: 'Course application submitted!', application });
    } catch (err) {
        console.error('Apply course error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/my-courses', verifyToken, async (req, res) => {
    try {
        const StudentApplication = require('../models/StudentApplication');
        const applications = await StudentApplication.find({
            email: req.user.email,
            courseId: { $exists: true, $ne: null }
        });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
