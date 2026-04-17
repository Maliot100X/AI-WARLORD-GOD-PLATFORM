const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// System status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    services: {
      agents: 'active',
      trading: 'active',
      apiFactory: 'active',
      github: 'active',
      vps: 'active',
      skills: 'active',
      webhooks: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;