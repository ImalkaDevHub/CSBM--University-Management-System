const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    textContent: {
        type: String,
        default: '',
    },
    // Path to the uploaded file (stored in /uploads/assignments/)
    fileUrl: {
        type: String,
        default: null,
    },
    fileName: {
        type: String,
        default: null,
    },
    isLate: {
        type: Boolean,
        default: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    // Grading fields (filled by admin/lecturer)
    grade: {
        type: Number,
        default: null,
    },
    finalGrade: {
        // after late penalty applied
        type: Number,
        default: null,
    },
    feedback: {
        type: String,
        default: '',
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    gradedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// One submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

submissionSchema.set('toJSON', { virtuals: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
