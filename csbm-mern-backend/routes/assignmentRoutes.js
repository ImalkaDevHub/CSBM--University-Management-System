// assignmentRoutes.js
// ─────────────────────────────────────────────────────────────
// Mounted at: /api/assignments  (see server.js)
// Auth:       verifyToken  → attaches req.user (role: 'ADMIN' | 'STUDENT' | 'LECTURER')
// File upload: multer inline — files saved to uploads/assignments/
// ─────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// ── Models ────────────────────────────────────────────────────
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// ── Auth middleware (matches this project's export style) ─────
const { verifyToken: protect } = require('../middlewares/authMiddleware');

// ── Multer setup — store files in uploads/assignments/ ────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'assignments');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (_req, file, cb) => {
        // Allow common document / archive / image types
        const allowed = /pdf|doc|docx|txt|zip|png|jpg|jpeg/i;
        if (allowed.test(path.extname(file.originalname))) return cb(null, true);
        cb(new Error('File type not allowed'));
    },
});

// ── Role helpers (matches this project's role casing) ─────────
const isAdmin    = (req) => (req.user?.role || '').toUpperCase() === 'ADMIN';
const isAdminOrLecturer = (req) => ['ADMIN', 'LECTURER'].includes((req.user?.role || '').toUpperCase());

// ── Utility ───────────────────────────────────────────────────
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const paginate = (query, page = 1, limit = 20) => {
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, parseInt(limit));
    return query.skip((p - 1) * l).limit(l);
};


// ═════════════════════════════════════════════════════════════
//  ASSIGNMENT CRUD
// ═════════════════════════════════════════════════════════════

