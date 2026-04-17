const express = require('express');
const router = express.Router();
const { 
  deployToVPS, 
  getVPSStatus, 
  getVPSList, 
  deleteVPS 
} = require('../controllers/vpsController');

// Deploy to VPS
router.post('/deploy', deployToVPS);

// Get VPS status
router.get('/:vpsId/status', getVPSStatus);

// Get all VPS instances
router.get('/', getVPSList);

// Delete VPS instance
router.delete('/:vpsId', deleteVPS);

module.exports = router;