const mongoose = require('mongoose');

const studentApplicationSchema = new mongoose.Schema({
    // --- Personal Details ---
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },

    // --- Academic Details ---
    stream: { type: String, required: false },
    passes: { type: String, required: false },
    qualification: { type: String, required: false },
    institution: { type: String, required: false },
    gpa: { type: String, required: false },


    // --- Application Details ---
    courseName: {
        type: String,
        required: true,
    },
    programName: { // Human readable, mapped to courseName
        type: String,
        default: 'Not Specified',
    },
    intakeYear: {
        type: String,
        default: new Date().getFullYear().toString(),
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['PENDING', 'UNDER REVIEW', 'APPROVED', 'REJECTED', 'UPDATES REQUESTED'],
        default: 'PENDING',
    },
    adminComments: {
        type: String, // Reason for rejection
        default: null,
    },

    // --- File Uploads (Paths) ---
    studentPhotoUrl: { // Optional path to a photo
        type: String,
        default: '',
    },
    nicPassportNumber: {
        type: String,
        default: 'Pending',
    },
    documentStatus: {
        type: String,
        enum: ['Missing documents', 'Documents Pending Review', 'All Documents Uploaded'],
        default: 'Documents Pending Review'
    },
    nicFileName: {
        type: String,
        required: true,
    },
    birthCertFileName: {
        type: String,
        required: true,
    },
    passportPhotoFileName: {
        type: String,
        required: true,
    },
    transcriptFileName: {
        type: String,
        default: null,
    },

    // --- Legal ---
    digitalSignature: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Customize toJSON to return both `id` and `_id`
studentApplicationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // We keep _id for frontend compatibility (some parts use _id, some use id)
    }
});

const StudentApplication = mongoose.model('StudentApplication', studentApplicationSchema);

module.exports = StudentApplication;
