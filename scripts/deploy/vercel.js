#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AI WARLORD GOD PLATFORM - DEPLOYMENT SCRIPT');
console.log('==============================================\n');

// Check if we're in the right directory
const packageJsonPath = path.join(__dirname, '../../package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run this script from the scripts/deploy directory.');
  process.exit(1);
}

// Build the application
console.log('Building application...');
try {
  execSync('npm run build', { 
    cwd: path.join(__dirname, '../..'),
    stdio: 'inherit'
  });
  console.log('✅ Application built successfully.\n');
} catch (error) {
  console.error('❌ Failed to build application:', error.message);
  process.exit(1);
}

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed.\n');
} catch (error) {
  console.log('Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully.\n');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI:', installError.message);
    process.exit(1);
  }
}

// Create vercel.json if it doesn't exist
const vercelConfigPath = path.join(__dirname, '../../vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  console.log('Creating vercel.json configuration...');
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "web/package.json",
        "use": "@vercel/next"
      },
      {
        "src": "api/server.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/api/server.js"
      },
      {
        "src": "/(.*)",
        "dest": "/web/$1"
      }
    ],
    "env": {
      "NODE_ENV": "production"
    }
  };
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json created.\n');
}

// Deploy to Vercel
console.log('Deploying to Vercel...');
try {
  execSync('vercel --prod', { 
    cwd: path.join(__dirname, '../..'),
    stdio: 'inherit'
  });
  console.log('✅ Deployment completed successfully!\n');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

console.log('🎉 AI WARLORD GOD PLATFORM deployed successfully!');
console.log('Check your Vercel dashboard for the deployment URL.');