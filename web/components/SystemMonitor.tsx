'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// System Metrics
const systemMetrics = {
  cpu: {
    current: 45,
    average: 38,
    peak: 78,
    cores: 16
  },
  memory: {
    current: 67,
    total: 64,
    used: 42.8,
    available: 21.2
  },
  disk: {
    current: 34,
    total: 1000,
    used: 340,
    available: 660
  },
  network: {
    download: 12.4,
    upload: 3.2,
    total: 15420
  },
  agents: {
    active: 156,
    total: 200,
    success: 98.5
  },
  uptime: {
    days: 15,
    hours: 4,
    minutes: 23
  }
}

// Real-time Logs
const mockLogs = [
  {
    id: '1',
    level: 'info',
    message: 'Agent army deployment completed successfully',
    timestamp: '2026-04-17 17:23:45',
    source: 'agent-deployer'
  },
  {
    id: '2',
    level: 'success',
    message: 'Trading bot captured 15.2 SOL profit',
    timestamp: '2026-04-17 17:22:12',
    source: 'trading-war-machine'
  },
  {
    id: '3',
    level: 'warning',
    message: 'High CPU usage detected on agent-001',
    timestamp: '2026-04-17 17:21:33',
    source: 'system-monitor'
  },
  {
    id: '4',
    level: 'error',
    message: 'Failed to connect to GMGN API',
    timestamp: '2026-04-17 17:20:45',
    source: 'gmgn-connector'
  },
  {
    id: '5',
    level: 'info',
    message: 'New API factory instance created',
    timestamp: '2026-04-17 17:19:28',
    source: 'api-factory'
  }
]

// System Health
const systemHealth = {
  overall: 'healthy',
  services: [
    { name: 'Agent Army', status: 'healthy', uptime: '99.9%' },
    { name: 'Trading Bot', status: 'healthy', uptime: '98.5%' },
    { name: 'API Factory', status: 'healthy', uptime: '100%' },
    { name: 'GitHub Bot', status: 'healthy', uptime: '97.2%' },
    { name: 'VPS Army', status: 'warning', uptime: '95.8%' },
    { name: 'WebSocket', status: 'healthy', uptime: '99.7%' }
  ]
}

