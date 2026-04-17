'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useWebSocketContext } from '@/contexts/WebSocketContext'

// Agent Types
type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused'

type Agent = {
  id: string
  name: string
  type: string
  status: AgentStatus
  progress: number
  startTime: string
  endTime?: string
  output: string
  error?: string
  model: string
  tools: string[]
  metadata: Record<string, any>
}

// Mock Agents Data
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Trading Bot Builder',
    type: 'trading',
    status: 'running',
    progress: 75,
    startTime: '2026-04-17 17:20:00',
    model: 'claude-3-opus',
    tools: ['terminal', 'file', 'web'],
    metadata: {
      strategy: 'momentum-sniper',
      target: 'SOL'
    },
    output: 'Building trading bot components...'
  },
  {
    id: '2',
    name: 'Code Review Agent',
    type: 'development',
    status: 'completed',
    progress: 100,
    startTime: '2026-04-17 17:15:00',
    endTime: '2026-04-17 17:18:30',
    model: 'claude-3-sonnet',
    tools: ['github', 'file'],
    metadata: {
      repository: 'AI-WARLORD-GOD-PLATFORM',
      pullRequest: '#42'
    },
    output: 'Code review completed. Found 3 minor issues, all resolved.'
  },
  {
    id: '3',
    name: 'API Factory Worker',
    type: 'api',
    status: 'idle',
    progress: 0,
    startTime: '2026-04-17 17:10:00',
    model: 'gpt-4',
    tools: ['web', 'execute_code'],
    metadata: {
      endpoint: '/api/users',
      method: 'GET'
    },
    output: 'Waiting for task...'
  },
  {
    id: '4',
    name: 'GitHub Automation',
    type: 'github',
    status: 'failed',
    progress: 45,
    startTime: '2026-04-17 17:05:00',
    model: 'claude-3-haiku',
    tools: ['github', 'terminal'],
    metadata: {
      action: 'create-repo',
      error: 'Repository already exists'
    },
    output: 'Failed to create repository',
    error: 'Repository with name "AI-WARLORD-GOD-PLATFORM" already exists'
  }
]

// Agent Templates
const agentTemplates = [
  {
    id: 'trading-bot',
    name: 'Trading Bot Agent',
    description: 'Build and deploy crypto trading bots',
    icon: '💰',
    color: 'bg-green-500',
    defaultModel: 'claude-3-opus',
    defaultTools: ['terminal', 'file', 'web'],
    config: {
      strategy: 'momentum-sniper',
      exchange: 'bybit',
      pair: 'SOL/USDT'
    }
  },
  {
    id: 'code-review',
    name: 'Code Review Agent',
    description: 'Review and analyze code changes',
    icon: '🔍',
    color: 'bg-blue-500',
    defaultModel: 'claude-3-sonnet',
    defaultTools: ['github', 'file'],
    config: {
      focus: 'security',
      strictness: 'high'
    }
  },
  {
    id: 'api-generator',
    name: 'API Generator Agent',
    description: 'Create REST APIs and endpoints',
    icon: '🏭',
    color: 'bg-purple-500',
    defaultModel: 'gpt-4',
    defaultTools: ['web', 'execute_code'],
    config: {
      format: 'json',
      auth: 'jwt'
    }
  },
  {
    id: 'github-automation',
    name: 'GitHub Automation Agent',
    description: 'Automate GitHub workflows',
    icon: '🐙',
    color: 'bg-gray-500',
    defaultModel: 'claude-3-haiku',
    defaultTools: ['github', 'terminal'],
    config: {
      autoMerge: false,
      issueTracking: true
    }
  },
  {
    id: 'vps-deployer',
    name: 'VPS Deployer Agent',
    description: 'Deploy and manage VPS instances',
    icon: '☁️',
    color: 'bg-orange-500',
    defaultModel: 'claude-3-opus',
    defaultTools: ['terminal', 'web'],
    config: {
      provider: 'aws',
      region: 'us-east-1',
      size: 'medium'
    }
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst Agent',
    description: 'Analyze data and generate insights',
    icon: '📊',
    color: 'bg-yellow-500',
    defaultModel: 'gpt-4',
    defaultTools: ['file', 'execute_code'],
    config: {
      format: 'csv',
      visualization: true
    }
  }
]

