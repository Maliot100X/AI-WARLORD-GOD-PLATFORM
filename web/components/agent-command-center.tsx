'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Terminal, Play, Pause, Square,
  Activity, AlertCircle, CheckCircle,
  Settings, Users, Zap,
  BarChart3, Monitor
} from 'lucide-react'

export function AgentCommandCenter() {
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const mockAgents = [
    {
      id: 1,
      name: 'Trading Agent Alpha',
      type: 'trading',
      status: 'running',
      uptime: '2h 34m',
      tasks: 142,
      success: '98.2%'
    },
    {
      id: 2,
      name: 'GitHub Agent',
      type: 'development',
      status: 'idle',
      uptime: '0h 0m',
      tasks: 89,
      success: '94.7%'
    },
    {
      id: 3,
      name: 'API Monitor',
      type: 'monitoring',
      status: 'running',
      uptime: '5d 12h',
      tasks: 2156,
      success: '99.8%'
    },
    {
      id: 4,
      name: 'Debug Assistant',
      type: 'support',
      status: 'stopped',
      uptime: '0h 0m',
      tasks: 567,
      success: '96.1%'
    }
  ]

  const mockCommands = [
    'status',
    'start',
    'stop',
    'restart',
    'logs',
    'config',
    'deploy',
    'update'
  ]

  useEffect(() => {
    setAgents(mockAgents)
  }, [])

  const executeCommand = () => {
    if (!command.trim() || !selectedAgent) return

    setIsRunning(true)
    const newOutput = [...output, `$ ${command}`]
    
    setTimeout(() => {
      const responses = {
        'status': 'Agent is running normally',
        'start': 'Agent started successfully',
        'stop': 'Agent stopped',
        'restart': 'Agent restarted',
        'logs': 'Last 10 log entries:\n[INFO] Agent initialized\n[INFO] Connected to API\n[INFO] Processing tasks...',
        'config': 'Current configuration:\nmax_tasks: 100\nretry_limit: 3\ntimeout: 30s',
        'deploy': 'Deployment initiated...',
        'update': 'Checking for updates...\nAgent is up to date'
      }

      const response = (responses as any)[command.split(' ')[0]] || 'Command executed'
      newOutput.push(response)
      setOutput(newOutput)
      setCommand('')
      setIsRunning(false)
    }, 1000)
  }

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'running': return 'text-green-400'
      case 'idle': return 'text-yellow-400'
      case 'stopped': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-agent-green to-agent-blue bg-clip-text text-transparent">
            AGENT COMMAND CENTER
          </h2>
          <p className="text-gray-400">Control and monitor all AI agents</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium mb-4">Active Agents</h3>
            <div className="space-y-3">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: agent.id * 0.1 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{agent.name}</h4>
                    <span className={`text-xs ${getStatusColor(agent.status)}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{agent.type}</span>
                    <span>{agent.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>{agent.tasks} tasks</span>
                    <span>{agent.success} success</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Command Terminal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Terminal</h3>
              {selectedAgent && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {selectedAgent.name} {selectedAgent.status === 'running' && '●'}
                  </span>
                  <button 
                    onClick={() => {
                      const updatedAgents = agents.map(a => 
                        a.id === selectedAgent.id 
                          ? { ...a, status: a.status === 'running' ? 'stopped' : 'running' }
                          : a
                      )
                      setAgents(updatedAgents)
                      setSelectedAgent(updatedAgents.find(a => a.id === selectedAgent.id))
                    }}
                    className="p-1 rounded hover:bg-gray-700"
                  >
                    {selectedAgent.status === 'running' ? 
                      <Pause className="w-4 h-4 text-yellow-400" /> : 
                      <Play className="w-4 h-4 text-green-400" />
                    }
                  </button>
                </div>
              )}
            </div>
            
            {/* Output Area */}
            <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {output.length === 0 ? (
                <div className="text-gray-500">
                  {selectedAgent ? 
                    `Connected to ${selectedAgent.name}\nType 'help' for available commands` :
                    'Select an agent to start'
                  }
                </div>
              ) : (
                output.map((line, index) => (
                  <div key={index} className="mb-1">
                    {line.startsWith('$') ? (
                      <span className="text-green-400">{line}</span>
                    ) : (
                      <span className="text-gray-300">{line}</span>
                    )}
                  </div>
                ))
              )}
              {isRunning && (
                <div className="flex items-center space-x-1">
                  <span className="text-green-400">$ {command}</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
            
            {/* Command Input */}
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1 relative">
                <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                  placeholder={selectedAgent ? 'Enter command...' : 'Select an agent first'}
                  disabled={!selectedAgent || isRunning}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <button
                onClick={executeCommand}
                disabled={!selectedAgent || !command.trim() || isRunning}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Execute
              </button>
            </div>
          </div>

          {/* Quick Commands */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Quick Commands</h3>
            <div className="flex flex-wrap gap-2">
              {mockCommands.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => setCommand(cmd)}
                  disabled={!selectedAgent}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Details */}
      {selectedAgent && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="font-medium mb-3">Agent Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-400">Type</span>
              <p className="font-medium">{selectedAgent.type}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Status</span>
              <p className={`font-medium ${getStatusColor(selectedAgent.status)}`}>
                {selectedAgent.status}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Tasks Completed</span>
              <p className="font-medium">{selectedAgent.tasks}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Success Rate</span>
              <p className="font-medium">{selectedAgent.success}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}