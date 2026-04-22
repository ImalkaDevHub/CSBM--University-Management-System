const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: { type: String },
  studentEmail: { type: String },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentType: {
    type: String,
    enum: ['course', 'workshop'],
    required: true
  },
  referenceId: {
    type: Schema.Types.ObjectId
  },
  itemName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  status: {
    type: String,
    enum: [
      'pending',
      'completed',
      'failed',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  payherePaymentId: { type: String },
  paymentMethod: { type: String },
  paidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
