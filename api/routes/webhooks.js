const express = require('express');
const router = express.Router();
const { 
  createWebhook, 
  handleWebhook, 
  getWebhooks, 
  deleteWebhook 
} = require('../controllers/webhookController');

// Create webhook
router.post('/', createWebhook);

// Handle webhook
router.post('/handle/:webhookId', handleWebhook);

// Get all webhooks
router.get('/', getWebhooks);

// Delete webhook
router.delete('/:webhookId', deleteWebhook);

module.exports = router;