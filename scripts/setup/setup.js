#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 AI WARLORD GOD PLATFORM - SETUP SCRIPT');
console.log('==========================================\n');

// Create logs directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '../logs'))) {
  fs.mkdirSync(path.join(__dirname, '../logs'), { recursive: true });
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  fs.writeFileSync(envPath, `# AI Warlord God Platform Environment Variables

# Database
MONGODB_URI=mongodb://localhost:27017/ai-warlord

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Keys (add your actual keys here)
GMGN_API_KEY=your-gmgn-api-key
BYBIT_API_KEY=your-bybit-api-key
BYBIT_SECRET=your-bybit-secret
GITHUB_TOKEN=your-github-token

# Client URL
CLIENT_URL=http://localhost:3000

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
`);
  console.log('✅ .env file created. Please update it with your actual API keys.\n');
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Install web dependencies
console.log('Installing web dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, '../web'),
    stdio: 'inherit'
  });
  console.log('✅ Web dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install web dependencies:', error.message);
  process.exit(1);
}

// Build web application
console.log('Building web application...');
try {
  execSync('npm run build', { 
    cwd: path.join(__dirname, '../web'),
    stdio: 'inherit'
  });
  console.log('✅ Web application built successfully.\n');
} catch (error) {
  console.error('❌ Failed to build web application:', error.message);
  process.exit(1);
}

// Ask if user wants to start the servers
rl.question('Do you want to start the servers now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Starting servers...');
    
    // Start API server
    const apiServer = require('./server');
    
    // Start web server (in a real setup, this would be a separate process)
    console.log('✅ API server started on port 5000');
    console.log('✅ Web build completed - serve with: npm run dev (in web directory)');
    console.log('\n🎯 Platform is ready!');
    console.log('   - API: http://localhost:5000');
    console.log('   - Web: http://localhost:3000 (run npm run dev in web directory)');
    console.log('   - Health Check: http://localhost:5000/health');
    
  } else {
    console.log('\n✅ Setup completed successfully!');
    console.log('To start the servers:');
    console.log('1. API Server: node api/server.js');
    console.log('2. Web Server: cd web && npm run dev');
  }
  
  rl.close();
});