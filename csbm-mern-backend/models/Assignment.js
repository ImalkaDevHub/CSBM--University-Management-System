const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Assignment title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    instructions: {
        type: String,
        default: '',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
    },
    maxScore: {
        type: Number,
        default: 100,
        min: 1,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'draft',
    },
    allowLateSubmission: {
        type: Boolean,
        default: false,
    },
    latePenaltyPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
}, { timestamps: true });

// Virtual: whether the assignment is past its due date
assignmentSchema.virtual('isOverdue').get(function () {
    return this.status === 'published' && new Date() > this.dueDate;
});

assignmentSchema.set('toJSON', { virtuals: true });
assignmentSchema.set('toObject', { virtuals: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
