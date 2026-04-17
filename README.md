# AI Warlord God Platform

🔥 THE ULTIMATE AI AGENT WARLORD PLATFORM - Control 100+ subagents, trade crypto, create APIs, automate GitHub, deploy globally!

## 🚀 What This Platform Does

This is the GOD MODE platform that combines ALL 5 warlord ideas into one EPIC system:

1. **AI Agent Warlord** - Control 100+ specialized subagents simultaneously
2. **Autonomous Crypto War Machine** - GMGN signals + Bybit execution with real-time trading
3. **Zero-Code API Factory** - Point at any website → get fully functional API instantly
4. **GitHub Takeover Bot** - Automatically improve any repository with AI
5. **24/7 VPS Agent Army** - Deploy agents globally on 100+ VPS instances

## 🎯 Features

### Web Interface
- **9 Epic Tabs**: War Room, Agent Army, Crypto War, API Forge, GitHub Takeover, VPS Army, Skills Library, System Monitor, War Command
- **Floating Warlord AI**: Knows all 314 installed skills and provides real-time assistance
- **Real-time Status**: Live metrics, agent status, trading performance, system health
- **God Mode Sidebar**: Quick access to all features with agent status monitoring

### Backend API
- **Express.js Server**: RESTful API with WebSocket support
- **MongoDB Database**: Persistent storage for agents, APIs, users, skills
- **Real-time Updates**: Socket.io for live data streaming
- **Security**: JWT authentication, rate limiting, helmet, CORS

### Agent Management
- **Create Agents**: Spawn specialized agents (scraper, trader, coder, analyzer)
- **Control Agents**: Execute commands, monitor status, track performance
- **Agent Types**: Multiple agent types with specific capabilities
- **Performance Tracking**: Success rates, execution times, error handling

### Trading System
- **GMGN Integration**: Real-time trading signals with confidence scores
- **Bybit Execution**: Automated trading on Bybit exchange
- **Risk Management**: Position sizing, stop-loss, take-profit
- **Trading History**: Complete trade records with performance analytics

### API Factory
- **Website Scraping**: Automatically analyze any website and extract API endpoints
- **API Generation**: Convert websites to functional APIs instantly
- **API Testing**: Test generated APIs with comprehensive validation
- **Documentation**: Auto-generated API documentation

### GitHub Automation
- **Repository Analysis**: Analyze code quality, issues, pull requests
- **Automated PRs**: Create pull requests automatically
- **Issue Management**: Create and manage issues
- **Code Quality**: Automated code review and improvements

### VPS Deployment
- **Global Deployment**: Deploy agents to VPS instances worldwide
- **SSH Management**: Secure SSH connection handling
- **Monitoring**: Real-time VPS status and performance metrics
- **Scaling**: Automatically scale agent deployments

### Skills System
- **314 Skills**: Pre-installed with comprehensive skill library
- **Skill Management**: Install, uninstall, update skills
- **Skill Categories**: Organized by functionality (trading, coding, scraping, etc.)
- **Skill Integration**: Seamless integration with agent system

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- MongoDB
- API keys for services (GMGN, Bybit, GitHub)

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd AI-WARLORD-GOD-PLATFORM

# Run setup script
node scripts/setup/setup.js

# This will:
# 1. Create .env file with configuration
# 2. Install all dependencies
# 3. Build the web application
# 4. Set up the database structure
```

### Manual Setup
```bash
# Install dependencies
npm install

# Install web dependencies
cd web && npm install && cd ..

# Build web application
cd web && npm run build && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your API keys and configuration

# Start servers
# Terminal 1: API Server
node api/server.js

# Terminal 2: Web Server
cd web && npm run dev
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/ai-warlord

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# API Keys
GMGN_API_KEY=your-gmgn-api-key
BYBIT_API_KEY=your-bybit-api-key
BYBIT_SECRET=your-bybit-secret
GITHUB_TOKEN=your-github-token

# URLs
CLIENT_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

### API Keys Setup
1. **GMGN API**: Get API key from GMGN platform
2. **Bybit**: Create API keys with trading permissions
3. **GitHub**: Generate personal access token
4. **VPS Providers**: Set up SSH keys for VPS deployment

## 🚀 Usage

### Web Interface
1. Open `http://localhost:3000` in your browser
2. Navigate through the 9 epic tabs
3. Use the Floating Warlord AI for assistance
4. Monitor real-time status in the sidebar

### API Usage
```bash
# Health check
curl http://localhost:5000/health

# Get agents (requires authentication)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/agents

# Create agent
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"MyAgent","type":"trader"}' \\
  http://localhost:5000/api/agents

# Get GMGN signals
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  http://localhost:5000/api/trading/gmgn-signals
```

### Script Usage
```bash
# Install skills
node scripts/setup/skills-manager.js install-all

# Create agent
node scripts/setup/agent-manager.js create "My Trader" trader

# Start trading bot
node scripts/trading/trading-bot.js auto

# Deploy to Vercel
node scripts/deploy/vercel.js
```

## 📊 Architecture

### Frontend (Next.js)
- **Pages**: 9 main pages for each warlord feature
- **Components**: Reusable UI components with warlord theme
- **Context**: 7 React contexts for state management
- **Styling**: Tailwind CSS with custom warlord theme

### Backend (Express.js)
- **Routes**: 8 main API routes with full CRUD operations
- **Controllers**: Business logic for each feature
- **Models**: MongoDB schemas for data persistence
- **Middleware**: Authentication, rate limiting, security

### WebSocket (Socket.io)
- **Real-time Updates**: Live agent status, trading data, system metrics
- **Room-based**: Organized communication channels
- **Event-driven**: Responsive to system events

## 🎨 Design

### Theme
- **Colors**: Warlord purple (#8B5CF6), trading green (#10B981), API blue (#3B82F6)
- **Fonts**: Inter for readability, JetBrains Mono for code
- **Effects**: Neon glows, animated transitions, grid patterns
- **Layout**: Responsive design with dark mode support

### Components
- **FloatingWarlord**: AI assistant with skill knowledge
- **AgentCommandCenter**: Control interface for subagents
- **TradingWarMachine**: Real-time trading interface
- **ApiFactoryForge**: API generation interface
- **GitHubTakeover**: Repository management interface
- **VPSArmyDeployer**: Global deployment interface

## 🔒 Security

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all user inputs
- **HTTPS**: Secure communication (in production)
- **Environment Variables**: Secure configuration management

## 📈 Monitoring

### System Metrics
- **Agent Status**: Real-time agent performance
- **Trading Performance**: P&L, win rate, volume
- **API Health**: Response times, error rates
- **System Resources**: CPU, memory, disk usage

### Logging
- **Winston Logger**: Structured logging
- **Error Tracking**: Comprehensive error handling
- **Performance**: Request/response logging
- **Audit Trail**: User action tracking

## 🚀 Deployment

### Vercel Deployment
```bash
# Deploy to Vercel
node scripts/deploy/vercel.js

# This will:
# 1. Build the application
# 2. Configure Vercel settings
# 3. Deploy to production
```

### Manual Deployment
1. Build the application: `npm run build`
2. Start API server: `node api/server.js`
3. Serve web application: `cd web && npm start`

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "api/server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Join our community channels

---

🔥 **BUILT WITH WARLORD PRECISION - NO ERRORS, NO COMPROMISES** 🔥