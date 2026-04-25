const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const User = require('../models/User');
const Course = require('../models/Course');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const StudentApplication = require('../models/StudentApplication');

// All admin routes require both verifyToken and authorize('super_admin')
const protect = [verifyToken, authorize(['super_admin'])];

// GET /api/admin/stats/students
router.get('/stats/students', protect, async (req, res) => {
    try {
        const total = await User.countDocuments({ role: 'STUDENT' });
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonth = await User.countDocuments({
            role: 'STUDENT',
            createdAt: { $gte: startOfMonth }
        });
        res.json({ total, thisMonth });
    } catch (err) {
        console.error('Stats students error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/stats/applications
router.get('/stats/applications', protect, async (req, res) => {
    try {
        const total = await StudentApplication.countDocuments();
        const pending = await StudentApplication.countDocuments({ status: 'PENDING' });
        const approved = await StudentApplication.countDocuments({ status: 'APPROVED' });
        const rejected = await StudentApplication.countDocuments({ status: 'REJECTED' });
        res.json({ total, pending, approved, rejected });
    } catch (err) {
        console.error('Stats applications error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/stats/courses
router.get('/stats/courses', protect, async (req, res) => {
    try {
        // Count all courses (no status field in current model — count all)
        const total = await Course.countDocuments();
        res.json({ total });
    } catch (err) {
        console.error('Stats courses error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/stats/workshops
router.get('/stats/workshops', protect, async (req, res) => {
    try {
        const total = await Workshop.countDocuments({ date: { $gte: new Date() } });
        res.json({ total });
    } catch (err) {
        console.error('Stats workshops error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/stats/applications-chart
// Returns last 6 months of application counts
router.get('/stats/applications-chart', protect, async (req, res) => {
    try {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
            const count = await StudentApplication.countDocuments({
                createdAt: { $gte: start, $lt: end }
            });
            months.push({
                month: d.toLocaleString('default', { month: 'short' }),
                applications: count
            });
        }
        res.json(months);
    } catch (err) {
        console.error('Applications chart error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/workshops/recent-registrations
// Returns workshops with their registration counts
router.get('/workshops/recent-registrations', protect, async (req, res) => {
    try {
        const workshops = await Workshop.find().sort({ date: -1 }).limit(8);
        const result = await Promise.all(
            workshops.map(async (w) => {
                const count = await WorkshopRegistration.countDocuments({ workshopId: w._id });
                return {
                    _id: w._id,
                    workshopName: w.topic || w.title || 'Workshop',
                    date: w.date,
                    count
                };
            })
        );
        res.json(result);
    } catch (err) {
        console.error('Workshop registrations error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

const bcrypt = require('bcryptjs');

// POST /api/admin/register-student
router.post('/register-student', verifyToken, authorize(['registration_staff']), async (req, res) => {
    try {
        const { 
            name, email, phone, address, nic,
            dateOfBirth, courseId, courseName,
            intake, password, role 
        } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Name, email and password are required' 
            });
        }

        // Check existing email
        const existing = await User.findOne({ 
            email: email.toLowerCase() 
        });
        if (existing) {
            return res.status(400).json({ 
                message: 'A student with this email already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user account
        const user = await User.create({
            fullName: name,
            email: email.toLowerCase(),
            mobileNumber: phone,
            address,
            nic,
            dateOfBirth,
            password: hashedPassword,
            role: role || 'STUDENT'
        });

        // Create approved application
        const application = await StudentApplication.create({
            student: user._id,
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            address: user.address || 'Manual Entry',
            courseId: courseId || null,
            courseName: courseName || 'Not Specified',
            programName: courseName || 'Not Specified',
            intake: intake || 'Intake 2026',
            status: 'APPROVED',
            submittedAt: new Date(),
            reviewedAt: new Date(),
            reviewedBy: req.user?.id,
            registeredByAdmin: true,
            // Required file placeholders
            nicFileName: 'manual_entry.pdf',
            birthCertFileName: 'manual_entry.pdf',
            passportPhotoFileName: 'manual_entry.jpg',
            digitalSignature: 'Manually Registered'
        });

        res.status(201).json({
            success: true,
            message: 'Student registered and approved successfully',
            student: {
                _id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                applicationId: application._id
            }
        });
    } catch (err) {
        console.error('Register student error:', err);
        res.status(500).json({ 
            message: 'Server error: ' + err.message 
        });
    }
});

module.exports = router;
