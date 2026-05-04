const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. ALWAYS load env vars FIRST before requiring other internal files!
dotenv.config();

const connectDB = require('./config/db');

// Import Routes
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const Assignment = require('./models/Assignment'); // ensure model registers
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const userRoutes = require('./routes/userRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Connect to database
connectDB().then(async () => {
    const User = require('./models/User');
    // One-time migration — safe to remove after first run
    await User.updateMany({ role: { $exists: false } }, { $set: { role: 'super_admin' } });
    console.log('Migration: Patched users with missing roles.');
});

const app = express();

// Middleware
app.use(cors()); // Allow all origins for mobile development convenience
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Traffic Logger
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static('uploads'));

// Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 UNCAUGHT ERROR:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Add a default home route
app.get('/', (req, res) => {
    res.send('CSBM MERN Backend API is running...');
});

const PORT = process.env.PORT || 8080;

// Listen on 0.0.0.0 to allow external network access
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://192.168.1.102:${PORT}`);
});