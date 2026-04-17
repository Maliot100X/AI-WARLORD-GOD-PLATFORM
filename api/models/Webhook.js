const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  events: [{
    type: String
  }],
  secret: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'active'
  },
  totalCalls: {
    type: Number,
    default: 0
  },
  successfulCalls: {
    type: Number,
    default: 0
  },
  failedCalls: {
    type: Number,
    default: 0
  },
  lastCalled: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Webhook', webhookSchema);