'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Activity, Users, Zap,
  TrendingUp, AlertCircle, CheckCircle,
  Clock, MapPin, BarChart3
} from 'lucide-react'

export function WarRoomDashboard() {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    completedTasks: 0,
    successRate: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [worldMap, setWorldMap] = useState<any[]>([])

  const mockActivity = [
    {
      id: 1,
      type: 'agent_deployed',
      message: 'Trading Agent deployed to Tokyo server',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'task_completed',
      message: 'GitHub repository analysis completed',
      timestamp: '5 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'alert',
      message: 'High CPU usage detected on Server 02',
      timestamp: '8 minutes ago',
      status: 'warning'
    },
    {
      id: 4,
      type: 'api_error',
      message: 'External API connection failed',
      timestamp: '12 minutes ago',
      status: 'error'
    }
  ]

  const mockMapData = [
    { id: 1, city: 'Tokyo', agents: 25, status: 'active' },
    { id: 2, city: 'New York', agents: 18, status: 'active' },
    { id: 3, city: 'London', agents: 15, status: 'active' },
    { id: 4, city: 'Singapore', agents: 12, status: 'active' },
    { id: 5, city: 'San Francisco', agents: 8, status: 'warning' }
  ]

  useEffect(() => {
    setStats({
      totalAgents: 78,
      activeAgents: 65,
      completedTasks: 1247,
      successRate: 94.5
    })
    setRecentActivity(mockActivity)
    setWorldMap(mockMapData)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Activity className="w-5 h-5 text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-warlord-red to-warlord-orange bg-clip-text text-transparent">
            WAR ROOM DASHBOARD
          </h2>
          <p className="text-gray-400">Global command center for AI operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-warlord-red" />
            <span className="text-xs text-gray-400">TOTAL</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalAgents}</div>
          <p className="text-sm text-gray-400">Agents Deployed</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">ACTIVE</span>
          </div>
          <div className="text-2xl font-bold">{stats.activeAgents}</div>
          <p className="text-sm text-gray-400">Running Agents</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">COMPLETED</span>
          </div>
          <div className="text-2xl font-bold">{stats.completedTasks}</div>
          <p className="text-sm text-gray-400">Tasks</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">SUCCESS</span>
          </div>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-sm text-gray-400">Success Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* World Map */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Global Deployment</h3>
            <span className="text-xs text-gray-400">5 Active Regions</span>
          </div>
          <div className="space-y-3">
            {worldMap.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: location.id * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{location.city}</h4>
                    <p className="text-sm text-gray-400">{location.agents} agents</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  location.status === 'active' ? 'bg-green-400' : 
                  location.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Recent Activity</h3>
            <span className="text-xs text-gray-400">Live Feed</span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: activity.id * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg"
              >
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.message}</h4>
                    <span className="text-xs text-gray-400">{activity.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.type === 'agent_deployed' && 'Deployment'}
                    {activity.type === 'task_completed' && 'Task'}
                    {activity.type === 'alert' && 'System Alert'}
                    {activity.type === 'api_error' && 'Error'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h3 className="font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Users className="w-5 h-5 mx-auto mb-2 text-warlord-red" />
            <span className="text-sm">Deploy Agent</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Activity className="w-5 h-5 mx-auto mb-2 text-green-400" />
            <span className="text-sm">Monitor All</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <span className="text-sm">View Stats</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <AlertCircle className="w-5 h-5 mx-auto mb-2 text-purple-400" />
            <span className="text-sm">Alerts</span>
          </button>
        </div>
      </div>
    </div>
  )
}