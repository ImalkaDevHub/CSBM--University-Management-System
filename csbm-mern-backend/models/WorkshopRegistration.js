const mongoose = require('mongoose');
const { Schema } = mongoose;

const workshopRegistrationSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required'],
    },
    workshop: {
        type: Schema.Types.ObjectId,
        ref: 'Workshop',
        required: [true, 'Workshop ID is required'],
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'attended', 'cancelled', 'approved'],
        default: 'confirmed'
    },
    referenceId: {
        type: String
    },
    registrationType: {
        type: String,
        default: 'Online'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('WorkshopRegistration', workshopRegistrationSchema);
