const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  recipients: { type: [String], required: true },
  status: { type: String, enum: ['Success', 'Failed'], required: true },
  errorLogs: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Email', emailSchema);
