#!/usr/bin/env node

const axios = require('axios');
const mongoose = require('mongoose');

console.log('💰 AI WARLORD GOD PLATFORM - TRADING BOT');
console.log('==========================================\n');

// Trading configuration
const config = {
  gmgn: {
    apiKey: process.env.GMGN_API_KEY,
    apiUrl: 'https://api.gmgn.ai/v1'
  },
  bybit: {
    apiKey: process.env.BYBIT_API_KEY,
    secret: process.env.BYBIT_SECRET,
    apiUrl: 'https://api.bybit.com'
  }
};

// Get GMGN signals
async function getGMGNSignals() {
  try {
    const response = await axios.get(`${config.gmgn.apiUrl}/signals`, {
      headers: {
        'Authorization': `Bearer ${config.gmgn.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ GMGN Signals retrieved:');
    response.data.signals.forEach((signal, index) => {
      console.log(`  ${index + 1}. ${signal.pair} - ${signal.signal} - Confidence: ${signal.confidence}%`);
    });

    return response.data.signals;
  } catch (error) {
    console.error('❌ Failed to get GMGN signals:', error.message);
    return [];
  }
}

// Execute trade on Bybit
async function executeBybitTrade(symbol, side, quantity, price) {
  try {
    const timestamp = Date.now();
    const signature = generateSignature(timestamp, config.bybit.secret);

    const tradeData = {
      category: 'spot',
      symbol,
      side,
      orderType: 'Limit',
      qty: quantity.toString(),
      price: price.toString(),
      timeInForce: 'GTC'
    };

    const response = await axios.post(`${config.bybit.apiUrl}/v5/order/create`, tradeData, {
      headers: {
        'X-BAPI-API-KEY': config.bybit.apiKey,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-SIGN': signature,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Trade executed successfully:');
    console.log(`  Order ID: ${response.data.result.orderId}`);
    console.log(`  Symbol: ${symbol}`);
    console.log(`  Side: ${side}`);
    console.log(`  Quantity: ${quantity}`);
    console.log(`  Price: ${price}`);

    return response.data.result;
  } catch (error) {
    console.error('❌ Failed to execute trade:', error.message);
    throw error;
  }
}

// Generate signature for Bybit API
function generateSignature(timestamp, secret) {
  const crypto = require('crypto');
  return crypto.createHmac('sha256', secret).update(timestamp.toString()).digest('hex');
}

// Auto-trading function
async function autoTrade() {
  console.log('🚀 Starting auto-trading bot...\n');

  // Get GMGN signals
  const signals = await getGMGNSignals();
  
  if (signals.length === 0) {
    console.log('❌ No signals available. Exiting.');
    return;
  }

  // Filter high-confidence signals
  const highConfidenceSignals = signals.filter(signal => signal.confidence >= 70);
  
  if (highConfidenceSignals.length === 0) {
    console.log('❌ No high-confidence signals found. Exiting.');
    return;
  }

  console.log(`\n🎯 Found ${highConfidenceSignals.length} high-confidence signals:`);
  
  // Execute trades for high-confidence signals
  for (const signal of highConfidenceSignals) {
    console.log(`\n📊 Processing signal for ${signal.pair}...`);
    
    try {
      // Parse signal data
      const [baseCurrency, quoteCurrency] = signal.pair.split('/');
      const symbol = `${baseCurrency}${quoteCurrency}`;
      const side = signal.signal.toLowerCase() === 'buy' ? 'Buy' : 'Sell';
      
      // Calculate trade parameters (simplified)
      const quantity = '0.001'; // Fixed quantity for demo
      const currentPrice = signal.currentPrice || 50000; // Default BTC price
      
      // Execute trade
      const result = await executeBybitTrade(symbol, side, quantity, currentPrice);
      
      console.log(`✅ Trade executed for ${signal.pair}`);
      
      // Wait between trades to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.error(`❌ Failed to execute trade for ${signal.pair}:`, error.message);
    }
  }
  
  console.log('\n🎉 Auto-trading session completed!');
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run trading -- [signals|trade|auto] [args...]');
    process.exit(1);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'signals':
      await getGMGNSignals();
      break;
      
    case 'trade':
      if (args.length < 5) {
        console.error('❌ Usage: npm run trading -- trade <symbol> <side> <quantity> <price>');
        process.exit(1);
      }
      
      const symbol = args[1];
      const side = args[2];
      const quantity = args[3];
      const price = args[4];
      
      await executeBybitTrade(symbol, side, quantity, price);
      break;
      
    case 'auto':
      await autoTrade();
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(console.error);