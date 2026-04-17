import { NextRequest, NextResponse } from 'next/server'

// Mock system data
const systemMetrics = {
  cpu: {
    usage: 45.2,
    cores: 8,
    temperature: 62.5,
    processes: 156
  },
  memory: {
    total: 16384,
    used: 10240,
    available: 6144,
    usage: 62.5
  },
  disk: {
    total: 512000,
    used: 174080,
    available: 337920,
    usage: 34.0
  },
  network: {
    download: 2.5,
    upload: 0.8,
    totalDownload: 12450,
    totalUpload: 3450
  },
  uptime: '15d 4h 23m',
  loadAverage: [1.2, 1.5, 1.8]
}

const alerts = [
  {
    id: '1',
    type: 'warning',
    title: 'High CPU Usage',
    message: 'CPU usage is above 80% on agent-001',
    severity: 'medium',
    source: 'system-monitor',
    timestamp: '2026-04-17T17:25:00Z',
    resolved: false,
    acknowledged: false
  },
  {
    id: '2',
    type: 'error',
    title: 'Memory Leak Detected',
    message: 'Memory usage steadily increasing on api-server-001',
    severity: 'high',
    source: 'system-monitor',
    timestamp: '2026-04-17T17:20:00Z',
    resolved: false,
    acknowledged: true
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update Available',
    message: 'New system update v2.1.0 is available',
    severity: 'low',
    source: 'system-monitor',
    timestamp: '2026-04-17T17:15:00Z',
    resolved: true,
    acknowledged: true
  }
]

const logs = [
  {
    id: '1',
    level: 'info',
    message: 'Agent trading-bot-001 started successfully',
    timestamp: '2026-04-17T17:30:15Z',
    source: 'agent-runner',
    component: 'trading'
  },
  {
    id: '2',
    level: 'warning',
    message: 'High memory usage detected: 85%',
    timestamp: '2026-04-17T17:29:45Z',
    source: 'system-monitor',
    component: 'system'
  },
  {
    id: '3',
    level: 'error',
    message: 'Failed to connect to GMGN API: Connection timeout',
    timestamp: '2026-04-17T17:28:30Z',
    source: 'api-client',
    component: 'trading'
  },
  {
    id: '4',
    level: 'debug',
    message: 'WebSocket connection established',
    timestamp: '2026-04-17T17:27:00Z',
    source: 'websocket-server',
    component: 'network'
  },
  {
    id: '5',
    level: 'info',
    message: 'New API endpoint created: /api/users',
    timestamp: '2026-04-17T17:25:15Z',
    source: 'api-factory',
    component: 'development'
  }
]

const performance = {
  responseTime: 125,
  throughput: 1245,
  errorRate: 0.5,
  availability: 99.9,
  activeConnections: 234
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // metrics, alerts, logs, performance
    
    switch (type) {
      case 'metrics':
        return NextResponse.json({
          success: true,
          data: systemMetrics
        })
        
      case 'alerts':
        const severity = searchParams.get('severity')
        const status = searchParams.get('status')
        let filteredAlerts = alerts
        
        if (severity) {
          filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity)
        }
        
        if (status === 'active') {
          filteredAlerts = filteredAlerts.filter(alert => !alert.resolved)
        } else if (status === 'resolved') {
          filteredAlerts = filteredAlerts.filter(alert => alert.resolved)
        }
        
        return NextResponse.json({
          success: true,
          data: filteredAlerts,
          total: filteredAlerts.length
        })
        
      case 'logs':
        const level = searchParams.get('level')
        const component = searchParams.get('component')
        const limit = searchParams.get('limit') || '100'
        const offset = searchParams.get('offset') || '0'
        let filteredLogs = logs
        
        if (level) {
          filteredLogs = filteredLogs.filter(log => log.level === level)
        }
        
        if (component) {
          filteredLogs = filteredLogs.filter(log => log.component === component)
        }
        
        const paginatedLogs = filteredLogs
          .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
          .reverse() // Show newest first
        
        return NextResponse.json({
          success: true,
          data: paginatedLogs,
          total: filteredLogs.length,
          offset: parseInt(offset),
          limit: parseInt(limit)
        })
        
      case 'performance':
        return NextResponse.json({
          success: true,
          data: performance
        })
        
      default:
        return NextResponse.json({
          success: true,
          data: {
            metrics: systemMetrics,
            alerts: alerts.filter(a => !a.resolved),
            performance: performance
          }
        })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'acknowledge-alert':
        const alertIndex = alerts.findIndex(alert => alert.id === data.alertId)
        
        if (alertIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Alert not found' },
            { status: 404 }
          )
        }
        
        alerts[alertIndex] = {
          ...alerts[alertIndex],
          acknowledged: true
        }
        
        return NextResponse.json({
          success: true,
          data: alerts[alertIndex],
          message: 'Alert acknowledged successfully'
        })
        
      case 'resolve-alert':
        const resolveAlertIndex = alerts.findIndex(alert => alert.id === data.alertId)
        
        if (resolveAlertIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Alert not found' },
            { status: 404 }
          )
        }
        
        alerts[resolveAlertIndex] = {
          ...alerts[resolveAlertIndex],
          resolved: true
        }
        
        return NextResponse.json({
          success: true,
          data: alerts[resolveAlertIndex],
          message: 'Alert resolved successfully'
        })
        
      case 'create-alert':
        const newAlert = {
          id: Date.now().toString(),
          type: data.type || 'info',
          title: data.title,
          message: data.message,
          severity: data.severity || 'medium',
          source: data.source || 'user',
          timestamp: new Date().toISOString(),
          resolved: false,
          acknowledged: false
        }
        
        alerts.unshift(newAlert)
        
        return NextResponse.json({
          success: true,
          data: newAlert,
          message: 'Alert created successfully'
        }, { status: 201 })
        
      case 'add-log':
        const newLog = {
          id: Date.now().toString(),
          level: data.level || 'info',
          message: data.message,
          timestamp: new Date().toISOString(),
          source: data.source || 'user',
          component: data.component || 'system'
        }
        
        logs.unshift(newLog)
        
        // Keep only last 10000 logs
        if (logs.length > 10000) {
          logs.splice(10000)
        }
        
        return NextResponse.json({
          success: true,
          data: newLog,
          message: 'Log added successfully'
        }, { status: 201 })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process system action' },
      { status: 500 }
    )
  }
}