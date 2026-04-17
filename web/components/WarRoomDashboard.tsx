'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useWebSocketContext } from '@/contexts/WebSocketContext'

// Dashboard Stats
const dashboardStats = {
  totalAgents: 156,
  activeAgents: 89,
  completedTasks: 1242,
  successRate: 94.5,
  systemUptime: '15d 4h 23m',
  totalProfit: 12450.32,
  activeVps: 24,
  githubRepos: 42,
  deployedApis: 18
}

// Quick Actions
const quickActions = [
  {
    id: 'start-trading',
    name: 'Start Trading',
    description: 'Launch trading bots with current strategy',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    action: () => console.log('Start trading')
  },
  {
    id: 'scan-gmgn',
    name: 'Scan GMGN Signals',
    description: 'Check for new trading opportunities',
    icon: '📊',
    color: 'from-blue-500 to-cyan-500',
    action: () => console.log('Scan GMGN')
  },
  {
    id: 'deploy-agent',
    name: 'Deploy Agent Army',
    description: 'Launch multiple AI agents',
    icon: '🤖',
    color: 'from-purple-500 to-pink-500',
    action: () => console.log('Deploy agents')
  },
  {
    id: 'create-api',
    name: 'Create API',
    description: 'Generate new API endpoint',
    icon: '🏭',
    color: 'from-orange-500 to-red-500',
    action: () => console.log('Create API')
  },
  {
    id: 'github-sync',
    name: 'GitHub Sync',
    description: 'Sync repositories and code',
    icon: '🐙',
    color: 'from-gray-500 to-slate-500',
    action: () => console.log('GitHub sync')
  },
  {
    id: 'vps-deploy',
    name: 'VPS Deploy',
    description: 'Deploy new server instance',
    icon: '☁️',
    color: 'from-indigo-500 to-purple-500',
    action: () => console.log('VPS deploy')
  }
]

// Recent Activities
const recentActivities = [
  {
    id: '1',
    type: 'trading',
    message: 'Trading bot captured 15.2 SOL profit',
    timestamp: '2 minutes ago',
    icon: '💰',
    color: 'text-green-400'
  },
  {
    id: '2',
    type: 'agent',
    message: 'Agent army deployment completed',
    timestamp: '5 minutes ago',
    icon: '🤖',
    color: 'text-blue-400'
  },
  {
    id: '3',
    type: 'api',
    message: 'New API endpoint created: /api/users',
    timestamp: '12 minutes ago',
    icon: '🏭',
    color: 'text-purple-400'
  },
  {
    id: '4',
    type: 'github',
    message: 'Pull request merged: feature/trading-enhancements',
    timestamp: '18 minutes ago',
    icon: '🐙',
    color: 'text-gray-400'
  },
  {
    id: '5',
    type: 'vps',
    message: 'New VPS instance deployed in us-east-1',
    timestamp: '25 minutes ago',
    icon: '☁️',
    color: 'text-indigo-400'
  },
  {
    id: '6',
    type: 'system',
    message: 'System update completed successfully',
    timestamp: '1 hour ago',
    icon: '⚙️',
    color: 'text-yellow-400'
  }
]

// System Alerts
const systemAlerts = [
  {
    id: '1',
    type: 'warning',
    message: 'High CPU usage detected on agent-001',
    timestamp: '5 minutes ago',
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    message: 'New skill available: Advanced Trading Strategies',
    timestamp: '15 minutes ago',
    resolved: true
  },
  {
    id: '3',
    type: 'error',
    message: 'Failed to connect to GMGN API',
    timestamp: '30 minutes ago',
    resolved: false
  }
]

