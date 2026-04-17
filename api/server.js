const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const winston = require('winston');

// Import routes
const agentRoutes = require('./routes/agents');
const tradingRoutes = require('./routes/trading');
const apiFactoryRoutes = require('./routes/api-factory');
const githubRoutes = require('./routes/github');
const vpsRoutes = require('./routes/vps');
const skillsRoutes = require('./routes/skills');
const authRoutes = require('./routes/auth');
const webhookRoutes = require('./routes/webhooks');
const systemRoutes = require('./routes/system');

// Import middleware
const { authenticateToken, requireAdmin } = require('./middleware/auth');
const { generalLimiter } = require('./middleware/rateLimit');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-warlord', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('Connected to MongoDB');
}).catch((error) => {
  logger.error('MongoDB connection error:', error);
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Routes
app.use('/api/agents', authenticateToken, agentRoutes);
app.use('/api/trading', authenticateToken, tradingRoutes);
app.use('/api/api-factory', authenticateToken, apiFactoryRoutes);
app.use('/api/github', authenticateToken, githubRoutes);
app.use('/api/vps', authenticateToken, vpsRoutes);
app.use('/api/skills', authenticateToken, skillsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', authenticateToken, webhookRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    logger.info(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

// Export socket.io instance for use in controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`API Server running on port ${PORT}`);
});

module.exports = { app, server, io };