// ── GET /api/assignments ─────────────────────────────────────
// Admin/Lecturer: all assignments (filterable by status)
// Student:        published assignments only
router.get('/', protect, async (req, res) => {
    try {
        const { course, status, page = 1, limit = 20, search } = req.query;

        const filter = {};

        if (isAdminOrLecturer(req)) {
            if (status) filter.status = status;
        } else {
            // Students only see published
            filter.status = 'published';
        }

        if (course) {
            if (!validId(course))
                return res.status(400).json({ message: 'Invalid course ID' });
            filter.course = course;
        }

        if (search) {
            filter.$or = [
                { title:       { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Assignment.countDocuments(filter);
        const assignments = await paginate(
            Assignment.find(filter)
                .populate('course',     'name code')
                .populate('createdBy',  'fullName email')
                .sort({ dueDate: 1 }),
            page,
            limit
        );

        res.json({
            total,
            page:  parseInt(page),
            pages: Math.ceil(total / Math.min(100, parseInt(limit))),
            assignments,
        });
    } catch (err) {
        console.error('GET /assignments:', err);
        res.status(500).json({ message: 'Server error fetching assignments' });
    }
});

// ── GET /api/assignments/upcoming ────────────────────────────
// Returns published assignments due in the future (used by student dashboard)
router.get('/upcoming', protect, async (req, res) => {
    try {
        const filter = {
            status:  'published',
            dueDate: { $gte: new Date() },
        };

        const assignments = await Assignment.find(filter)
            .populate('course', 'name code')
            .sort({ dueDate: 1 })
            .limit(10);

        res.json(assignments);
    } catch (err) {
        console.error('GET /assignments/upcoming:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ── GET /api/assignments/:id ──────────────────────────────────
// Students also get their own submission bundled in the response
router.get('/:id', protect, async (req, res) => {
    try {
        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        const assignment = await Assignment.findById(req.params.id)
            .populate('course',    'name code')
            .populate('createdBy', 'fullName email');

        if (!assignment)
            return res.status(404).json({ message: 'Assignment not found' });

        // Students may only view published assignments
        if (!isAdminOrLecturer(req) && assignment.status !== 'published')
            return res.status(403).json({ message: 'Assignment not available' });

        // Bundle student's own submission if applicable
        let submission = null;
        if (!isAdmin(req)) {
            submission = await Submission.findOne({
                assignment: assignment._id,
                student:    req.user._id,
            });
        }

        res.json({ assignment, submission });
    } catch (err) {
        console.error('GET /assignments/:id:', err);
        res.status(500).json({ message: 'Server error fetching assignment' });
    }
});

// ── POST /api/assignments ─────────────────────────────────────
// Create (Admin / Lecturer only)
router.post('/', protect, async (req, res) => {
    try {
        if (!isAdminOrLecturer(req))
            return res.status(403).json({ message: 'Admin or Lecturer access required' });

        const {
            title,
            description,
            instructions,
            course,
            dueDate,
            maxScore,
            allowLateSubmission,
            latePenaltyPercent,
            status,
        } = req.body;

        if (!title || !course || !dueDate)
            return res.status(400).json({ message: 'title, course, and dueDate are required' });

        if (!validId(course))
            return res.status(400).json({ message: 'Invalid course ID' });

        if (new Date(dueDate) <= new Date())
            return res.status(400).json({ message: 'Due date must be in the future' });

        const assignment = await Assignment.create({
            title,
            description:          description || '',
            instructions:         instructions || '',
            course,
            dueDate:              new Date(dueDate),
            maxScore:             maxScore || 100,
            allowLateSubmission:  allowLateSubmission ?? false,
            latePenaltyPercent:   latePenaltyPercent  || 0,
            status:               status || 'draft',
            createdBy:            req.user._id,
        });

        await assignment.populate([
            { path: 'course',    select: 'name code' },
            { path: 'createdBy', select: 'fullName email' },
        ]);

        res.status(201).json({ message: 'Assignment created', assignment });
    } catch (err) {
        if (err.name === 'ValidationError')
            return res.status(400).json({ message: err.message });
        console.error('POST /assignments:', err);
        res.status(500).json({ message: 'Server error creating assignment' });
    }
});

// ── PUT /api/assignments/:id ──────────────────────────────────
// Full update (Admin / Lecturer only)
router.put('/:id', protect, async (req, res) => {
    try {
        if (!isAdminOrLecturer(req))
            return res.status(403).json({ message: 'Admin or Lecturer access required' });

        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        const allowed = [
            'title', 'description', 'instructions', 'dueDate',
            'maxScore', 'allowLateSubmission', 'latePenaltyPercent', 'status',
        ];
        const updates = {};
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        if (updates.dueDate && new Date(updates.dueDate) <= new Date())
            return res.status(400).json({ message: 'Due date must be in the future' });

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate('course',    'name code')
            .populate('createdBy', 'fullName email');

        if (!assignment)
            return res.status(404).json({ message: 'Assignment not found' });

        res.json({ message: 'Assignment updated', assignment });
    } catch (err) {
        if (err.name === 'ValidationError')
            return res.status(400).json({ message: err.message });
        console.error('PUT /assignments/:id:', err);
        res.status(500).json({ message: 'Server error updating assignment' });
    }
});

// ── DELETE /api/assignments/:id ───────────────────────────────
// Hard-delete + cascade delete all submissions (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (!isAdmin(req))
            return res.status(403).json({ message: 'Admin access required' });

        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment)
            return res.status(404).json({ message: 'Assignment not found' });

        // Remove any uploaded files for submissions of this assignment
        const submissions = await Submission.find({ assignment: req.params.id }).select('fileUrl');
        submissions.forEach((sub) => {
            if (sub.fileUrl) {
                const filePath = path.join(__dirname, '..', sub.fileUrl);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        });

        // Cascade delete
        await Submission.deleteMany({ assignment: req.params.id });
        await assignment.deleteOne();

        res.json({ message: 'Assignment and all submissions deleted' });
    } catch (err) {
        console.error('DELETE /assignments/:id:', err);
        res.status(500).json({ message: 'Server error deleting assignment' });
    }
});

// ── PATCH /api/assignments/:id/publish ───────────────────────
// Quickly change status: draft → published → closed  (Admin / Lecturer)
router.patch('/:id/publish', protect, async (req, res) => {
    try {
        if (!isAdminOrLecturer(req))
            return res.status(403).json({ message: 'Admin or Lecturer access required' });

        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        const { status } = req.body;
        if (!['published', 'draft', 'closed'].includes(status))
            return res.status(400).json({ message: "status must be 'published', 'draft', or 'closed'" });

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!assignment)
            return res.status(404).json({ message: 'Assignment not found' });

        res.json({ message: `Assignment marked as ${status}`, assignment });
    } catch (err) {
        console.error('PATCH /assignments/:id/publish:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// ═════════════════════════════════════════════════════════════
//  SUBMISSION ROUTES
// ═════════════════════════════════════════════════════════════

// ── POST /api/assignments/:id/submit ─────────────────────────
// Student submits (with optional file upload)
router.post('/:id/submit', protect, upload.single('file'), async (req, res) => {
    try {
        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment)
            return res.status(404).json({ message: 'Assignment not found' });

        if (assignment.status !== 'published')
            return res.status(403).json({ message: 'Assignment is not open for submissions' });

        const now    = new Date();
        const isLate = now > new Date(assignment.dueDate);

        if (isLate && !assignment.allowLateSubmission)
            return res.status(400).json({ message: 'Submission deadline has passed' });

        const studentId = req.user._id || req.user.id;

        // Build update payload
        const submissionData = {
            textContent: req.body.textContent || '',
            isLate,
            submittedAt: now,
            // Clear any existing grade when re-submitting
            grade:       null,
            finalGrade:  null,
            feedback:    '',
            gradedBy:    null,
            gradedAt:    null,
        };

        if (req.file) {
            // Store relative path so it can be served via /uploads
            submissionData.fileUrl  = 'uploads/assignments/' + req.file.filename;
            submissionData.fileName = req.file.originalname;
        }

        // Upsert — if student already submitted, overwrite
        const submission = await Submission.findOneAndUpdate(
            { assignment: assignment._id, student: studentId },
            { $set: submissionData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const statusCode = submission.wasNew ? 201 : 200;
        const message    = statusCode === 201 ? 'Submission received' : 'Submission updated';

        res.status(statusCode).json({ message, submission });
    } catch (err) {
        console.error('POST /assignments/:id/submit:', err);
        res.status(500).json({ message: 'Server error submitting assignment' });
    }
});

// ── GET /api/assignments/:id/submissions ─────────────────────
// Admin/Lecturer: all submissions with optional filters
// Student:        own submission only
router.get('/:id/submissions', protect, async (req, res) => {
    try {
        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        // Student: own submission only
        if (!isAdminOrLecturer(req)) {
            const submission = await Submission.findOne({
                assignment: req.params.id,
                student:    req.user._id,
            });
            return res.json({ submission: submission || null });
        }

        // Admin / Lecturer: paginated list of all submissions
        const { page = 1, limit = 50, graded } = req.query;
        const filter = { assignment: req.params.id };

        if (graded === 'true')  filter.grade = { $ne: null };
        if (graded === 'false') filter.grade = null;

        const total = await Submission.countDocuments(filter);
        const submissions = await paginate(
            Submission.find(filter)
                .populate('student',  'fullName email nic')
                .populate('gradedBy', 'fullName email')
                .sort({ submittedAt: -1 }),
            page,
            limit
        );

        res.json({ total, page: parseInt(page), submissions });
    } catch (err) {
        console.error('GET /assignments/:id/submissions:', err);
        res.status(500).json({ message: 'Server error fetching submissions' });
    }
});

// ── PATCH /api/assignments/:id/submissions/:submissionId/grade
// Admin / Lecturer grades a submission
router.patch('/:id/submissions/:submissionId/grade', protect, async (req, res) => {
    try {
        if (!isAdminOrLecturer(req))
            return res.status(403).json({ message: 'Admin or Lecturer access required' });

        if (!validId(req.params.submissionId))
            return res.status(400).json({ message: 'Invalid submission ID' });

        const { grade, feedback } = req.body;

        if (grade === undefined || grade === null)
            return res.status(400).json({ message: 'grade is required' });

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment)
            return res.status(404).json({ message: 'Assignment not found' });

        const numGrade = parseFloat(grade);
        if (isNaN(numGrade) || numGrade < 0 || numGrade > assignment.maxScore)
            return res.status(400).json({
                message: `Grade must be a number between 0 and ${assignment.maxScore}`,
            });

        // Apply late penalty
        let finalGrade = numGrade;
        const submission = await Submission.findOne({
            _id:        req.params.submissionId,
            assignment: req.params.id,
        });

        if (!submission)
            return res.status(404).json({ message: 'Submission not found' });

        if (submission.isLate && assignment.latePenaltyPercent > 0) {
            finalGrade = parseFloat(
                (numGrade * (1 - assignment.latePenaltyPercent / 100)).toFixed(2)
            );
        }

        submission.grade      = numGrade;
        submission.finalGrade = finalGrade;
        submission.feedback   = feedback || '';
        submission.gradedBy   = req.user._id;
        submission.gradedAt   = new Date();
        await submission.save();

        await submission.populate('student', 'fullName email');

        res.json({ message: 'Submission graded', submission });
    } catch (err) {
        console.error('PATCH grade:', err);
        res.status(500).json({ message: 'Server error grading submission' });
    }
});

// ── GET /api/assignments/:id/stats ───────────────────────────
// Aggregate stats for an assignment (Admin / Lecturer)
router.get('/:id/stats', protect, async (req, res) => {
    try {
        if (!isAdminOrLecturer(req))
            return res.status(403).json({ message: 'Admin or Lecturer access required' });

        if (!validId(req.params.id))
            return res.status(400).json({ message: 'Invalid assignment ID' });

        const [stats] = await Submission.aggregate([
            { $match: { assignment: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $group: {
                    _id:              null,
                    totalSubmissions: { $sum: 1 },
                    graded:           { $sum: { $cond: [{ $ne: ['$grade', null] }, 1, 0] } },
                    avgGrade:         { $avg: '$grade' },
                    minGrade:         { $min: '$grade' },
                    maxGrade:         { $max: '$grade' },
                    lateSubmissions:  { $sum: { $cond: ['$isLate', 1, 0] } },
                },
            },
        ]);

        const assignment = await Assignment.findById(req.params.id)
            .select('title maxScore dueDate status');

        res.json({
            assignment,
            stats: stats || {
                totalSubmissions: 0,
                graded:           0,
                avgGrade:         null,
                minGrade:         null,
                maxGrade:         null,
                lateSubmissions:  0,
            },
        });
    } catch (err) {
        console.error('GET /assignments/:id/stats:', err);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

module.exports = router;