export default function WarRoomDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [activities, setActivities] = useState(recentActivities)
  const { socket, wsState, addListener } = useWebSocketContext()

  useEffect(() => {
    // Listen for real-time updates
    if (socket) {
      addListener('trading-update', (data) => {
        setActivities(prev => [
          {
            id: Date.now().toString(),
            type: 'trading',
            message: `Trading profit: ${data.payload.profit} SOL`,
            timestamp: 'Just now',
            icon: '💰',
            color: 'text-green-400'
          },
          ...prev.slice(0, 9)
        ])
      })
      
      addListener('agent-update', (data) => {
        setActivities(prev => [
          {
            id: Date.now().toString(),
            type: 'agent',
            message: `Agent ${data.payload.agentId} status: ${data.payload.status}`,
            timestamp: 'Just now',
            icon: '🤖',
            color: 'text-blue-400'
          },
          ...prev.slice(0, 9)
        ])
      })
    }
  }, [socket, addListener])

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      case 'info': return 'bg-blue-500'
      case 'success': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-6 border border-orange-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to the AI WARLORD GOD PLATFORM
            </h1>
            <p className="text-gray-400">
              Your complete command center for autonomous AI agents, trading, and automation
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">System Status</div>
            <Badge variant="success" className="text-sm">
              OPERATIONAL
            </Badge>
            <div className="text-xs text-gray-400 mt-1">
              Uptime: {dashboardStats.systemUptime}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Total Profit</div>
          <div className="text-2xl font-bold text-white">
            ${dashboardStats.totalProfit.toLocaleString()}
          </div>
          <div className="text-green-400 text-xs">From trading bots</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Active Agents</div>
          <div className="text-2xl font-bold text-white">
            {dashboardStats.activeAgents}/{dashboardStats.totalAgents}
          </div>
          <div className="text-blue-400 text-xs">Currently running</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Success Rate</div>
          <div className="text-2xl font-bold text-white">
            {dashboardStats.successRate}%
          </div>
          <div className="text-purple-400 text-xs">
            {dashboardStats.completedTasks} tasks completed
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-orange-900/20 to-orange-700/20 border-orange-500/30">
          <div className="text-orange-400 text-sm">Active VPS</div>
          <div className="text-2xl font-bold text-white">
            {dashboardStats.activeVps}
          </div>
          <div className="text-orange-400 text-xs">Global deployment</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          <Button
            variant="ghost"
            onClick={() => setShowQuickActions(!showQuickActions)}
          >
            {showQuickActions ? 'Hide' : 'Show All'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.slice(0, showQuickActions ? quickActions.length : 3).map(action => (
            <motion.div
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br hover:from-gray-800/50 hover:to-gray-900/50"
                onClick={action.action}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{action.name}</h3>
                    <p className="text-xs text-gray-400">{action.description}</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full">
                  Execute
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Card className="p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={selectedTab === 'overview' ? 'primary' : 'ghost'}
            onClick={() => setSelectedTab('overview')}
            size="sm"
          >
            Overview
          </Button>
          <Button
            variant={selectedTab === 'agents' ? 'primary' : 'ghost'}
            onClick={() => setSelectedTab('agents')}
            size="sm"
          >
            Agents
          </Button>
          <Button
            variant={selectedTab === 'trading' ? 'primary' : 'ghost'}
            onClick={() => setSelectedTab('trading')}
            size="sm"
          >
            Trading
          </Button>
          <Button
            variant={selectedTab === 'systems' ? 'primary' : 'ghost'}
            onClick={() => setSelectedTab('systems')}
            size="sm"
          >
            Systems
          </Button>
          <Button
            variant={selectedTab === 'alerts' ? 'primary' : 'ghost'}
            onClick={() => setSelectedTab('alerts')}
            size="sm"
          >
            Alerts
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card className="p-4">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activities</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {activities.map(activity => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-3 p-2 bg-gray-900/30 rounded-lg"
                      >
                        <div className={`text-xl ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm">{activity.message}</div>
                          <div className="text-xs text-gray-500">{activity.timestamp}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>

              {/* System Status */}
              <Card className="p-4">
                <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white">Agent Army</span>
                    </div>
                    <Badge variant="success">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white">Trading Bot</span>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white">API Factory</span>
                    </div>
                    <Badge variant="success">Running</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white">GitHub Bot</span>
                    </div>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-white">VPS Army</span>
                    </div>
                    <Badge variant="warning">Deploying</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-white">WebSocket</span>
                    </div>
                    <Badge variant={wsState.connected ? 'success' : 'danger'}>
                      {wsState.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Alerts Tab */}
          {selectedTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">System Alerts</h3>
              
              <div className="space-y-3">
                {systemAlerts.map(alert => (
                  <Card
                    key={alert.id}
                    className={`p-4 border-l-4 ${
                      alert.type === 'error' ? 'border-red-500' :
                      alert.type === 'warning' ? 'border-yellow-500' :
                      'border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full ${getAlertColor(alert.type)} mt-1`} />
                        <div>
                          <div className="font-bold text-white">{alert.message}</div>
                          <div className="text-sm text-gray-400">{alert.timestamp}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {alert.resolved ? (
                          <Badge variant="success">Resolved</Badge>
                        ) : (
                          <Badge variant={alert.type === 'error' ? 'danger' : alert.type === 'warning' ? 'warning' : 'secondary'}>
                            {alert.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Agents Tab */}
          {selectedTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
                <div className="text-blue-400 text-sm">Total Agents</div>
                <div className="text-3xl font-bold text-white">{dashboardStats.totalAgents}</div>
                <div className="text-blue-400 text-xs">In command center</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
                <div className="text-green-400 text-sm">Active Now</div>
                <div className="text-3xl font-bold text-white">{dashboardStats.activeAgents}</div>
                <div className="text-green-400 text-xs">Currently executing</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
                <div className="text-purple-400 text-sm">Success Rate</div>
                <div className="text-3xl font-bold text-white">{dashboardStats.successRate}%</div>
                <div className="text-purple-400 text-xs">Last 24 hours</div>
              </Card>
              
              <div className="md:col-span-3">
                <Button variant="primary" className="w-full">
                  View Agent Command Center
                </Button>
              </div>
            </div>
          )}

          {/* Trading Tab */}
          {selectedTab === 'trading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
                <div className="text-green-400 text-sm">Total Profit</div>
                <div className="text-3xl font-bold text-white">
                  ${dashboardStats.totalProfit.toLocaleString()}
                </div>
                <div className="text-green-400 text-xs">All time</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
                <div className="text-blue-400 text-sm">Active Trades</div>
                <div className="text-3xl font-bold text-white">12</div>
                <div className="text-blue-400 text-xs">Currently open</div>
              </Card>
              
              <div className="md:col-span-2">
                <Button variant="primary" className="w-full">
                  Open Trading War Machine
                </Button>
              </div>
            </div>
          )}

          {/* Systems Tab */}
          {selectedTab === 'systems' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-orange-900/20 to-orange-700/20 border-orange-500/30">
                <div className="text-orange-400 text-sm">Active VPS</div>
                <div className="text-3xl font-bold text-white">{dashboardStats.activeVps}</div>
                <div className="text-orange-400 text-xs">Global deployment</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
                <div className="text-purple-400 text-sm">Deployed APIs</div>
                <div className="text-3xl font-bold text-white">{dashboardStats.deployedApis}</div>
                <div className="text-purple-400 text-xs">Active endpoints</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-gray-900/20 to-gray-700/20 border-gray-500/30">
                <div className="text-gray-400 text-sm">GitHub Repos</div>
                <div className="text-3xl font-bold text-white">{dashboardStats.githubRepos}</div>
                <div className="text-gray-400 text-xs">Managed</div>
              </Card>
              
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="primary">VPS Army Deployer</Button>
                <Button variant="primary">API Factory Forge</Button>
                <Button variant="primary">GitHub Takeover</Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Emergency Actions */}
      <Card className="p-6 border-red-500/30 bg-red-900/10">
        <h3 className="text-lg font-bold text-white mb-4">Emergency Actions</h3>
        
        <div className="flex gap-4">
          <Button variant="danger">
            🛑 Emergency Stop All
          </Button>
          <Button variant="danger">
            💸 Close All Positions
          </Button>
          <Button variant="danger">
            🔄 System Restart
          </Button>
        </div>
      </Card>
    </div>
  )
}