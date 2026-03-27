const express = require('express');
const mongoose = require('mongoose');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const { verifyToken: protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Helper to check admin
const isAdmin = (req) => {
    const role = req.user?.role || '';
    return role.toLowerCase() === 'admin';
};

// GET all workshops
router.get('/', protect, async (req, res) => {
    try {
        const workshops = await Workshop.find({}).sort({ date: 1 });
        res.json(workshops);
    } catch (err) {
        console.error('GET workshops error:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET my registrations
router.get('/my-registrations', protect, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const registrations = await WorkshopRegistration.find({ student: studentId })
            .populate('workshop')
            .sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        console.error('My registrations error:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST register for workshop
router.post('/register', protect, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const workshopId = req.body.workshopId || req.body.workshop || req.body.id;

        // Validate studentId
        if (!studentId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Validate workshopId
        if (!workshopId) {
            return res.status(400).json({ message: 'Workshop ID is required' });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(workshopId)) {
            return res.status(400).json({ message: 'Invalid workshop ID' });
        }

        // Check workshop exists
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return res.status(404).json({ message: 'Workshop not found' });
        }

        // Check already registered
        const existing = await WorkshopRegistration.findOne({
            student: studentId,
            workshop: workshopId
        });
        if (existing) {
            return res.status(400).json({ message: 'Already registered' });
        }

        // Generate reference ID
        const referenceId = 'WS-' +
            Date.now().toString(36).toUpperCase() +
            '-' + Math.random().toString(36).substr(2, 4).toUpperCase();

        // Create registration
        const registration = await WorkshopRegistration.create({
            student: studentId,
            workshop: workshopId,
            status: 'confirmed',
            referenceId: referenceId,
            registeredAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Registered successfully!',
            referenceId: referenceId,
            registration: registration
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// POST create workshop (admin only)
router.post('/', protect, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const {
            title, topic, speaker, date,
            time, location, description,
            maxCapacity
        } = req.body;

        if (!speaker || !date) {
            return res.status(400).json({ message: 'Speaker and date are required' });
        }

        const workshop = await Workshop.create({
            title: title || topic,
            topic: topic || title,
            speaker,
            date: new Date(date),
            time: time || '',
            location: location || 'Main Auditorium',
            description: description || '',
            maxCapacity: maxCapacity || 50,
            status: 'active',
            createdBy: req.user?._id || req.user?.id
        });

        res.status(201).json(workshop);
    } catch (err) {
        console.error('Create workshop error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// DELETE workshop (admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Admin access required' });
        }
        await Workshop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workshop deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
