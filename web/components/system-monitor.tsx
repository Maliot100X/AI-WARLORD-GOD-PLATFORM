'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, Cpu, Database, Network, HardDrive,
  AlertTriangle, CheckCircle, XCircle,
  BarChart3, LineChart, PieChart,
  RefreshCw, Settings, Zap
} from 'lucide-react'

export function SystemMonitor() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    agents: 0,
    uptime: '0d 0h 0m'
  })
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLive, setIsLive] = useState(true)

  const mockAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High CPU Usage',
      message: 'Server CPU usage exceeded 90%',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Agent Started',
      message: 'Trading Agent #42 successfully deployed',
      timestamp: '5 minutes ago'
    },
    {
      id: 3,
      type: 'error',
      title: 'Connection Failed',
      message: 'Failed to connect to external API',
      timestamp: '10 minutes ago'
    }
  ]

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setMetrics({
          cpu: Math.floor(Math.random() * 30) + 40,
          memory: Math.floor(Math.random() * 20) + 60,
          disk: Math.floor(Math.random() * 10) + 70,
          network: Math.floor(Math.random() * 50) + 30,
          agents: Math.floor(Math.random() * 20) + 30,
          uptime: '7d 14h 32m'
        })
        setAlerts(mockAlerts)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isLive])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />
      case 'info': return <CheckCircle className="w-5 h-5 text-green-400" />
      default: return <CheckCircle className="w-5 h-5 text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-monitor-blue to-monitor-green bg-clip-text text-transparent">
            SYSTEM MONITOR
          </h2>
          <p className="text-gray-400">Real-time system performance and health monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isLive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`} />
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </button>
          <button className="p-2 bg-gray-800 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-5 h-5 text-monitor-blue" />
            <span className="text-xs text-gray-400">CPU</span>
          </div>
          <div className="text-2xl font-bold">{metrics.cpu}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-monitor-blue to-blue-500 h-2 rounded-full"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">RAM</span>
          </div>
          <div className="text-2xl font-bold">{metrics.memory}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-400">DISK</span>
          </div>
          <div className="text-2xl font-bold">{metrics.disk}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
              style={{ width: `${metrics.disk}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Network className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">NET</span>
          </div>
          <div className="text-2xl font-bold">{metrics.network}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
              style={{ width: `${metrics.network}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-400">AGENTS</span>
          </div>
          <div className="text-2xl font-bold">{metrics.agents}</div>
          <div className="text-xs text-gray-400 mt-1">Active</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-pink-400" />
            <span className="text-xs text-gray-400">UPTIME</span>
          </div>
          <div className="text-lg font-bold">{metrics.uptime}</div>
          <div className="text-xs text-gray-400 mt-1">Stable</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Performance Overview</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-white">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <LineChart className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <PieChart className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <LineChart className="w-full h-full" />
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">System Alerts</h3>
            <span className="text-xs text-gray-400">{alerts.length} active</span>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg"
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <span className="text-xs text-gray-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process List */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h3 className="font-medium mb-4">Active Processes</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Trading Engine</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>45% CPU</span>
              <span>1.2GB RAM</span>
              <span>Running</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Agent Manager</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>12% CPU</span>
              <span>256MB RAM</span>
              <span>Running</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>API Gateway</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>8% CPU</span>
              <span>128MB RAM</span>
              <span>Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}