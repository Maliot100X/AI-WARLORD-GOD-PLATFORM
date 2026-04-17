const express = require('express');
const router = express.Router();
const { 
  createApiFromUrl, 
  getApiStatus, 
  testApi, 
  deleteApi 
} = require('../controllers/apiFactoryController');

// Create API from URL
router.post('/create', createApiFromUrl);

// Get API status
router.get('/:apiId/status', getApiStatus);

// Test API
router.post('/:apiId/test', testApi);

// Delete API
router.delete('/:apiId', deleteApi);

module.exports = router;