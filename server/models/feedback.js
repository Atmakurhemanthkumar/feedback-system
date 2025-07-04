const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  responses: [{
    questionId: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
