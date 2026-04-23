const mongoose = require('mongoose');

/**
 * User Model for Multi-Role Authentication System
 * Supports three roles: ADMIN, STUDENT, LECTURER
 */
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true, // Note: plain text currently as per Java model
    },
    fullName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    nic: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: String, // String format for simplicity in this project
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'STUDENT', 'LECTURER'],
        default: 'STUDENT',
    },
    firebaseUid: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    }
}, { timestamps: true });

// Customize toJSON to return both `id` and `_id`
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // Keep _id for frontend compatibility
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
