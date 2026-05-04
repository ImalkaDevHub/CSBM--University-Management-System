const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const { verifyToken: protect } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// --- SPECIFIC NAMED ROUTES (MUST BE AT THE VERY TOP) ---

// GET my registrations (NEW PERMANENT PATH)
router.get('/registrations/my', protect, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const registrations = await WorkshopRegistration
            .find({ student: studentId })
            .populate('workshop')
            .sort({ registeredAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET registrations for a specific workshop (ADMIN only)
router.get('/registrations/all', protect, authorize(['marketing_coordinator', 'admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN', 'registration_staff', 'finance_staff']), async (req, res) => {
    try {
        const { workshop } = req.query;
        if (!workshop) return res.status(400).json({ message: 'Workshop ID required' });
        const regs = await WorkshopRegistration.find({ workshop }).populate('student', 'name email mobileNumber').sort({ registeredAt: -1 });
        const mapped = regs.map(r => ({ ...r._doc, studentName: r.student?.name || 'Unknown', email: r.student?.email || 'N/A' }));
        res.json(mapped);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST register for a workshop
router.post('/register', protect, async (req, res) => {
    try {
        const studentId = req.user?._id || req.user?.id;
        const workshopId = req.body.workshopId || req.body.workshop || req.body.id;
        if (!studentId || !workshopId) return res.status(400).json({ message: 'Missing data' });
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        const existing = await WorkshopRegistration.findOne({ student: studentId, workshop: workshopId });
        if (existing) return res.status(400).json({ message: 'Already registered' });
        const referenceId = 'WS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        const registration = await WorkshopRegistration.create({ student: studentId, workshop: workshopId, status: 'confirmed', referenceId, registeredAt: new Date() });
        res.status(201).json({ success: true, message: 'Registered successfully!', referenceId, registration });
    } catch (err) { res.status(500).json({ message: err.message }); }
});


// --- GENERIC/DYNAMIC ROUTES (MUST BE AFTER SPECIFIC ROUTES) ---

// GET all workshops (PUBLIC)
router.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find({}).sort({ date: 1 });
        res.json(workshops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create workshop (ADMIN only)
router.post('/', protect, authorize(['marketing_coordinator', 'admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN', 'registration_staff', 'finance_staff']), async (req, res) => {
    try {
        const { title, topic, speaker, date } = req.body;
        if (!(speaker || req.body.speakerName) || !date) return res.status(400).json({ message: 'Missing fields' });
        const workshop = await Workshop.create({
            title: title || topic || req.body.workshopName,
            topic: topic || title || req.body.workshopName,
            speaker: speaker || req.body.speakerName || req.body.Speaker,
            date: new Date(date),
            time: req.body.time || `${req.body.startTime} - ${req.body.endTime}` || '',
            location: req.body.location || 'Main Auditorium',
            description: req.body.description || '',
            maxCapacity: req.body.maxCapacity || req.body.totalSeats || 50,
            price: req.body.price || 0,
            bannerImage: req.body.bannerImage || req.body.banner || '',
            status: req.body.status || 'active',
            createdBy: req.user?._id || req.user?.id
        });
        res.status(201).json(workshop);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single workshop
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        res.json(workshop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update workshop
router.put('/:id', protect, authorize(['marketing_coordinator', 'admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN', 'registration_staff', 'finance_staff']), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
        const updated = await Workshop.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Workshop not found to update' });
        res.json(updated);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE workshop
router.delete('/:id', protect, authorize(['marketing_coordinator', 'admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN', 'registration_staff', 'finance_staff']), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
        await Workshop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workshop deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
