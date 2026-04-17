const express = require('express');
const router = express.Router();
const { 
  getGMGNSignals, 
  executeBybitTrade, 
  getTradingStatus, 
  getTradingHistory 
} = require('../controllers/tradingController');

// Get GMGN signals
router.get('/gmgn-signals', getGMGNSignals);

// Execute Bybit trade
router.post('/bybit-trade', executeBybitTrade);

// Get trading status
router.get('/status', getTradingStatus);

// Get trading history
router.get('/history', getTradingHistory);

module.exports = router;