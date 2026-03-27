const mongoose = require('mongoose');
const { Schema } = mongoose;

const workshopSchema = new Schema({
  title: { type: String },
  topic: { type: String },
  speaker: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String, default: 'Main Auditorium' },
  venue: { type: String },
  description: { type: String },
  maxCapacity: { type: Number, default: 50 },
  capacity: { type: Number },
  status: { type: String, default: 'active' },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  image: { type: String }
}, { timestamps: true });

// Customize toJSON to return both `id` and `_id`
workshopSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // ret.id is automatically created from _id by virtuals: true
    }
});

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;

