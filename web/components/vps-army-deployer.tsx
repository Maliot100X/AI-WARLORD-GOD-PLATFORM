'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Server, Cloud, Globe, Shield, 
  Activity, Cpu, HardDrive, Network,
  Play, Pause, Trash2, Plus,
  Terminal, Monitor, Settings
} from 'lucide-react'

export function VPSArmyDeployer() {
  const [servers, setServers] = useState<any[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const [stats, setStats] = useState({
    totalServers: 0,
    activeAgents: 0,
    totalMemory: 0,
    totalCpu: 0
  })

  const mockServers = [
    {
      id: 1,
      name: 'Agent-Server-01',
      ip: '172.104.203.170',
      status: 'running',
      agents: 25,
      cpu: 45,
      memory: 67,
      location: 'Tokyo',
      provider: 'Vultr'
    },
    {
      id: 2,
      name: 'Agent-Server-02',
      ip: '192.168.1.100',
      status: 'stopped',
      agents: 0,
      cpu: 0,
      memory: 0,
      location: 'New York',
      provider: 'DigitalOcean'
    },
    {
      id: 3,
      name: 'Agent-Server-03',
      ip: '10.0.0.50',
      status: 'running',
      agents: 18,
      cpu: 32,
      memory: 45,
      location: 'London',
      provider: 'AWS'
    }
  ]

  const deployServer = () => {
    setIsDeploying(true)
    setTimeout(() => {
      setServers(mockServers)
      setStats({
        totalServers: 3,
        activeAgents: 43,
        totalMemory: 112,
        totalCpu: 77
      })
      setIsDeploying(false)
    }, 2000)
  }

  const toggleServer = (serverId: number) => {
    setServers(servers.map(server => 
      server.id === serverId 
        ? { ...server, status: server.status === 'running' ? 'stopped' : 'running' }
        : server
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-vps-blue to-vps-purple bg-clip-text text-transparent">
            VPS ARMY DEPLOYER
          </h2>
          <p className="text-gray-400">Deploy and manage agent servers worldwide</p>
        </div>
        <motion.button
          onClick={deployServer}
          disabled={isDeploying}
          className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
            isDeploying 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-vps-blue to-vps-purple hover:shadow-lg'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>{isDeploying ? 'DEPLOYING...' : 'DEPLOY SERVER'}</span>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-vps-blue" />
            <span className="text-2xl font-bold">{stats.totalServers}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Servers</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold">{stats.activeAgents}</span>
          </div>
          <p className="text-gray-400 text-sm">Active Agents</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold">{stats.totalMemory}GB</span>
          </div>
          <p className="text-gray-400 text-sm">Total RAM</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="text-2xl font-bold">{stats.totalCpu}%</span>
          </div>
          <p className="text-gray-400 text-sm">Avg CPU</p>
        </div>
      </div>

      {/* Server List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Deployed Servers</h3>
        {servers.map((server) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: server.id * 0.1 }}
            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  server.status === 'running' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <h4 className="font-medium">{server.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      {server.ip}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Monitor className="w-4 h-4" />
                      {server.location}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Cloud className="w-4 h-4" />
                      {server.provider}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    <span>{server.cpu}%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span>{server.memory}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{server.agents} agents</div>
                  <div className="text-xs text-gray-400">running</div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => toggleServer(server.id)}
                    className={`p-2 rounded-lg ${
                      server.status === 'running' 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {server.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Terminal className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deployment Options */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Quick Deploy</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm">
              🚀 Deploy 10 Agent Servers
            </button>
            <button className="w-full text-left px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm">
              🌍 Global Network Setup
            </button>
            <button className="w-full text-left px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm">
              ⚡ High Performance Cluster
            </button>
          </div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Providers</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>DigitalOcean</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Vultr</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>AWS</span>
              <span className="text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Linode</span>
              <span className="text-gray-400">+</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Monitoring</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center justify-between">
              <span>Uptime</span>
              <span className="text-green-400">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Response Time</span>
              <span>45ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Alerts</span>
              <span className="text-yellow-400">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Backups</span>
              <span className="text-green-400">Daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}