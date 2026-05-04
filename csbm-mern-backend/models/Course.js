const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    fees: { type: Number, required: true },
    price: { type: Number },
    eligibilityRequirements: { type: String },
    intakeStatus: { 
        type: String, 
        enum: ['OPEN', 'CLOSED', 'UPCOMING'], 
        default: 'OPEN' 
    },
    nextIntakeDate: { type: Date },
    modules: [{ type: String }],
    history: [{
        updatedAt: { type: Date, default: Date.now },
        changes: { type: mongoose.Schema.Types.Mixed }
    }]
}, { timestamps: true });

courseSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Course', courseSchema);