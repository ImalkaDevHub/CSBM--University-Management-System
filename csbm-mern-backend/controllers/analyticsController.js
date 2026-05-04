const StudentApplication = require('../models/StudentApplication');
const Notification = require('../models/Notification');
const Course = require('../models/Course');
const { sendEmail } = require('../services/emailService');

const analyticsController = {
    // GET /api/analytics/dashboard
    getDashboardStats: async (req, res) => {
        try {
            const total = await StudentApplication.countDocuments();
            const approved = await StudentApplication.countDocuments({ status: 'APPROVED' });
            const rejected = await StudentApplication.countDocuments({ status: 'REJECTED' });
            const pending = await StudentApplication.countDocuments({ status: 'PENDING' });
            const incomplete = await StudentApplication.countDocuments({ status: 'UPDATES REQUESTED' });

            const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(0) + '%' : '0%';

            // Find Top Course
            const courseStats = await StudentApplication.aggregate([
                { $group: { _id: "$courseName", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);
            const topCourse = courseStats.length > 0 ? courseStats[0]._id : 'N/A';

            // Registrations this month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const totalThisMonth = await StudentApplication.countDocuments({ createdAt: { $gte: startOfMonth } });

            res.status(200).json({
                total,
                approved,
                rejected,
                pending,
                incomplete,
                approvalRate,
                topCourse,
                totalThisMonth,
                avgProcessTime: '1.2d' // Mocked for now
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch dashboard stats' });
        }
    },

    // GET /api/analytics/trends
    getTrends: async (req, res) => {
        try {
            // Get last 6 months data
            const last6Months = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                last6Months.push({
                    month: date.toLocaleString('default', { month: 'short' }),
                    year: date.getFullYear(),
                    start: new Date(date.getFullYear(), date.getMonth(), 1),
                    end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
                });
            }

            const trendData = await Promise.all(last6Months.map(async (m) => {
                const count = await StudentApplication.countDocuments({
                    createdAt: { $gte: m.start, $lte: m.end }
                });
                return count;
            }));

            res.status(200).json({
                labels: last6Months.map(m => m.month),
                monthlyData: trendData
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch trends' });
        }
    },

    // GET /api/analytics/export/applications
    exportToCSV: async (req, res) => {
        try {
            const { type, format } = req.query;
            let query = {};
            
            if (type === 'by_course' && req.query.course) query.courseName = req.query.course;
            if (type === 'by_intake' && req.query.intake) query.intakeYear = req.query.intake;
            if (type === 'incomplete') query.status = 'UPDATES REQUESTED';

            const students = await StudentApplication.find(query).sort({ createdAt: -1 });

            let csv = 'ID,Full Name,Email,NIC,Course,Intake,Status,Date,Comments\n';
            students.forEach(s => {
                const name = `"${s.fullName || ''}"`;
                const email = `"${s.email || ''}"`;
                const nic = `"${s.nicPassportNumber || ''}"`;
                const course = `"${s.courseName || ''}"`;
                const comments = `"${(s.adminComments || '').replace(/"/g, '""')}"`;
                const date = `"${new Date(s.createdAt).toLocaleDateString()}"`;

                csv += `${s._id},${name},${email},${nic},${course},${s.intakeYear || ''},${s.status},${date},${comments}\n`;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="CampusGo_Export_${new Date().getTime()}.csv"`);
            res.status(200).send(csv);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Export failed' });
        }
    },

    // POST /api/analytics/notify
    sendNotification: async (req, res) => {
        try {
            const { type, recipientGroup, subject, message, recipientEmails } = req.body;
            let recipients = [];

            if (recipientEmails && recipientEmails.length > 0) {
                const emailsArray = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];
                recipients = await StudentApplication.find({ email: { $in: emailsArray } });
            } else if (recipientGroup === 'All Incomplete Students') {
                recipients = await StudentApplication.find({ status: { $in: ['PENDING', 'UPDATES REQUESTED'] } });
            } else if (recipientGroup === 'All Approved Students') {
                recipients = await StudentApplication.find({ status: 'APPROVED' });
            } else {
                recipients = await StudentApplication.find();
            }

            const notifications = recipients.map(student => ({
                email: student.email,
                type: type || 'ALERT',
                subject: subject || 'CampusGo Notification',
                message: (message || '').replace('{studentName}', student.fullName),
                status: 'sent',
                createdAt: new Date()
            }));

            await Notification.insertMany(notifications);

            const emailPromises = recipients.map(student => {
                const personalizedMsg = (message || '').replace('{studentName}', student.fullName);
                return sendEmail(student.email, subject, `<h3>Dear ${student.fullName},</h3><p>${personalizedMsg.replace(/\n/g, '<br>')}</p>`);
            });

            await Promise.allSettled(emailPromises);
            res.status(200).json({ success: true, count: recipients.length });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Notification failed' });
        }
    }
};

module.exports = analyticsController;
