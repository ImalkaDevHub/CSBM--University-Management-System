const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    intakeDate: {
        type: Date,
        required: true,
    },
    courseFee: {
        type: Number,
        required: true,
    },
    // --- Automated Eligibility Rules ---
    eligibility: {
        requiredStream: {
            type: String,
            // Updated to match standard A/L streams
            enum: ['Any', 'Maths', 'Bio', 'Science', 'Commerce', 'Arts', 'Technology'],
            default: 'Any'
        },
        minimumPasses: {
            type: Number,
            default: 3
        }
    },
    applicationDeadline: {
        type: Date,
    },
    intakeStatus: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'UPCOMING'],
        default: 'OPEN',
    }
}, { timestamps: true });

// Format the output (Optional: Keeps _id mapped to id for cleaner JSON responses)
courseSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;