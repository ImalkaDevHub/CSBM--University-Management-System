const StudentApplication = require('../models/StudentApplication');
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/emailService');

const analyticsController = {
    // GET /api/analytics/stats
    getStats: async (req, res) => {
        try {
            const total = await StudentApplication.countDocuments();
            const approved = await StudentApplication.countDocuments({ status: 'APPROVED' });
            const rejected = await StudentApplication.countDocuments({ status: 'REJECTED' });
            const pending = total - approved - rejected;

            res.status(200).json({
                total,
                approved,
                rejected,
                pending
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch overall stats', details: error.message });
        }
    },

    // GET /api/analytics/export
    exportToCSV: async (req, res) => {
        try {
            const students = await StudentApplication.find();

            let csv = 'ID,Full Name,Email,Mobile Number,Course,Registration Date,Status,Admin Comments\n';
            students.forEach(s => {
                // Escape commas in strings to prevent CSV breakage
                const name = `"${s.fullName || ''}"`;
                const email = `"${s.email || ''}"`;
                const course = `"${s.courseName || ''}"`;
                const comments = `"${s.adminComments || ''}"`;
                const date = `"${new Date(s.createdAt).toISOString().split('T')[0]}"`;

                csv += `${s._id},${name},${email},${s.mobileNumber || ''},${course},${date},${s.status},${comments}\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
            res.status(200).send(csv);
        } catch (error) {
            res.status(500).json({ error: 'Failed to export to CSV', details: error.message });
        }
    },

    // POST /api/analytics/notify
    sendNotification: async (req, res) => {
        try {
            const { type, recipientGroup, subject, message, recipientEmails } = req.body;

            let recipients = [];

            if (recipientEmails && recipientEmails.length > 0) {
                // Handle string or array gracefully to prevent MongoDB CastError
                const emailsArray = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];
                
                // Direct specific students
                const students = await StudentApplication.find({ email: { $in: emailsArray } });
                
                // Support mocked frontend rows that don't exist in MongoDB yet
                const foundEmails = students.map(s => s.email);
                const missingEmails = emailsArray.filter(e => !foundEmails.includes(e));

                recipients = [...students];
                missingEmails.forEach(email => {
                    recipients.push({ email, fullName: email.split('@')[0] }); // Best-effort mock student
                });
            } else if (recipientGroup === 'All Incomplete Students') {
                recipients = await StudentApplication.find({ status: 'PENDING' });
            } else if (recipientGroup === 'All Approved Students') {
                recipients = await StudentApplication.find({ status: 'APPROVED' });
            } else if (recipientGroup === 'All Students') {
                recipients = await StudentApplication.find();
            } else {
                return res.status(400).json({ error: 'Invalid recipient group or missing emails' });
            }

            if (recipients.length === 0) {
                return res.status(200).json({ message: "No students found to notify." });
            }

            // Create notification records in DB
            const notifications = recipients.map(student => ({
                userId: student.userId, // Some students might not have userId if manually added, but email is there
                email: student.email,
                type: type,
                subject: subject,
                // Make sure message exists to prevent crashing when .replace is called
                message: (message || '').replace('{studentName}', student.fullName || 'Student'),
                isRead: false,
                status: 'sent',
                createdBy: 'admin',
                createdAt: new Date()
            }));

            await Notification.insertMany(notifications);

            // Mock or actual send emails
            const emailPromises = recipients.map(student => {
                const personalizedMsg = (message || '').replace('{studentName}', student.fullName || 'Student');
                return sendEmail(student.email, subject, `<h3>Dear ${student.fullName || 'Student'},</h3><p>${personalizedMsg.replace(/\n/g, '<br>')}</p>`).catch(e => console.error("Email failed", e));
            });

            await Promise.allSettled(emailPromises);

            return res.status(200).json({ message: `Successfully sent notifications to ${recipients.length} students.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to send notification', details: error.message });
        }
    }
};

module.exports = analyticsController;
