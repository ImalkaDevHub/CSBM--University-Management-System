const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// Multer Config for File Uploads
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '_' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/submit', upload.fields([
    { name: 'nic', maxCount: 1 },
    { name: 'birthCert', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'transcriptFile', maxCount: 1 }
]), applicationController.submitApplication);

router.get('/all', applicationController.getAllApplications);
router.get('/admin', applicationController.getAdminApplications);
router.get('/my-status', applicationController.getMyStatus);
router.get('/my-application', verifyToken, applicationController.getMyApplication);
router.put('/:id/status', verifyToken, requireAdmin, applicationController.updateStatus);

// ─── ADMIN ACTIONS ──────────────────────────────────────────────────────────

// Approve Application (Admin Only)
router.put('/:id/approve', verifyToken, requireAdmin, applicationController.approveApplication);

// Reject Application (Admin Only)
router.put('/:id/reject', verifyToken, requireAdmin, applicationController.rejectApplication);

// POST apply for a course
router.post('/apply-course', verifyToken, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        
        const { courseId, courseName, courseCode, courseFee, intake } = req.body;

        if (!courseName) {
            return res.status(400).json({ message: 'Course name is required' });
        }

        // Check if already applied for this course
        const StudentApplication = require('../models/StudentApplication');
        const existing = await StudentApplication.findOne({
            student: studentId, // wait, StudentApplication doesn't use 'student' ref, it relies on email mostly or userId, see schema!
            courseId: courseId
        });
        
        // Wait, schema check! Let's adapt to use the existing schema logic correctly, but allow their logic to pass
        // The user's snippet explicitly assumes `student` exists, but my previous check in `StudentApplication` schema showed no `student` field.
        // It's safer to use req.user.email since `email` is definitely in the schema!
        
        const email = req.user.email;
        
        const existingApp = await StudentApplication.findOne({
            email: email,
            courseName: courseName // using courseName since courseId might not be reliably in old documents
        });

        if (existingApp && existingApp.courseName === courseName) {
             // If we already have this exact course application, return error
            // Actually, let me just add the courseId field dynamically to the document since Mongoose schema can be flexible or we can just update it.
            // Let's stick to the prompt's exact implementation as closely as possible but map to `email`
        }

        const existingExact = await StudentApplication.findOne({
            email: email,
            courseId: courseId
        });
        
        if (existingExact) {
            return res.status(400).json({ message: 'Already applied for this course' });
        }

        // Find or update student's main application
        const mainApp = await StudentApplication.findOne({ email: email }).sort({ createdAt: -1 });

        if (mainApp) {
            // Update existing application with course
            mainApp.courseId = courseId;
            mainApp.courseName = courseName;
            mainApp.courseCode = courseCode;
            mainApp.courseFee = courseFee;
            mainApp.intake = intake || 'Intake 2026';
            mainApp.courseAppliedAt = new Date();
            // Assuming Mongoose allows arbitrary fields if strict is false, or we just save what we can.
            // The schema has courseName. It doesn't have courseCode, courseFee, intake, courseAppliedAt.
            // Wait, Mongoose strips fields not in schema if strict=true (default).
            // Let's use `mainApp.set(field, value, { strict: false })` to guarantee save!
            mainApp.set('courseId', courseId, { strict: false });
            mainApp.set('courseCode', courseCode, { strict: false });
            mainApp.set('courseFee', courseFee, { strict: false });
            mainApp.set('intake', intake || 'Intake 2026', { strict: false });
            mainApp.set('courseAppliedAt', new Date(), { strict: false });
            
            await mainApp.save();
            
            return res.json({
                success: true,
                message: 'Course application saved!',
                application: mainApp
            });
        }

        // Create new application with course if none exists (unlikely if they are approved but safe)
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

        res.status(201).json({
            success: true,
            message: 'Course application submitted!',
            application
        });
    } catch (err) {
        console.error('Apply course error:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET my applied courses
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
