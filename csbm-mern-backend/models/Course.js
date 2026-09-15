const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String },
    name: { type: String },
    code: { type: String, required: true },
    description: { type: String },
    duration: { type: String, default: '3 Years' },
    fees: { type: Number },
    courseFee: { type: Number },
    price: { type: Number },
    eligibilityRequirements: { type: String },
    eligibility: {
        requiredStream: { type: String, default: 'Any' },
        minimumPasses: { type: Number, default: 2 }
    },
    streamReq: { type: String, default: 'Any' },
    minALPasses: { type: Number, default: 2 },
    minAge: { type: Number, default: 16 },
    minGPA: { type: Number, default: 2.0 },
    requiredEducationLevel: { 
        type: String, 
        enum: ['O/L', 'A/L', 'Diploma', 'Degree', 'Master'], 
        default: 'A/L' 
    },
    intakeStatus: { 
        type: String, 
        enum: ['OPEN', 'CLOSED', 'UPCOMING'], 
        default: 'OPEN' 
    },
    intakeDate: { type: Date },
    applicationDeadline: { type: Date },
    nextIntakeDate: { type: Date },
    modules: [{ type: String }],
    history: [{
        updatedAt: { type: Date, default: Date.now },
        changes: { type: mongoose.Schema.Types.Mixed }
    }]
}, { 
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id ? ret._id.toString() : ret.id;
            ret.name = ret.name || ret.title;
            ret.title = ret.title || ret.name;
            ret.courseFee = ret.courseFee ?? ret.fees ?? ret.price;
            ret.fees = ret.fees ?? ret.courseFee ?? ret.price;
            ret.intakeDate = ret.intakeDate || ret.nextIntakeDate;
            ret.nextIntakeDate = ret.nextIntakeDate || ret.intakeDate;
            delete ret._id;
        }
    }
});

// Middleware to sync title/name, fees/courseFee on save
courseSchema.pre('save', function (next) {
    if (!this.title && this.name) this.title = this.name;
    if (!this.name && this.title) this.name = this.title;
    if (this.fees == null && this.courseFee != null) this.fees = this.courseFee;
    if (this.courseFee == null && this.fees != null) this.courseFee = this.fees;
    if (this.intakeDate && !this.nextIntakeDate) this.nextIntakeDate = this.intakeDate;
    if (this.nextIntakeDate && !this.intakeDate) this.intakeDate = this.nextIntakeDate;
    if (this.eligibility?.requiredStream && !this.streamReq) this.streamReq = this.eligibility.requiredStream;
    if (this.eligibility?.minimumPasses != null && this.minALPasses == null) this.minALPasses = this.eligibility.minimumPasses;
    next();
});

module.exports = mongoose.model('Course', courseSchema);