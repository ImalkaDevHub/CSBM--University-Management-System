const StudentApplication = require('../models/StudentApplication');
const { sendEmail } = require('../services/emailService');

const applicationController = {
    // POST /api/applications/submit
    // Receives JSON with Cloudinary URLs from the frontend
    // POST /api/applications/manual
    submitManualApplication: async (req, res) => {
        try {
            const {
                fullName, email, mobileNumber, nic, courseId, intake,
                paymentMethod, amountPaid, receiptNumber, notes
            } = req.body;

            const StudentApplication = require('../models/StudentApplication');
            const Course = require('../models/Course');
            
            const selectedCourse = await Course.findById(courseId);

            const app = new StudentApplication({
                fullName,
                email,
                mobileNumber,
                address: 'Walk-in / Physical Registration',
                nicPassportNumber: nic,
                courseName: selectedCourse?.title || selectedCourse?.name || 'Manual Enrollment',
                intakeYear: intake,
                status: 'APPROVED', // Manual registrations are usually approved immediately
                digitalSignature: 'PHYSICAL_SIGNATURE_ON_FILE',
                nicFileName: 'MANUAL',
                birthCertFileName: 'MANUAL',
                passportPhotoFileName: 'MANUAL',
                adminComments: `Manual entry by ${req.user.name}. Receipt: ${receiptNumber}. Method: ${paymentMethod}. Notes: ${notes}`
            });

            await app.save();
            res.status(201).json({ success: true, message: 'Manual registration successful', application: app });
        } catch (error) {
            console.error('Manual App Error:', error);
            res.status(500).json({ error: 'Manual registration failed', details: error.message });
        }
    },

    submitApplication: async (req, res) => {
        try {
            console.log('[Backend] Receiving application submission:', req.body.email);
            
            const {
                fullName, email, mobileNumber, address, course,
                digitalSignature, stream, passes, qualification, institution, gpa,
                nicUrl, birthCertUrl, passportPhotoUrl, transcriptUrl
            } = req.body;

            // Basic validation - Support both nicUrl and nicFileName naming variants
            const finalNic = nicUrl || req.body.nicFileName;
            const finalBirth = birthCertUrl || req.body.birthCertFileName;
            const finalPhoto = passportPhotoUrl || req.body.passportPhotoFileName;

            if (!fullName || !email || !finalNic || !finalBirth || !finalPhoto) {
                return res.status(400).json({ 
                    error: 'Missing required fields or document URLs. Please ensure all required files (NIC, Birth Cert, Photo) are uploaded.' 
                });
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
                courseName: req.body.courseName || course,
                digitalSignature,
                // Saving Cloudinary URLs directly
                nicFileName:           req.body.nicFileName || nicUrl,
                birthCertFileName:     req.body.birthCertFileName || birthCertUrl,
                passportPhotoFileName: req.body.passportPhotoFileName || passportPhotoUrl,
                transcriptFileName:    req.body.transcriptFileName || transcriptUrl || null,
                status: 'PENDING'
            });

            const savedApp = await app.save();
            console.log('[Backend] Application saved successfully for:', email);

            // Send Welcome Email
            try {
                await sendEmail(
                    email,
                    "Application Received - CSBM Campus",
                    `<h3>Dear ${fullName},</h3><p>We have successfully received your application for <strong>${course}</strong>. Our team will review your documents shortly.</p><p>Thank you for choosing CSBM Campus.</p>`
                );
            } catch (emailErr) {
                console.error('[Backend] Email sending failed but application was saved:', emailErr.message);
            }

            res.status(201).json(savedApp);
        } catch (error) {
            console.error('[Backend] Submit Application Error:', error);
            res.status(500).json({ 
                error: 'Failed to submit application', 
                details: error.message 
            });
        }
    },

    // GET /api/applications/my-application (auth required)
    // Returns 200 with null if no application exists to avoid red 404 console errors
    getMyApplication: async (req, res) => {
        try {
            const email = req.user && req.user.email;
            if (!email) {
                return res.status(401).json({ error: 'Unauthorized access' });
            }

            console.log('[Backend] Fetching application for student:', email);
            const app = await StudentApplication.findOne({ email }).sort({ createdAt: -1 });

            // Return 200 with null instead of 404 to avoid console errors in the dashboard
            res.status(200).json(app || null);
        } catch (error) {
            console.error('[Backend] Fetch My Application Error:', error);
            res.status(500).json({ error: 'Failed to fetch application', details: error.message });
        }
    },

    // GET /api/applications/all
    getAllApplications: async (req, res) => {
        try {
            const apps = await StudentApplication.find().sort({ createdAt: -1 });
            res.status(200).json(apps);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
        }
    },

    // GET /api/applications/admin (Filtered and Search)
    getAdminApplications: async (req, res) => {
        try {
            const { status, search } = req.query;
            let query = {};

            if (status && status !== 'All') {
                query.status = status.toUpperCase();
            }

            if (search) {
                query.$or = [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { courseName: { $regex: search, $options: 'i' } }
                ];
            }

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
            const { status, comment } = req.body;

            const updatedApp = await StudentApplication.findById(id);
            if (!updatedApp) {
                return res.status(404).json({ error: 'Application not found' });
            }

            if (status) updatedApp.status = status.toUpperCase();
            if (comment) updatedApp.adminComments = comment;

            await updatedApp.save();

            // Email status update
            if (status) {
                let color = status.toUpperCase() === 'APPROVED' ? 'green' : (status.toUpperCase() === 'REJECTED' ? 'red' : 'orange');
                sendEmail(
                    updatedApp.email,
                    `Application Status Update - ${status.toUpperCase()}`,
                    `<h3>Dear ${updatedApp.fullName},</h3><p>Your application status has been updated to: <strong style="color: ${color}">${status.toUpperCase()}</strong>.</p>${comment ? `<p><strong>Admin Comment:</strong> ${comment}</p>` : ''}<p>Thank you.</p>`
                );
            }

            res.status(200).json(updatedApp);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update status', details: error.message });
        }
    },

    // Approve Application
    approveApplication: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedApp = await StudentApplication.findByIdAndUpdate(
                id,
                { status: 'APPROVED', reviewedAt: new Date(), reviewedBy: req.user?.id },
                { new: true }
            );
            if (!updatedApp) return res.status(404).json({ error: 'Application not found' });
            res.status(200).json({ message: 'Application approved', application: updatedApp });
        } catch (error) {
            res.status(500).json({ error: 'Approval failed', details: error.message });
        }
    },

    // Reject Application
    rejectApplication: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedApp = await StudentApplication.findByIdAndUpdate(
                id,
                { status: 'REJECTED', reviewedAt: new Date(), reviewedBy: req.user?.id },
                { new: true }
            );
            if (!updatedApp) return res.status(404).json({ error: 'Application not found' });
            res.status(200).json({ message: 'Application rejected', application: updatedApp });
        } catch (error) {
            res.status(500).json({ error: 'Rejection failed', details: error.message });
        }
    },

    // GET /api/applications/my-status (public by email)
    getMyStatus: async (req, res) => {
        try {
            const { email } = req.query;
            if (!email) return res.status(400).json({ error: 'Email required' });
            const app = await StudentApplication.findOne({ email }).sort({ createdAt: -1 });
            if (!app) return res.status(404).json({ error: 'Application not found' });
            res.status(200).json(app);
        } catch (error) {
            res.status(500).json({ error: 'Status fetch failed', details: error.message });
        }
    }
};

module.exports = applicationController;
