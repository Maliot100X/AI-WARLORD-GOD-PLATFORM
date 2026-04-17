# Deployment Guide

This guide covers deploying the AI Warlord God Platform to various environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Vercel Deployment](#vercel-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Production Deployment](#production-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Database Setup](#database-setup)
8. [SSL/HTTPS Configuration](#sslhttps-configuration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Scaling & Performance](#scaling--performance)

## Prerequisites

### System Requirements
- **Node.js**: 16.x or higher
- **MongoDB**: 4.4 or higher
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection

### Required Services
- **MongoDB**: For data persistence
- **API Keys**: GMGN, Bybit, GitHub tokens
- **Domain Name**: For production deployment
- **SSL Certificate**: For HTTPS (production)

### Development Tools
- **Git**: For version control
- **npm/yarn**: For package management
- **Docker**: (Optional) For containerized deployment

## Local Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd AI-WARLORD-GOD-PLATFORM
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install web dependencies
cd web && npm install && cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Database Setup
```bash
# Start MongoDB (if using local)
sudo systemctl start mongod

# Or connect to MongoDB Atlas
# Update MONGODB_URI in .env
```

### 5. Start Development Servers
```bash
# Terminal 1: Start API server
node api/server.js

# Terminal 2: Start web development server
cd web && npm run dev
```

### 6. Access Application
- Web Interface: http://localhost:3000
- API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Application
```bash
# Using deployment script
node scripts/deploy/vercel.js

# Or manual deployment
vercel --prod
```

### 4. Configure Environment Variables
```bash
# Set environment variables in Vercel dashboard
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add GMGN_API_KEY
vercel env add BYBIT_API_KEY
vercel env add BYBIT_SECRET
vercel env add GITHUB_TOKEN
```

### 5. Custom Domain
```bash
# Add custom domain
vercel domains add your-domain.com
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
# Dockerfile for API server
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "api/server.js"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ai-warlord
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://api:5000
    depends_on:
      - api

volumes:
  mongo-data:
```

### 3. Build and Run
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Deployment

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Application Deployment
```bash
# Create application user
sudo useradd -m -s /bin/bash aiwarlord

# Switch to application user
sudo su - aiwarlord

# Clone repository
git clone <repository-url> ai-warlord-god-platform
cd ai-warlord-god-platform

# Install dependencies
npm install --production
cd web && npm install --production && npm run build && cd ..

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ai-warlord-api',
    script: 'api/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Nginx Configuration
```nginx
# /etc/nginx/sites-available/ai-warlord
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Web application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ai-warlord /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/ai-warlord

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Keys
GMGN_API_KEY=your-gmgn-api-key
BYBIT_API_KEY=your-bybit-api-key
BYBIT_SECRET=your-bybit-secret
GITHUB_TOKEN=your-github-token

# URLs
CLIENT_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# Server
PORT=5000
NODE_ENV=production

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/ai-warlord/
```

### Environment-specific Configuration
Create different `.env` files for different environments:

```bash
# .env.development
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug

# .env.production
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info

# .env.test
NODE_ENV=test
DEBUG=true
LOG_LEVEL=debug
```

## Database Setup

### Local MongoDB
```bash
# Install MongoDB
sudo apt install mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Create database and user
mongo
> use ai-warlord
> db.createUser({
    user: "aiwarlord",
    pwd: "your-password",
    roles: [{ role: "readWrite", db: "ai-warlord" }]
  })
> exit

# Update connection string
MONGODB_URI=mongodb://aiwarlord:your-password@localhost:27017/ai-warlord
```

### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Update connection string:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-warlord?retryWrites=true&w=majority
```

### Database Indexes
Create indexes for better performance:
```javascript
// Create indexes in MongoDB shell
db.agents.createIndex({ "name": 1, "type": 1 })
db.apis.createIndex({ "name": 1, "status": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
db.skills.createIndex({ "name": 1, "category": 1 })
db.webhooks.createIndex({ "name": 1, "status": 1 })
```

## SSL/HTTPS Configuration

### Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Custom SSL Certificate
1. Purchase SSL certificate from provider
2. Upload certificate files to server
3. Update Nginx configuration:
```nginx
ssl_certificate /path/to/certificate.crt;
ssl_certificate_key /path/to/private.key;
ssl_trusted_certificate /path/to/chain.crt;
```

### SSL Configuration
```nginx
# SSL settings
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
```

## Monitoring & Logging

### Application Logging
```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-warlord-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart process
pm2 restart ai-warlord-api

# Update process
pm2 reload ai-warlord-api
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor system resources
htop
iotop
nethogs

# Monitor logs
sudo journalctl -u nginx -f
sudo journalctl -u mongod -f
```

### Health Checks
Create health check endpoint:
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      database: 'connected',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## Scaling & Performance

### Load Balancing
```nginx
# Load balancing configuration
upstream ai_warlord_api {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    location /api/ {
        proxy_pass http://ai_warlord_api;
        # ... other proxy settings
    }
}
```

### PM2 Cluster Mode
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ai-warlord-api',
    script: 'api/server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G'
  }]
}
```

### Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = await client.get(key);
    
    if (cachedResponse) {
      res.send(JSON.parse(cachedResponse));
      return;
    }
    
    res.sendResponse = res.send;
    res.send = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

### Database Optimization
```javascript
// Connection pooling
mongoose.connect(uri, {
  poolSize: 10,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Query optimization
const results = await Model.find({})
  .select('name email status')
  .limit(100)
  .sort({ createdAt: -1 })
  .lean()
  .exec();
```

### Performance Monitoring
```javascript
// Performance monitoring
const responseTime = require('response-time');
app.use(responseTime((req, res, time) => {
  logger.info({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: time
  });
}));
```

---

🔥 **DEPLOY WITH CONFIDENCE - YOUR AI WARLORD PLATFORM IS READY FOR PRODUCTION!** 🔥