const Workshop = require('../models/Workshop');
const WorkshopRegistration = require('../models/WorkshopRegistration');
const crypto = require('crypto');

const workshopController = {
    // GET /api/workshops/all
    getAllWorkshops: async (req, res) => {
        try {
            const workshops = await Workshop.find();
            res.status(200).json(workshops);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch workshops', details: error.message });
        }
    },

    // POST /api/workshops/create
    createWorkshop: async (req, res) => {
        try {
            const { topic, speaker, date, time, venue, capacity, description } = req.body;
            
            if (!topic || !speaker || !date || !time) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const workshop = new Workshop({
                topic,
                title: topic,
                speaker,
                date,
                time,
                venue: venue || 'Main Auditorium',
                location: venue || 'Main Auditorium', // Added for backward compatibility
                capacity: capacity || 50,
                description: description || '',
                createdBy: req.user ? req.user.id : null
            });

            const savedWorkshop = await workshop.save();
            res.status(201).json(savedWorkshop);
        } catch (error) {
            console.error('Create workshop error:', error);
            res.status(400).json({ error: 'Failed to create workshop', details: error.message });
        }
    },

    // POST /api/workshops/register (auth required — email taken from JWT)
    registerForWorkshop: async (req, res) => {
        try {
            const { workshopId, registrationType = 'Online' } = req.body;

            // Get student email from JWT (set by verifyToken middleware)
            const studentEmail = req.user && req.user.email;
            if (!studentEmail) {
                return res.status(401).json({ message: 'Unauthorized. Please log in.' });
            }

            if (!workshopId) {
                return res.status(400).json({ message: 'Workshop ID is required.' });
            }

            // Verify workshop exists
            const workshop = await Workshop.findById(workshopId);
            if (!workshop) {
                return res.status(404).json({ message: 'Workshop not found.' });
            }

            // Prevent duplicate registration
            const existing = await WorkshopRegistration.findOne({ studentEmail, workshopId });
            if (existing) {
                return res.status(400).json({ message: 'You are already registered for this workshop.' });
            }

            // Generate unique Reference ID
            const randomString = crypto.randomUUID().substring(0, 8).toUpperCase();
            const refId = `WS-${randomString}`;

            const newRegistration = new WorkshopRegistration({
                studentEmail,
                workshopId,
                registrationType,
                referenceId: refId,
                status: 'Registered'
            });

            await newRegistration.save();

            res.status(201).json({
                message: 'Registration Successful',
                referenceId: refId,
                status: 'CONFIRMED'
            });
        } catch (error) {
            console.error('Workshop registration error:', error);
            res.status(500).json({ message: 'Server error. Please try again.', details: error.message });
        }
    },

    // DELETE /api/workshops/:id
    deleteWorkshop: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedWorkshop = await Workshop.findByIdAndDelete(id);

            if (!deletedWorkshop) {
                return res.status(404).json({ error: 'Workshop not found' });
            }

            res.status(200).json({ message: 'Workshop deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete workshop', details: error.message });
        }
    },

    // GET /api/workshops/my-registrations (auth required)
    getMyRegistrations: async (req, res) => {
        try {
            const email = req.user && req.user.email;
            if (!email) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const registrations = await WorkshopRegistration.find({ studentEmail: email })
                .populate('workshopId')
                .sort({ createdAt: -1 });

            const mapped = registrations.map(reg => {
                const w = reg.workshopId || {};
                return {
                    _id: reg._id,
                    workshopId: (w._id || reg.workshopId || '').toString(),
                    workshopTitle: w.topic || w.title || 'Workshop',
                    workshopDate: w.date || null,
                    workshopTime: w.time || null,
                    workshopVenue: w.location || w.venue || null,
                    status: reg.status || 'Registered',
                    referenceId: reg.referenceId
                };
            });

            res.status(200).json(mapped);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch registrations', details: error.message });
        }
    }
};

module.exports = workshopController;
