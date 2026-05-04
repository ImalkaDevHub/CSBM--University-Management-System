const express = require('express');
const mongoose = require('mongoose');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const { verifyToken: protect } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

const router = express.Router();



// GET all workshops (PUBLIC)
router.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find({}).sort({ date: 1 });
        res.json(workshops);
    } catch (err) {
        console.error('GET workshops error:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET single workshop (PUBLIC)
router.get('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        res.json(workshop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET my registrations (PROTECTED)
// Works as /api/workshops/my-registrations OR /api/workshopregistrations/my
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

// Alias for /api/workshopregistrations/my
router.get('/my', protect, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const registrations = await WorkshopRegistration.find({ student: studentId })
            .populate('workshop')
            .sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST register for workshop (PROTECTED)
const registerHandler = async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const workshopId = req.body.workshopId || req.body.workshop || req.body.id;

        if (!studentId) return res.status(401).json({ message: 'Not authenticated' });
        if (!workshopId) return res.status(400).json({ message: 'Workshop ID is required' });
        if (!mongoose.Types.ObjectId.isValid(workshopId)) return res.status(400).json({ message: 'Invalid workshop ID' });

        const workshop = await Workshop.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

        const existing = await WorkshopRegistration.findOne({ student: studentId, workshop: workshopId });
        if (existing) return res.status(400).json({ message: 'Already registered' });

        const referenceId = 'WS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();

        const registration = await WorkshopRegistration.create({
            student: studentId,
            workshop: workshopId,
            status: 'confirmed',
            referenceId: referenceId,
            registeredAt: new Date()
        });

        res.status(201).json({ success: true, message: 'Registered successfully!', referenceId, registration });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

router.post('/register', protect, registerHandler);
router.post('/', protect, (req, res, next) => {
    // Only handle if it's NOT a create workshop request (which has admin roles)
    // Actually, create workshop is POST / too.
    // We can differentiate by body content or just let it fall through if it's an admin.
    if (req.body.workshopId || req.body.workshop) {
        return registerHandler(req, res);
    }
    next();
});

// POST create workshop (ADMIN only)
router.post('/', protect, authorize(['marketing_coordinator', 'admin', 'super_admin']), async (req, res) => {
    try {
        const { title, topic, speaker, date, time, location, description, maxCapacity } = req.body;
        
        if (!(speaker || req.body.speakerName) || !date) {
            return res.status(400).json({ message: 'Speaker and date are required' });
        }

        const workshop = await Workshop.create({
            title: title || topic || req.body.workshopName,
            topic: topic || title || req.body.workshopName,
            speaker: speaker || req.body.speakerName || req.body.Speaker,
            date: new Date(date),
            time: time || req.body.time || '',
            location: location || 'Main Auditorium',
            description: description || '',
            maxCapacity: maxCapacity || req.body.totalSeats || 50,
            price: req.body.price || 0,
            bannerImage: req.body.bannerImage || req.body.banner || '',
            speakerBio: req.body.speakerBio || '',
            speakerPhoto: req.body.speakerPhoto || '',
            status: req.body.status || 'active',
            createdBy: req.user?._id || req.user?.id
        });

        res.status(201).json(workshop);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// PUT update workshop (ADMIN only)
router.put('/:id', protect, authorize(['marketing_coordinator', 'admin', 'super_admin']), async (req, res) => {
    try {
        const updated = await Workshop.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE workshop (ADMIN only)
router.delete('/:id', protect, authorize(['marketing_coordinator', 'admin', 'super_admin']), async (req, res) => {
    try {
        await Workshop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workshop deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
