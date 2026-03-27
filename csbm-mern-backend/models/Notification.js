const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: If specific to a user
  email: { type: String }, // For convenience, if sending to specific email
  type: { type: String, required: true }, // e.g., 'incomplete-reminder', 'approval', 'general-notice'
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  status: { type: String, default: 'sent' }, // sent, failed
  createdBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
