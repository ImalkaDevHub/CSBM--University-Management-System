const StudentApplication = require('../models/StudentApplication');
const { sendEmail } = require('../services/emailService');

const applicationController = {
    // POST /api/applications/submit
    submitApplication: async (req, res) => {
        try {
            const { fullName, email, mobileNumber, address, course, digitalSignature, stream, passes, qualification, institution, gpa } = req.body;

            // req.files will be populated by multer middleware
            const nicFileName = req.files['nic'] ? req.files['nic'][0].filename : null;
            const birthCertFileName = req.files['birthCert'] ? req.files['birthCert'][0].filename : null;
            const passportPhotoFileName = req.files['passportPhoto'] ? req.files['passportPhoto'][0].filename : null;
            const transcriptFileName = req.files['transcriptFile'] ? req.files['transcriptFile'][0].filename : null;

            if (!nicFileName || !birthCertFileName || !passportPhotoFileName) {
                return res.status(400).json({ error: 'Missing required file uploads' });
            }

            const app = new StudentApplication({
                fullName,
                email,
                mobileNumber,
                address,
                stream,
                passes,
                qualification,
                institution,
                gpa,
                courseName: course,
                digitalSignature,
                nicFileName,
                birthCertFileName,
                passportPhotoFileName,
                transcriptFileName,
                status: 'PENDING'
            });

            const savedApp = await app.save();

            // Send Welcome Email async
            sendEmail(
                email,
                "Application Received - CSBM Campus",
                `<h3>Dear ${fullName},</h3><p>We have successfully received your application for <strong>${course}</strong>. Our team will review your documents shortly.</p><p>Thank you for choosing CSBM Campus.</p>`
            );

            res.status(201).json(savedApp);
        } catch (error) {
            res.status(500).json({ error: 'Failed to submit application', details: error.message });
        }
    },

    // GET /api/applications/all
    getAllApplications: async (req, res) => {
        try {
            const apps = await StudentApplication.find();
            res.status(200).json(apps);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
        }
    },

    // GET /api/applications/admin (New Endpoint with Filtering and Search)
    getAdminApplications: async (req, res) => {
        try {
            const { status, search } = req.query;
            let query = {};

            // 1. Handle Status Filter
            if (status && status !== 'All') {
                query.status = status.toUpperCase();
            }

            // 2. Handle Search Query
            if (search) {
                // Search by Full Name, Email, or Program Name
                query.$or = [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { programName: { $regex: search, $options: 'i' } },
                    { courseName: { $regex: search, $options: 'i' } }
                ];
            }

            // Fetch applications, sorted newest first
            const apps = await StudentApplication.find(query).sort({ createdAt: -1 });
            res.status(200).json(apps);

        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch admin applications', details: error.message });
        }
    },

    // PUT /api/applications/:id/status
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            // Handle status from either query parameters or body safely
            const body = req.body || {};
            const status = req.query.status || body.status;
            const comment = body.comment;

            const updatedApp = await StudentApplication.findById(id);

            if (!updatedApp) {
                return res.status(404).json({ error: 'Application not found' });
            }

            console.log(`Update Request for ${id}: req.query.status: ${req.query.status}, req.body:`, req.body);
            console.log(`Extracted status string: ${status}`);

            if (status) {
                updatedApp.status = status.toUpperCase();
            }
            if (comment) {
                updatedApp.adminComments = comment;
            }

            console.log(`Model status before save: ${updatedApp.status}`);
            await updatedApp.save();

            // Send Status Update Email async
            if (status && (status.toUpperCase() === 'APPROVED' || status.toUpperCase() === 'REJECTED' || status.toUpperCase() === 'PENDING')) {
                let statusColor = 'orange'; // default for pending
                if (status.toUpperCase() === 'APPROVED') statusColor = 'green';
                if (status.toUpperCase() === 'REJECTED') statusColor = 'red';

                sendEmail(
                    updatedApp.email,
                    `Application Status Update: ${status.toUpperCase()} - CSBM Campus`,
                    `<h3>Dear ${updatedApp.fullName},</h3><p>Your application status for <strong>${updatedApp.courseName}</strong> has been updated to: <strong style="color: ${statusColor}">${status.toUpperCase()}</strong>.</p>${comment ? `<p><strong>Admin Comment:</strong> ${comment}</p>` : ''}<p>Thank you,</p><p>CSBM Campus Admin Team</p>`
                );
            }

            res.status(200).json(updatedApp);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update application status', details: error.message });
        }
    },

    // Approve Application (Admin Only)
    approveApplication: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`[ADMIN] Approving application: ${id}`);

            const updatedApp = await StudentApplication.findByIdAndUpdate(
                id,
                { 
                    status: 'APPROVED',
                    reviewedAt: new Date(),
                    reviewedBy: req.user?.id || null
                },
                { new: true }
            );

            if (!updatedApp) {
                return res.status(404).json({ error: 'Application not found' });
            }

            res.status(200).json({ 
                message: 'Application approved successfully', 
                application: updatedApp 
            });
        } catch (error) {
            console.error('CRITICAL: Approval Process Failed:', error);
            res.status(500).json({ error: 'Failed to approve application', details: error.message });
        }
    },

    // Reject Application (Admin Only)
    rejectApplication: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`[ADMIN] Rejecting application: ${id}`);

            const updatedApp = await StudentApplication.findByIdAndUpdate(
                id,
                { 
                    status: 'REJECTED',
                    reviewedAt: new Date(),
                    reviewedBy: req.user?.id || null
                },
                { new: true }
            );

            if (!updatedApp) {
                return res.status(404).json({ error: 'Application not found' });
            }

            res.status(200).json({ 
                message: 'Application rejected successfully', 
                application: updatedApp 
            });
        } catch (error) {
            console.error('CRITICAL: Rejection Process Failed:', error);
            res.status(500).json({ error: 'Failed to reject application', details: error.message });
        }
    },

    // POST /api/applications/manual-register
    manualRegister: async (req, res) => {
        try {
            const app = new StudentApplication({
                ...req.body,
                status: 'APPROVED',
                nicFileName: 'Pending Upload',
                birthCertFileName: 'Pending Upload',
                passportPhotoFileName: 'Pending Upload' // ensure this exists to pass validations if not bypassed
            });
            const savedApp = await app.save();
            res.status(201).json(savedApp);
        } catch (error) {
            res.status(500).json({ error: 'Failed to manually register', details: error.message });
        }
    },
    // GET /api/applications/my-status
    getMyStatus: async (req, res) => {
        try {
            const { email } = req.query;
            if (!email) {
                return res.status(400).json({ error: 'Email query parameter is required' });
            }

            const app = await StudentApplication.findOne({ email }).sort({ createdAt: -1 });

            if (!app) {
                return res.status(404).json({ error: 'No application found for this email' });
            }

            res.status(200).json(app);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch application status', details: error.message });
        }
    },

    // GET /api/applications/my-application (auth required)
    getMyApplication: async (req, res) => {
        try {
            const email = req.user && req.user.email;
            if (!email) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const app = await StudentApplication.findOne({ email }).sort({ createdAt: -1 });

            if (!app) {
                return res.status(404).json({ message: 'No application found' });
            }

            res.status(200).json(app);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch application', details: error.message });
        }
    }
};

module.exports = applicationController;
