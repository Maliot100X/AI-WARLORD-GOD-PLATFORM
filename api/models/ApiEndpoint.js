const mongoose = require('mongoose');

const apiEndpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  sourceUrl: {
    type: String,
    required: true
  },
  endpoints: [{
    path: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    description: String,
    parameters: [{
      name: String,
      type: String,
      required: Boolean,
      description: String
    }],
    response: mongoose.Schema.Types.Mixed
  }],
  auth: {
    type: {
      type: String,
      enum: ['none', 'bearer', 'basic', 'api-key', 'oauth']
    },
    key: String,
    value: String
  },
  status: {
    type: String,
    enum: ['created', 'testing', 'active', 'error'],
    default: 'created'
  },
  lastTested: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ApiEndpoint', apiEndpointSchema);