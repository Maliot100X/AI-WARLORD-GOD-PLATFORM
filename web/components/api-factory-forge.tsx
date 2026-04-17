'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, Database, Globe, Zap,
  Plus, Download, Upload,
  Settings, Play, Trash2,
  BarChart3, Activity,
  Copy, ExternalLink
} from 'lucide-react'

export function ApiFactoryForge() {
  const [apis, setApis] = useState<any[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedApi, setSelectedApi] = useState<any>(null)

  const mockApis = [
    {
      id: 1,
      name: 'GitHub API Wrapper',
      endpoint: '/api/github',
      method: 'REST',
      status: 'active',
      requests: 15420,
      success: '99.8%',
      lastUsed: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Twitter Scraper',
      endpoint: '/api/twitter',
      method: 'GraphQL',
      status: 'active',
      requests: 8934,
      success: '97.2%',
      lastUsed: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Price Tracker',
      endpoint: '/api/prices',
      method: 'WebSocket',
      status: 'idle',
      requests: 4567,
      success: '98.5%',
      lastUsed: '1 hour ago'
    },
    {
      id: 4,
      name: 'News Aggregator',
      endpoint: '/api/news',
      method: 'REST',
      status: 'error',
      requests: 2341,
      success: '92.1%',
      lastUsed: '3 hours ago'
    }
  ]

  useEffect(() => {
    setApis(mockApis)
  }, [])

  const createNewApi = () => {
    setIsCreating(true)
    setTimeout(() => {
      const newApi = {
        id: apis.length + 1,
        name: 'New API Endpoint',
        endpoint: '/api/new-endpoint',
        method: 'REST',
        status: 'creating',
        requests: 0,
        success: '100%',
        lastUsed: 'just now'
      }
      setApis([newApi, ...apis])
      setIsCreating(false)
    }, 2000)
  }

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'idle': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      case 'creating': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getMethodColor = (method: any) => {
    switch (method) {
      case 'REST': return 'text-blue-400'
      case 'GraphQL': return 'text-purple-400'
      case 'WebSocket': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-api-purple to-api-pink bg-clip-text text-transparent">
            API FACTORY FORGE
          </h2>
          <p className="text-gray-400">Create and manage custom APIs from any website</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={createNewApi}
            disabled={isCreating}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isCreating 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-api-purple to-api-pink hover:shadow-lg'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'CREATING...' : 'CREATE API'}</span>
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-api-purple" />
            <span className="text-xs text-gray-400">TOTAL</span>
          </div>
          <div className="text-2xl font-bold">{apis.length}</div>
          <p className="text-sm text-gray-400">APIs Created</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">ACTIVE</span>
          </div>
          <div className="text-2xl font-bold">{apis.filter(a => a.status === 'active').length}</div>
          <p className="text-sm text-gray-400">Running APIs</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">REQUESTS</span>
          </div>
          <div className="text-2xl font-bold">
            {apis.reduce((sum, api) => sum + api.requests, 0).toLocaleString()}
          </div>
          <p className="text-sm text-gray-400">Total Requests</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-400">SUCCESS</span>
          </div>
          <div className="text-2xl font-bold">
            {Math.round(apis.reduce((sum, api) => sum + parseFloat(api.success), 0) / apis.length)}%
          </div>
          <p className="text-sm text-gray-400">Avg Success Rate</p>
        </div>
      </div>

      {/* API List */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Your APIs</h3>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-gray-400 hover:text-white">
              Filter
            </button>
            <button className="text-sm text-gray-400 hover:text-white">
              Sort
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {apis.map((api) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: api.id * 0.1 }}
              className={`p-4 rounded-lg border transition-colors ${
                selectedApi?.id === api.id 
                  ? 'border-gray-600 bg-gray-700/50' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => setSelectedApi(api)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-api-purple to-api-pink rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{api.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        {api.endpoint}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        api.method === 'REST' ? 'bg-blue-500/20 text-blue-400' :
                        api.method === 'GraphQL' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {api.method}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(api.status)}`}>
                      {api.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">{api.lastUsed}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{api.requests.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">requests</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400">{api.success}</div>
                    <div className="text-xs text-gray-400">success</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* API Details */}
      {selectedApi && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">API Details - {selectedApi.name}</h3>
            <button
              onClick={() => setSelectedApi(null)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Endpoint</h4>
              <code className="block p-3 bg-gray-900 rounded-lg text-sm">
                {selectedApi.endpoint}
              </code>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Method</h4>
              <div className="p-3 bg-gray-900 rounded-lg">
                <span className={`text-sm font-medium ${getMethodColor(selectedApi.method)}`}>
                  {selectedApi.method}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Status</h4>
              <div className="p-3 bg-gray-900 rounded-lg">
                <span className={`text-sm font-medium ${getStatusColor(selectedApi.status)}`}>
                  {selectedApi.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Actions</h4>
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm">
                  Test API
                </button>
                <button className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm">
                  View Docs
                </button>
                <button className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 mx-auto mb-2 text-api-purple" />
            <span className="text-sm">Create API</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Play className="w-5 h-5 mx-auto mb-2 text-green-400" />
            <span className="text-sm">Deploy All</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <BarChart3 className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <span className="text-sm">Analytics</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5 mx-auto mb-2 text-orange-400" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>
    </div>
  )
}