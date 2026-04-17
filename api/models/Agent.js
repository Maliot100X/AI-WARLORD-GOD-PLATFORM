const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['scraper', 'trader', 'coder', 'analyzer', 'general']
  },
  config: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['created', 'running', 'stopped', 'error'],
    default: 'created'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastRun: {
    type: Date
  },
  stats: {
    totalRuns: {
      type: Number,
      default: 0
    },
    successfulRuns: {
      type: Number,
      default: 0
    },
    failedRuns: {
      type: Number,
      default: 0
    }
  }
});

agentSchema.methods.executeAction = async function(action, params) {
  // Mock execution - in production, this would actually execute the agent
  this.stats.totalRuns += 1;
  this.lastRun = new Date();
  
  // Simulate random success/failure
  const success = Math.random() > 0.2; // 80% success rate
  
  if (success) {
    this.stats.successfulRuns += 1;
    this.status = 'running';
  } else {
    this.stats.failedRuns += 1;
    this.status = 'error';
  }
  
  await this.save();
  
  return {
    action,
    success,
    status: this.status,
    timestamp: this.lastRun
  };
};

module.exports = mongoose.model('Agent', agentSchema);