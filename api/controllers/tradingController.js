const axios = require('axios');

class TradingController {
  async getGMGNSignals(req, res) {
    try {
      const GMGN_API_KEY = process.env.GMGN_API_KEY;
      const GMGN_API_URL = 'https://api.gmgn.ai/v1/signals';
      
      const response = await axios.get(GMGN_API_URL, {
        headers: {
          'Authorization': `Bearer ${GMGN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async executeBybitTrade(req, res) {
    try {
      const { symbol, side, quantity, price } = req.body;
      const BYBIT_API_KEY = process.env.BYBIT_API_KEY;
      const BYBIT_SECRET = process.env.BYBIT_SECRET;
      const BYBIT_API_URL = 'https://api.bybit.com/v5/order/create';

      const timestamp = Date.now();
      const signature = this._generateSignature(timestamp, BYBIT_SECRET);

      const tradeData = {
        category: 'spot',
        symbol,
        side,
        orderType: 'Limit',
        qty: quantity.toString(),
        price: price.toString(),
        timeInForce: 'GTC'
      };

      const response = await axios.post(BYBIT_API_URL, tradeData, {
        headers: {
          'X-BAPI-API-KEY': BYBIT_API_KEY,
          'X-BAPI-TIMESTAMP': timestamp,
          'X-BAPI-SIGN': signature,
          'Content-Type': 'application/json'
        }
      });

      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTradingStatus(req, res) {
    try {
      // Mock trading status - in production, this would query actual trading systems
      res.json({
        success: true,
        data: {
          status: 'active',
          activeTrades: 3,
          totalProfit: 1250.50,
          winRate: 0.68,
          lastUpdate: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTradingHistory(req, res) {
    try {
      // Mock trading history - in production, this would query actual database
      res.json({
        success: true,
        data: [
          {
            id: '1',
            symbol: 'BTCUSDT',
            side: 'buy',
            quantity: 0.001,
            price: 45000,
            status: 'filled',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            symbol: 'ETHUSDT',
            side: 'sell',
            quantity: 0.01,
            price: 3000,
            status: 'filled',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  _generateSignature(timestamp, secret) {
    // Simple signature generation - in production, use proper HMAC
    return require('crypto')
      .createHmac('sha256', secret)
      .update(timestamp.toString())
      .digest('hex');
  }
}

module.exports = new TradingController();