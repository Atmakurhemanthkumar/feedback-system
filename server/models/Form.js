const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [{
    id: { type: String, required: true },
    type: { type: String, enum: ['text', 'radio', 'checkbox', 'dropdown', 'rating'], required: true },
    question: { type: String, required: true },
    options: { type: [String] },
    required: { type: Boolean, default: false }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  version: { type: Number, default: 1 }
});

module.exports = mongoose.model('Form', formSchema);