export default function SystemMonitor() {
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [logs, setLogs] = useState(mockLogs)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setLogs(prev => [
          {
            id: Date.now().toString(),
            level: 'info',
            message: `System check completed - All services operational`,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            source: 'system-monitor'
          },
          ...prev.slice(0, 9)
        ])
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400'
      case 'warning': return 'text-yellow-400'
      case 'success': return 'text-green-400'
      default: return 'text-blue-400'
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">System Status</div>
          <div className="text-2xl font-bold text-white uppercase">{systemHealth.overall}</div>
          <div className="text-green-400 text-xs">
            {systemMetrics.uptime.days}d {systemMetrics.uptime.hours}h uptime
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Active Agents</div>
          <div className="text-2xl font-bold text-white">{systemMetrics.agents.active}</div>
          <div className="text-blue-400 text-xs">
            {systemMetrics.agents.success}% success rate
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">CPU Usage</div>
          <div className="text-2xl font-bold text-white">{systemMetrics.cpu.current}%</div>
          <div className="text-purple-400 text-xs">
            Peak: {systemMetrics.cpu.peak}%
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border-yellow-500/30">
          <div className="text-yellow-400 text-sm">Memory Usage</div>
          <div className="text-2xl font-bold text-white">{systemMetrics.memory.current}%</div>
          <div className="text-yellow-400 text-xs">
            {systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB
          </div>
        </Card>
      </div>

      {/* Metric Tabs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">System Monitor</h2>
          <div className="flex items-center gap-4">
            <Button
              variant={autoRefresh ? 'success' : 'ghost'}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </Button>
          </div>
        </div>

        {/* Metric Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={selectedMetric === 'overview' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMetric('overview')}
            size="sm"
          >
            Overview
          </Button>
          <Button
            variant={selectedMetric === 'cpu' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMetric('cpu')}
            size="sm"
          >
            CPU
          </Button>
          <Button
            variant={selectedMetric === 'memory' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMetric('memory')}
            size="sm"
          >
            Memory
          </Button>
          <Button
            variant={selectedMetric === 'disk' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMetric('disk')}
            size="sm"
          >
            Disk
          </Button>
          <Button
            variant={selectedMetric === 'network' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMetric('network')}
            size="sm"
          >
            Network
          </Button>
          <Button
            variant={selectedMetric === 'services' ? 'primary' : 'ghost'}
            onClick={() => setSelectedMetric('services')}
            size="sm"
          >
            Services
          </Button>
        </div>

        {/* Metric Content */}
        <div className="space-y-6">
          {/* CPU Metrics */}
          {(selectedMetric === 'overview' || selectedMetric === 'cpu') && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">CPU Usage</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Current Usage</span>
                    <span>{systemMetrics.cpu.current}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${systemMetrics.cpu.current}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Average Usage</span>
                    <span>{systemMetrics.cpu.average}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${systemMetrics.cpu.average}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                {systemMetrics.cpu.cores} cores available • Peak: {systemMetrics.cpu.peak}%
              </div>
            </Card>
          )}

          {/* Memory Metrics */}
          {(selectedMetric === 'overview' || selectedMetric === 'memory') && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Memory Usage</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Used Memory</span>
                    <span>{systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${systemMetrics.memory.current}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Available Memory</span>
                    <span>{systemMetrics.memory.available}GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(systemMetrics.memory.available / systemMetrics.memory.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Total: {systemMetrics.memory.total}GB • Usage: {systemMetrics.memory.current}%
              </div>
            </Card>
          )}

          {/* Disk Metrics */}
          {(selectedMetric === 'overview' || selectedMetric === 'disk') && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Disk Usage</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Used Space</span>
                  <span>{systemMetrics.disk.used}GB / {systemMetrics.disk.total}GB</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${systemMetrics.disk.current}%` }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Available: {systemMetrics.disk.available}GB • Usage: {systemMetrics.disk.current}%
              </div>
            </Card>
          )}

          {/* Network Metrics */}
          {(selectedMetric === 'overview' || selectedMetric === 'network') && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Network Activity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {systemMetrics.network.download} Mbps
                  </div>
                  <div className="text-sm text-gray-400">Download</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {systemMetrics.network.upload} Mbps
                  </div>
                  <div className="text-sm text-gray-400">Upload</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {systemMetrics.network.total} GB
                  </div>
                  <div className="text-sm text-gray-400">Total Transfer</div>
                </div>
              </div>
            </Card>
          )}

          {/* Service Health */}
          {(selectedMetric === 'overview' || selectedMetric === 'services') && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Service Health</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {systemHealth.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getHealthColor(service.status)}`} />
                      <div>
                        <div className="font-bold text-white">{service.name}</div>
                        <div className="text-sm text-gray-400">Uptime: {service.uptime}</div>
                      </div>
                    </div>
                    
                    <Badge variant={service.status === 'healthy' ? 'success' : service.status === 'warning' ? 'warning' : 'danger'}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced System Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Alert Thresholds</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Default (CPU &gt; 80%, Memory &gt; 90%)</option>
                  <option>Conservative (CPU &gt; 70%, Memory &gt; 80%)</option>
                  <option>Aggressive (CPU &gt; 90%, Memory &gt; 95%)</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Log Retention</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Monitoring Interval</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Real-time (1s)</option>
                  <option>Fast (5s)</option>
                  <option>Normal (30s)</option>
                  <option>Slow (1m)</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Performance Mode</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Balanced</option>
                  <option>Performance</option>
                  <option>Power Saving</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Notification Channels</label>
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm">Email</Button>
                <Button variant="ghost" size="sm">Slack</Button>
                <Button variant="ghost" size="sm">Telegram</Button>
                <Button variant="ghost" size="sm">Discord</Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Real-time Logs */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Real-time Logs</h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-2 bg-gray-900/30 rounded-lg"
              >
                <div className={`text-sm font-mono ${getLogColor(log.level)}`}>
                  [{log.timestamp}]
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">{log.message}</div>
                  <div className="text-xs text-gray-500">{log.source}</div>
                </div>
                <Badge variant={log.level === 'error' ? 'danger' : log.level === 'warning' ? 'warning' : log.level === 'success' ? 'success' : 'secondary'}>
                  {log.level}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}