export default function AgentCommandCenter() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [newAgentConfig, setNewAgentConfig] = useState({
    name: '',
    template: '',
    model: '',
    tools: [] as string[]
  })
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { socket, wsState, addListener } = useWebSocketContext()

  useEffect(() => {
    // Listen for agent updates
    if (socket) {
      addListener('agent-update', (data) => {
        setAgents(prev => prev.map(agent => 
          agent.id === data.payload.agentId
            ? { ...agent, ...data.payload }
            : agent
        ))
      })
    }
  }, [socket, addListener])

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'paused': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const createAgent = () => {
    if (!newAgentConfig.name || !newAgentConfig.template) return

    const template = agentTemplates.find(t => t.id === newAgentConfig.template)
    if (!template) return

    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentConfig.name,
      type: template.id,
      status: 'idle',
      progress: 0,
      startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      model: newAgentConfig.model || template.defaultModel,
      tools: newAgentConfig.tools.length > 0 ? newAgentConfig.tools : template.defaultTools,
      metadata: template.config,
      output: 'Agent created and ready to run'
    }

    setAgents(prev => [newAgent, ...prev])
    setShowCreateAgent(false)
    setNewAgentConfig({ name: '', template: '', model: '', tools: [] })
  }

  const startAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId
        ? { ...agent, status: 'running' as AgentStatus, progress: 0 }
        : agent
    ))

    // Emit start event
    if (socket) {
      socket.send(JSON.stringify({
        type: 'start-agent',
        payload: { agentId }
      }))
    }
  }

  const pauseAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId
        ? { ...agent, status: 'paused' as AgentStatus }
        : agent
    ))
  }

  const stopAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId
        ? { 
            ...agent, 
            status: 'failed' as AgentStatus,
            endTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            error: 'Stopped by user'
          }
        : agent
    ))
  }

  const removeAgent = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId))
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Agent Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Total Agents</div>
          <div className="text-2xl font-bold text-white">{agents.length}</div>
          <div className="text-blue-400 text-xs">In command center</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Active Agents</div>
          <div className="text-2xl font-bold text-white">
            {agents.filter(a => a.status === 'running').length}
          </div>
          <div className="text-green-400 text-xs">Currently executing</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Completed Tasks</div>
          <div className="text-2xl font-bold text-white">
            {agents.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-purple-400 text-xs">Successfully finished</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border-yellow-500/30">
          <div className="text-yellow-400 text-sm">Success Rate</div>
          <div className="text-2xl font-bold text-white">
            {Math.round((agents.filter(a => a.status === 'completed').length / agents.length) * 100) || 0}%
          </div>
          <div className="text-yellow-400 text-xs">Overall performance</div>
        </Card>
      </div>

      {/* Create New Agent */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Agent Command Center</h2>
          <Button
            variant="primary"
            onClick={() => setShowCreateAgent(true)}
          >
            Create New Agent
          </Button>
        </div>

        {/* Create Agent Form */}
        <AnimatePresence>
          {showCreateAgent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Create New Agent</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Agent Name</label>
                  <Input
                    type="text"
                    placeholder="My Trading Agent"
                    value={newAgentConfig.name}
                    onChange={(e) => setNewAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-800 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Agent Template</label>
                  <select
                    value={newAgentConfig.template}
                    onChange={(e) => setNewAgentConfig(prev => ({ ...prev, template: e.target.value }))}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                  >
                    <option value="">Select template</option>
                    {agentTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Model</label>
                  <select
                    value={newAgentConfig.model}
                    onChange={(e) => setNewAgentConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                  >
                    <option value="">Auto-select</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Tools</label>
                  <select
                    multiple
                    value={newAgentConfig.tools}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions, option => option.value)
                      setNewAgentConfig(prev => ({ ...prev, tools: options }))
                    }}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 h-24"
                  >
                    <option value="terminal">Terminal</option>
                    <option value="file">File</option>
                    <option value="web">Web</option>
                    <option value="execute_code">Execute Code</option>
                    <option value="github">GitHub</option>
                    <option value="browser">Browser</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="primary"
                  onClick={createAgent}
                  disabled={!newAgentConfig.name || !newAgentConfig.template}
                >
                  Create Agent
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateAgent(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent Templates */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Agent Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agentTemplates.map(template => (
              <Card
                key={template.id}
                className="p-4 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => {
                  setNewAgentConfig(prev => ({
                    ...prev,
                    template: template.id,
                    model: template.defaultModel,
                    tools: template.defaultTools
                  }))
                  setShowCreateAgent(true)
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center text-lg`}>
                    {template.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{template.name}</h4>
                    <p className="text-xs text-gray-400">{template.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {template.defaultModel}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.defaultTools.length} tools
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Agents */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Active Agents</h3>
          
          <AnimatePresence>
            {agents.map(agent => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={`p-4 hover:bg-gray-800/30 transition-colors cursor-pointer ${
                    selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${getStatusColor(agent.status)} flex items-center justify-center`}>
                        <span className="text-white font-bold">
                          {agent.name.substring(0, 1)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">{agent.name}</h4>
                          <Badge variant={agent.status === 'completed' ? 'success' : agent.status === 'failed' ? 'danger' : agent.status === 'running' ? 'primary' : 'secondary'}>
                            {agent.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Model: {agent.model}</span>
                          <span>Tools: {agent.tools.length}</span>
                          <span>Started: {new Date(agent.startTime).toLocaleTimeString()}</span>
                        </div>
                        
                        {agent.status === 'running' && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{agent.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${agent.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {agent.status === 'idle' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startAgent(agent.id)
                          }}
                        >
                          Start
                        </Button>
                      )}
                      {agent.status === 'running' && (
                        <>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              pauseAgent(agent.id)
                            }}
                          >
                            Pause
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              stopAgent(agent.id)
                            }}
                          >
                            Stop
                          </Button>
                        </>
                      )}
                      {agent.status === 'paused' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startAgent(agent.id)
                          }}
                        >
                          Resume
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAgent(agent.id)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced Agent Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Default Agent Timeout</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>5 minutes</option>
                  <option>10 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>No timeout</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Agent Priority</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>High</option>
                  <option>Normal</option>
                  <option>Low</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Retry Policy</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Retry 3 times</option>
                  <option>Retry 5 times</option>
                  <option>No retry</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Log Level</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Error</option>
                  <option>Warning</option>
                  <option>Info</option>
                  <option>Debug</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Agent Details */}
        {selectedAgent && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedAgent.name} Details</h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedAgent(null)}
              >
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <Badge variant={selectedAgent.status === 'completed' ? 'success' : selectedAgent.status === 'failed' ? 'danger' : selectedAgent.status === 'running' ? 'primary' : 'secondary'}>
                  {selectedAgent.status}
                </Badge>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Model</div>
                <div className="text-white">{selectedAgent.model}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Tools</div>
                <div className="flex gap-1 flex-wrap">
                  {selectedAgent.tools.map(tool => (
                    <Badge key={tool} variant="secondary" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Started</div>
                <div className="text-white">{new Date(selectedAgent.startTime).toLocaleString()}</div>
              </div>
              
              {selectedAgent.endTime && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Ended</div>
                  <div className="text-white">{new Date(selectedAgent.endTime).toLocaleString()}</div>
                </div>
              )}
              
              {selectedAgent.error && (
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-400 mb-1">Error</div>
                  <div className="text-red-400">{selectedAgent.error}</div>
                </div>
              )}
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Output</div>
              <div className="bg-gray-900/50 p-3 rounded-lg text-white font-mono text-sm">
                {selectedAgent.output}
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  )
}