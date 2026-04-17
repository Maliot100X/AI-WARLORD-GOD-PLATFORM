const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const winston = require('winston')
require('dotenv').config()

// Initialize Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "ws://localhost:3001", "wss://*"],
    },
  },
}))
app.use(compression())
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/api', limiter)

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  next()
})

// API Routes
app.use('/api/agents', require('./routes/agents'))
app.use('/api/trading', require('./routes/trading'))
app.use('/api/api-factory', require('./routes/api-factory'))
app.use('/api/github', require('./routes/github'))
app.use('/api/vps', require('./routes/vps'))
app.use('/api/skills', require('./routes/skills'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/webhooks', require('./routes/webhooks'))
app.use('/api/system', require('./routes/system'))

// Health check with detailed status
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'running',
      websocket: 'running',
      database: 'connected',
      redis: 'connected',
      agents: 'operational',
      trading: 'operational',
      api_factory: 'operational',
      github: 'operational',
      vps: 'operational'
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    },
    environment: process.env.NODE_ENV || 'development'
  }
  res.json(health)
})

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('New WebSocket connection:', socket.id)
  
  // Join rooms based on client type
  socket.on('join:agent', (agentId) => {
    socket.join(`agent:${agentId}`)
    logger.info(`Socket ${socket.id} joined agent:${agentId}`)
  })
  
  socket.on('join:trading', (pair) => {
    socket.join(`trading:${pair}`)
    logger.info(`Socket ${socket.id} joined trading:${pair}`)
  })
  
  socket.on('join:mission', (missionId) => {
    socket.join(`mission:${missionId}`)
    logger.info(`Socket ${socket.id} joined mission:${missionId}`)
  })
  
  // Real-time updates
  socket.on('agent:status', (data) => {
    io.to(`agent:${data.agentId}`).emit('agent:status:update', data)
  })
  
  socket.on('trading:signal', (data) => {
    io.to(`trading:${data.pair}`).emit('trading:signal:update', data)
  })
  
  socket.on('mission:progress', (data) => {
    io.to(`mission:${data.missionId}`).emit('mission:progress:update', data)
  })
  
  socket.on('disconnect', () => {
    logger.info('WebSocket disconnected:', socket.id)
  })
})

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  logger.info(`🚀 WARLORD API server running on port ${PORT}`)
  logger.info(`🔗 WebSocket server ready at ws://localhost:${PORT}`)
  logger.info(`🌐 Health check: http://localhost:${PORT}/health`)
  logger.info(`⚡️ Environment: ${process.env.NODE_ENV || 'development'}`)
})

module.exports = { app, io, server }