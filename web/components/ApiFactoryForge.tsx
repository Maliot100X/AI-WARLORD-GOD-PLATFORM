'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApiFactory } from '@/contexts/ApiFactoryContext'
import { useWebSocketContext } from '@/contexts/WebSocketContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// API Factory Templates
const API_TEMPLATES = [
  {
    id: 'scraper',
    name: 'Web Scraper API',
    description: 'Extract data from any website',
    icon: '🕷️',
    color: 'bg-blue-500',
    endpoints: ['GET /data', 'POST /scrape', 'GET /status']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce API',
    description: 'Product catalog and orders',
    icon: '🛒',
    color: 'bg-green-500',
    endpoints: ['GET /products', 'POST /orders', 'GET /inventory']
  },
  {
    id: 'social',
    name: 'Social Media API',
    description: 'Posts, comments, users',
    icon: '📱',
    color: 'bg-purple-500',
    endpoints: ['GET /posts', 'POST /comment', 'GET /users']
  },
  {
    id: 'news',
    name: 'News API',
    description: 'Articles and headlines',
    icon: '📰',
    color: 'bg-yellow-500',
    endpoints: ['GET /articles', 'GET /headlines', 'GET /categories']
  },
  {
    id: 'weather',
    name: 'Weather API',
    description: 'Current and forecast data',
    icon: '🌤️',
    color: 'bg-cyan-500',
    endpoints: ['GET /current', 'GET /forecast', 'GET /history']
  },
  {
    id: 'finance',
    name: 'Finance API',
    description: 'Stocks and market data',
    icon: '💰',
    color: 'bg-green-600',
    endpoints: ['GET /stocks', 'GET /markets', 'GET /portfolio']
  }
]

// Mock API Projects
const mockApiProjects = [
  {
    id: '1',
    name: 'Amazon Scraper',
    url: 'amazon-scraper-api',
    status: 'active',
    requests: 15420,
    endpoints: 12,
    created: '2 hours ago'
  },
  {
    id: '2',
    name: 'Twitter Monitor',
    url: 'twitter-monitor-api',
    status: 'building',
    requests: 0,
    endpoints: 8,
    created: '1 hour ago'
  },
  {
    id: '3',
    name: 'News Aggregator',
    url: 'news-aggregator-api',
    status: 'active',
    requests: 8934,
    endpoints: 6,
    created: '1 day ago'
  }
]

export default function ApiFactoryForge() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [targetUrl, setTargetUrl] = useState('')
  const [apiName, setApiName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { state: apiFactoryState, dispatch } = useApiFactory()
  const { socket, addListener, sendMessage } = useWebSocketContext()

  useEffect(() => {
    // Listen for API factory updates
    if (socket) {
      addListener('api-factory-update', (data) => {
        dispatch({ type: 'SET_APIS', payload: data.apis })
      })
    }
  }, [socket, addListener, dispatch])

  const createApi = async () => {
    if (!selectedTemplate || !targetUrl || !apiName) return
    
    setIsCreating(true)
    
    // Emit API creation event
    if (socket) {
      sendMessage({
        type: 'create-api',
        data: {
          template: selectedTemplate,
          targetUrl,
          name: apiName
        }
      })
    }
    
    // Simulate API creation
    setTimeout(() => {
      setIsCreating(false)
      setTargetUrl('')
      setApiName('')
      setSelectedTemplate(null)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* API Factory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Total APIs</div>
          <div className="text-2xl font-bold text-white">{mockApiProjects.length}</div>
          <div className="text-blue-400 text-xs">Active projects</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Total Requests</div>
          <div className="text-2xl font-bold text-white">
            {mockApiProjects.reduce((sum, p) => sum + p.requests, 0).toLocaleString()}
          </div>
          <div className="text-green-400 text-xs">All time</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Endpoints</div>
          <div className="text-2xl font-bold text-white">
            {mockApiProjects.reduce((sum, p) => sum + p.endpoints, 0)}
          </div>
          <div className="text-purple-400 text-xs">Generated</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border-yellow-500/30">
          <div className="text-yellow-400 text-sm">Success Rate</div>
          <div className="text-2xl font-bold text-white">99.8%</div>
          <div className="text-yellow-400 text-xs">Uptime</div>
        </Card>
      </div>

      {/* Create New API */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">API Factory Forge</h2>
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
        </div>

        {/* API Creation Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Select API Template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {API_TEMPLATES.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'ring-2 ring-blue-500 bg-blue-900/20'
                        : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center text-lg`}>
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{template.name}</h3>
                        <p className="text-xs text-gray-400">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {template.endpoints.map((endpoint, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {endpoint}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Target Website URL</label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="bg-gray-800 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">API Name</label>
                  <Input
                    type="text"
                    placeholder="My Awesome API"
                    value={apiName}
                    onChange={(e) => setApiName(e.target.value)}
                    className="bg-gray-800 text-white"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                onClick={createApi}
                disabled={!targetUrl || !apiName || isCreating}
                className="w-full"
              >
                {isCreating ? 'Creating API...' : 'Create API'}
              </Button>
            </motion.div>
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
            <h3 className="text-lg font-bold text-white mb-4">Advanced API Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Rate Limit (requests/min)</label>
                <input 
                  type="number" 
                  defaultValue="60"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Cache Duration (seconds)</label>
                <input 
                  type="number" 
                  defaultValue="300"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Authentication</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>No Auth</option>
                  <option>API Key</option>
                  <option>JWT</option>
                  <option>OAuth2</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Response Format</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>JSON</option>
                  <option>XML</option>
                  <option>CSV</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Custom Headers (JSON)</label>
              <textarea 
                placeholder='{"User-Agent": "My-API-Factory/1.0"}'
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 h-24"
              />
            </div>
          </motion.div>
        )}
      </Card>

      {/* Existing APIs */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your APIs</h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {mockApiProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">API</span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white">{project.name}</h4>
                        <p className="text-sm text-gray-400">{project.url}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant={project.status === 'active' ? 'success' : 'warning'}>
                            {project.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {project.requests.toLocaleString()} requests
                          </span>
                          <span className="text-xs text-gray-400">
                            {project.endpoints} endpoints
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Docs
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}