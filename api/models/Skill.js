const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  status: {
    type: String,
    enum: ['installing', 'installed', 'error', 'uninstalled'],
    default: 'installing'
  },
  installedAt: {
    type: Date
  },
  dependencies: [{
    name: String,
    version: String
  }],
  config: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('Skill', skillSchema);