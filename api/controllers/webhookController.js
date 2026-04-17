const { Webhook } = require('../models/Webhook');
const crypto = require('crypto');

class WebhookController {
  async createWebhook(req, res) {
    try {
      const { name, url, events, secret } = req.body;
      
      // Generate webhook secret if not provided
      const webhookSecret = secret || crypto.randomBytes(32).toString('hex');
      
      const webhook = new Webhook({
        name,
        url,
        events: events || ['*'],
        secret: webhookSecret,
        status: 'active',
        createdAt: new Date()
      });

      await webhook.save();
      
      res.status(201).json({
        success: true,
        data: {
          ...webhook.toObject(),
          secret: webhookSecret // Only show secret on creation
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async handleWebhook(req, res) {
    try {
      const { webhookId } = req.params;
      
      const webhook = await Webhook.findById(webhookId);
      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }

      if (webhook.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: 'Webhook is not active'
        });
      }

      // Verify signature if secret is set
      if (webhook.secret) {
        const signature = req.headers['x-webhook-signature'];
        if (!signature || !this._verifySignature(req.body, webhook.secret, signature)) {
          return res.status(401).json({
            success: false,
            error: 'Invalid signature'
          });
        }
      }

      // Process webhook event
      const event = req.headers['x-webhook-event'] || 'generic';
      const payload = req.body;

      // Send to webhook URL
      const response = await this._sendToWebhook(webhook.url, event, payload);
      
      // Update webhook stats
      webhook.totalCalls += 1;
      webhook.lastCalled = new Date();
      if (response.success) {
        webhook.successfulCalls += 1;
      }
      await webhook.save();

      res.json({
        success: true,
        data: {
          webhookId: webhook._id,
          event,
          processed: true,
          response: response.data
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getWebhooks(req, res) {
    try {
      const webhooks = await Webhook.find({});
      
      res.json({
        success: true,
        data: webhooks.map(webhook => ({
          ...webhook.toObject(),
          secret: undefined // Don't expose secrets in list
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteWebhook(req, res) {
    try {
      const { webhookId } = req.params;
      
      const webhook = await Webhook.findByIdAndDelete(webhookId);
      if (!webhook) {
        return res.status(404).json({
          success: false,
          error: 'Webhook not found'
        });
      }

      res.json({
        success: true,
        message: 'Webhook deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  _verifySignature(payload, secret, signature) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return digest === signature;
  }

  async _sendToWebhook(url, event, payload) {
    const axios = require('axios');
    
    try {
      const response = await axios.post(url, {
        event,
        payload,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AI-Warlord-Webhook/1.0'
        },
        timeout: 5000 // 5 second timeout
      });

      return {
        success: true,
        data: {
          status: response.status,
          statusText: response.statusText
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {
          error: error.message
        }
      };
    }
  }
}

module.exports = new WebhookController();