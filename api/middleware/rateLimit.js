const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: {
      success: false,
      error: message || 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// General rate limiter
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later'
);

// API creation rate limiter
const apiCreationLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5, // limit each IP to 5 API creations per hour
  'Too many API creation attempts, please try again later'
);

// Agent creation rate limiter
const agentCreationLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // limit each IP to 10 agent creations per hour
  'Too many agent creation attempts, please try again later'
);

// Trading rate limiter
const tradingLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // limit each IP to 10 trades per minute
  'Too many trading requests, please try again later'
);

module.exports = {
  generalLimiter,
  apiCreationLimiter,
  agentCreationLimiter,
  tradingLimiter
};