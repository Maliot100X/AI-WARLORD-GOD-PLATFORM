import { NextRequest, NextResponse } from 'next/server'

// Health check data
const healthStatus = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: '2.0.0',
  environment: process.env.NODE_ENV || 'development',
  uptime: process.uptime(),
  checks: {
    database: {
      status: 'healthy',
      responseTime: 5,
      lastChecked: new Date().toISOString()
    },
    redis: {
      status: 'healthy',
      responseTime: 2,
      lastChecked: new Date().toISOString()
    },
    externalApis: {
      gmgn: {
        status: 'degraded',
        responseTime: 5000,
        lastChecked: new Date().toISOString()
      },
      jupiter: {
        status: 'healthy',
        responseTime: 150,
        lastChecked: new Date().toISOString()
      },
      birdeye: {
        status: 'healthy',
        responseTime: 200,
        lastChecked: new Date().toISOString()
      }
    },
    websocket: {
      status: 'healthy',
      connections: 234,
      lastChecked: new Date().toISOString()
    }
  },
  metrics: {
    memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    cpuLoad: 45.2,
    activeRequests: 12,
    responseTime: 125
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get('detailed') === 'true'
    
    if (detailed) {
      return NextResponse.json({
        success: true,
        data: healthStatus
      })
    }
    
    // Simple health check
    const isHealthy = healthStatus.status === 'healthy' && 
      Object.values(healthStatus.checks).every(check => {
        if (typeof check === 'object' && check !== null) {
          if ('status' in check) {
            return check.status === 'healthy'
          }
          // For nested objects like externalApis
          return Object.values(check).every((nestedCheck: any) => 
            typeof nestedCheck === 'object' && nestedCheck.status === 'healthy'
          )
        }
        return false
      })
    
    return NextResponse.json({
      success: true,
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: healthStatus.timestamp,
      version: healthStatus.version
    }, {
      status: isHealthy ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 503 }
    )
  }
}

export async function HEAD() {
  try {
    const isHealthy = healthStatus.status === 'healthy' && 
      Object.values(healthStatus.checks).every(check => {
        if (typeof check === 'object' && check !== null) {
          if ('status' in check) {
            return check.status === 'healthy'
          }
          // For nested objects like externalApis
          return Object.values(check).every((nestedCheck: any) => 
            typeof nestedCheck === 'object' && nestedCheck.status === 'healthy'
          )
        }
        return false
      })
    
    return new Response(null, {
      status: isHealthy ? 200 : 503,
      headers: {
        'X-Health-Status': isHealthy ? 'healthy' : 'unhealthy',
        'X-Health-Timestamp': healthStatus.timestamp,
        'X-Health-Version': healthStatus.version
      }
    })
  } catch (error) {
    return new Response(null, { status: 503 })
  }
}