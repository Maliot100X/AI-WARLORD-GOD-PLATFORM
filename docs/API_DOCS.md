# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All API endpoints (except auth) require JWT authentication.

### Header
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Authentication

#### POST /auth/auth
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

#### GET /auth/profile
Get user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PUT /auth/profile
Update user profile.

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "newemail@example.com",
    "name": "New Name",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Agents

#### POST /agents
Create a new agent.

**Request Body:**
```json
{
  "name": "My Trading Agent",
  "type": "trader",
  "config": {
    "strategy": "momentum",
    "riskLevel": "medium"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "agent_id",
    "name": "My Trading Agent",
    "type": "trader",
    "config": {
      "strategy": "momentum",
      "riskLevel": "medium"
    },
    "status": "created",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "stats": {
      "totalRuns": 0,
      "successfulRuns": 0,
      "failedRuns": 0
    }
  }
}
```

#### GET /agents
Get all agents.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "agent_id",
      "name": "My Trading Agent",
      "type": "trader",
      "status": "running",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "stats": {
        "totalRuns": 10,
        "successfulRuns": 8,
        "failedRuns": 2
      }
    }
  ]
}
```

#### POST /agents/:agentId/control
Control an agent.

**Request Body:**
```json
{
  "action": "start_trading",
  "params": {
    "symbol": "BTCUSDT",
    "quantity": "0.001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "action": "start_trading",
    "success": true,
    "status": "running",
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /agents/:agentId
Delete an agent.

**Response:**
```json
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

### Trading

#### GET /trading/gmgn-signals
Get GMGN trading signals.

**Response:**
```json
{
  "success": true,
  "data": {
    "signals": [
      {
        "pair": "BTC/USDT",
        "signal": "BUY",
        "confidence": 85,
        "currentPrice": 45000,
        "timestamp": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### POST /trading/bybit-trade
Execute trade on Bybit.

**Request Body:**
```json
{
  "symbol": "BTCUSDT",
  "side": "Buy",
  "quantity": "0.001",
  "price": "45000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "12345678",
    "symbol": "BTCUSDT",
    "side": "Buy",
    "quantity": "0.001",
    "price": "45000",
    "status": "FILLED"
  }
}
```

#### GET /trading/status
Get trading status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active",
    "activeTrades": 3,
    "totalProfit": 1250.50,
    "winRate": 0.68,
    "lastUpdate": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /trading/history
Get trading history.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "symbol": "BTCUSDT",
      "side": "buy",
      "quantity": "0.001",
      "price": 45000,
      "status": "filled",
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### API Factory

#### POST /api-factory/create
Create API from URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "name": "Example API",
  "description": "API created from example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "api_id",
    "name": "Example API",
    "description": "API created from example.com",
    "sourceUrl": "https://example.com",
    "endpoints": [
      {
        "path": "/",
        "method": "GET",
        "description": "Root endpoint"
      }
    ],
    "auth": {
      "type": "none"
    },
    "status": "created",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /api-factory/:apiId/status
Get API status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active",
    "endpoints": [
      {
        "path": "/",
        "method": "GET",
        "description": "Root endpoint"
      }
    ],
    "lastTested": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /api-factory/:apiId/test
Test API endpoint.

**Request Body:**
```json
{
  "endpoint": "https://example.com/api",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": 200,
    "statusText": "OK",
    "headers": {
      "content-type": "application/json"
    },
    "data": {
      "message": "Hello World"
    },
    "responseTime": "150ms"
  }
}
```

#### DELETE /api-factory/:apiId
Delete API.

**Response:**
```json
{
  "success": true,
  "message": "API deleted successfully"
}
```

### GitHub

#### POST /github/analyze
Analyze repository.

**Request Body:**
```json
{
  "owner": "username",
  "repo": "repository-name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "repo": {
      "name": "repository-name",
      "full_name": "username/repository-name",
      "description": "Repository description",
      "stargazers_count": 100,
      "open_issues_count": 5
    },
    "issues": {
      "total": 5,
      "bugs": 2,
      "features": 3
    },
    "pullRequests": {
      "total": 3,
      "pending": 3
    },
    "recommendations": [
      "Consider addressing open issues to improve code quality"
    ]
  }
}
```

#### POST /github/pr
Create pull request.

**Request Body:**
```json
{
  "owner": "username",
  "repo": "repository-name",
  "title": "Feature: Add new functionality",
  "body": "This PR adds new functionality to the repository.",
  "head": "feature-branch",
  "base": "main"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "number": 123,
    "title": "Feature: Add new functionality",
    "state": "open",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /github/issue
Create issue.

**Request Body:**
```json
{
  "owner": "username",
  "repo": "repository-name",
  "title": "Bug: Something is broken",
  "body": "Describe the bug in detail.",
  "labels": ["bug"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "number": 456,
    "title": "Bug: Something is broken",
    "state": "open",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /github/:owner/:repo/status
Get repository status.

**Response:**
```json
{
  "success": true,
  "data": {
    "repository": {
      "name": "repository-name",
      "full_name": "username/repository-name",
      "description": "Repository description"
    },
    "branches": 3,
    "contributors": 5,
    "lastUpdated": "2023-01-01T00:00:00.000Z"
  }
}
```

### VPS

#### POST /vps/deploy
Deploy to VPS.

**Request Body:**
```json
{
  "host": "192.168.1.100",
  "username": "root",
  "password": "password",
  "command": "npm start"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stdout": "Server started on port 3000",
    "stderr": "",
    "code": 0
  }
}
```

#### GET /vps/:vpsId/status
Get VPS status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "vps-1",
    "status": "running",
    "cpu": 45.2,
    "memory": 67.8,
    "disk": 34.5,
    "uptime": "15 days, 3 hours",
    "lastUpdate": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /vps
Get all VPS instances.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "vps-1",
      "name": "US-East-1",
      "location": "New York",
      "status": "running",
      "ip": "192.168.1.100"
    }
  ]
}
```

#### DELETE /vps/:vpsId
Delete VPS instance.

**Response:**
```json
{
  "success": true,
  "message": "VPS vps-1 deleted successfully"
}
```

### Skills

#### GET /skills
Get all skills.

**Response:**
```json
{
  "success": true,
  "data": {
    "database": [
      {
        "_id": "skill_id",
        "name": "trading-bot",
        "category": "trading",
        "status": "installed",
        "installedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "filesystem": [
      {
        "name": "github-bot",
        "category": "development",
        "path": "/path/to/skill"
      }
    ]
  }
}
```

#### POST /skills/install
Install skill.

**Request Body:**
```json
{
  "name": "new-skill",
  "url": "https://github.com/example/skill",
  "category": "development"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "skill_id",
    "name": "new-skill",
    "url": "https://github.com/example/skill",
    "category": "development",
    "status": "installed",
    "installedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /skills/:skillName/status
Get skill status.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "trading-bot",
    "status": "installed",
    "category": "trading",
    "installedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### DELETE /skills/:skillName
Uninstall skill.

**Response:**
```json
{
  "success": true,
  "message": "Skill trading-bot uninstalled successfully"
}
```

### Webhooks

#### POST /webhooks
Create webhook.

**Request Body:**
```json
{
  "name": "My Webhook",
  "url": "https://example.com/webhook",
  "events": ["agent.created", "trade.executed"],
  "secret": "webhook-secret"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "webhook_id",
    "name": "My Webhook",
    "url": "https://example.com/webhook",
    "events": ["agent.created", "trade.executed"],
    "status": "active",
    "totalCalls": 0,
    "successfulCalls": 0,
    "failedCalls": 0,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "secret": "webhook-secret"
  }
}
```

#### POST /webhooks/handle/:webhookId
Handle webhook (called by external services).

**Response:**
```json
{
  "success": true,
  "data": {
    "webhookId": "webhook_id",
    "event": "agent.created",
    "processed": true,
    "response": {
      "status": 200,
      "statusText": "OK"
    }
  }
}
```

#### GET /webhooks
Get all webhooks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "webhook_id",
      "name": "My Webhook",
      "url": "https://example.com/webhook",
      "events": ["agent.created", "trade.executed"],
      "status": "active",
      "totalCalls": 10,
      "successfulCalls": 9,
      "failedCalls": 1,
      "lastCalled": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### DELETE /webhooks/:webhookId
Delete webhook.

**Response:**
```json
{
  "success": true,
  "message": "Webhook deleted successfully"
}
```

### System

#### GET /system/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### GET /system/status
System status endpoint.

**Response:**
```json
{
  "status": "operational",
  "services": {
    "agents": "active",
    "trading": "active",
    "apiFactory": "active",
    "github": "active",
    "vps": "active",
    "skills": "active",
    "webhooks": "active"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

### Common Error Codes
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General Limit**: 100 requests per 15 minutes per IP
- **API Creation**: 5 requests per hour per IP
- **Agent Creation**: 10 requests per hour per IP
- **Trading**: 10 requests per minute per IP

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```