'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVpsContext } from '@/contexts/VpsContext'
import { useWebSocketContext } from '@/contexts/WebSocketContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// VPS Providers
const VPS_PROVIDERS = [
  {
    id: 'aws',
    name: 'AWS EC2',
    description: 'Amazon Web Services',
    icon: '☁️',
    color: 'bg-orange-500',
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1']
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    description: 'Cloud infrastructure',
    icon: '🌊',
    color: 'bg-blue-500',
    regions: ['nyc3', 'sfo3', 'lon1', 'sgp1']
  },
  {
    id: 'vultr',
    name: 'Vultr',
    description: 'High performance SSD',
    icon: '⚡',
    color: 'bg-blue-600',
    regions: ['New Jersey', 'Silicon Valley', 'London', 'Singapore']
  },
  {
    id: 'linode',
    name: 'Linode',
    description: 'Cloud hosting',
    icon: '🍃',
    color: 'bg-green-500',
    regions: ['us-central', 'us-west', 'eu-central', 'ap-south']
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    description: 'Google Cloud Platform',
    icon: '🔍',
    color: 'bg-yellow-500',
    regions: ['us-east1', 'us-west1', 'europe-west1', 'asia-southeast1']
  },
  {
    id: 'azure',
    name: 'Azure',
    description: 'Microsoft Azure',
    icon: '🔵',
    color: 'bg-blue-700',
    regions: ['eastus', 'westus', 'westeurope', 'southeastasia']
  }
]

// Mock VPS Instances
const mockVpsInstances = [
  {
    id: '1',
    name: 'agent-001',
    provider: 'AWS EC2',
    region: 'us-east-1',
    ip: '54.123.45.67',
    status: 'active',
    agents: 12,
    cpu: 45,
    memory: 67,
    uptime: '15d 4h'
  },
  {
    id: '2',
    name: 'trader-001',
    provider: 'DigitalOcean',
    region: 'nyc3',
    ip: '192.0.2.1',
    status: 'active',
    agents: 5,
    cpu: 23,
    memory: 45,
    uptime: '7d 12h'
  },
  {
    id: '3',
    name: 'api-001',
    provider: 'Vultr',
    region: 'New Jersey',
    ip: '203.0.113.1',
    status: 'deploying',
    agents: 0,
    cpu: 0,
    memory: 0,
    uptime: 'Just created'
  }
]

// Mock Global Stats
const mockGlobalStats = {
  totalInstances: 24,
  activeAgents: 156,
  totalRegions: 12,
  averageUptime: '98.5%'
}

export default function VPSArmyDeployer() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [instanceName, setInstanceName] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { vpsState, updateVpsState } = useVpsContext()
  const { socket, addListener, sendMessage } = useWebSocketContext()

  useEffect(() => {
    // Listen for VPS updates
    if (socket) {
      addListener('vps-update', (data) => {
        updateVpsState(data)
      })
    }
  }, [socket, updateVpsState])

  const deployInstance = async () => {
    if (!selectedProvider || !instanceName || !selectedRegion) return
    
    setIsDeploying(true)
    
    // Emit deployment event
    if (socket) {
      sendMessage({
        type: 'deploy-vps',
        data: {
          provider: selectedProvider,
          name: instanceName,
          region: selectedRegion
        }
      })
    }
    
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false)
      setInstanceName('')
      setSelectedProvider(null)
      setSelectedRegion('')
      // Add new instance to mock data
      mockVpsInstances.unshift({
        id: Date.now().toString(),
        name: instanceName,
        provider: VPS_PROVIDERS.find(p => p.id === selectedProvider)?.name || 'Unknown',
        region: selectedRegion,
        ip: 'Deploying...',
        status: 'deploying',
        agents: 0,
        cpu: 0,
        memory: 0,
        uptime: 'Just created'
      })
    }, 5000)
  }

  const getProviderRegions = () => {
    if (!selectedProvider) return []
    const provider = VPS_PROVIDERS.find(p => p.id === selectedProvider)
    return provider?.regions || []
  }

  return (
    <div className="space-y-6">
      {/* Global VPS Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-900/20 to-orange-700/20 border-orange-500/30">
          <div className="text-orange-400 text-sm">Total Instances</div>
          <div className="text-2xl font-bold text-white">{mockGlobalStats.totalInstances}</div>
          <div className="text-orange-400 text-xs">Across providers</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Active Agents</div>
          <div className="text-2xl font-bold text-white">{mockGlobalStats.activeAgents}</div>
          <div className="text-blue-400 text-xs">Deployed globally</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Regions</div>
          <div className="text-2xl font-bold text-white">{mockGlobalStats.totalRegions}</div>
          <div className="text-green-400 text-xs">Global coverage</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Average Uptime</div>
          <div className="text-2xl font-bold text-white">{mockGlobalStats.averageUptime}</div>
          <div className="text-purple-400 text-xs">All instances</div>
        </Card>
      </div>

      {/* Deploy New Instance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">VPS Army Deployer</h2>
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
        </div>

        {/* Deployment Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Select VPS Provider</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {VPS_PROVIDERS.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? 'ring-2 ring-orange-500 bg-orange-900/20'
                        : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${provider.color} flex items-center justify-center text-lg`}>
                        {provider.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{provider.name}</h3>
                        <p className="text-xs text-gray-400">{provider.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {provider.regions.slice(0, 2).map((region, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                      {provider.regions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{provider.regions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {selectedProvider && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Instance Name</label>
                  <Input
                    type="text"
                    placeholder="my-agent-instance"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    className="bg-gray-800 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                  >
                    <option value="">Select region</option>
                    {getProviderRegions().map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={deployInstance}
                disabled={!instanceName || !selectedRegion || isDeploying}
                className="w-full"
              >
                {isDeploying ? 'Deploying...' : 'Deploy Instance'}
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
            <h3 className="text-lg font-bold text-white mb-4">Advanced Deployment Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Instance Size</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Micro (1CPU, 1GB RAM)</option>
                  <option>Small (1CPU, 2GB RAM)</option>
                  <option>Medium (2CPU, 4GB RAM)</option>
                  <option>Large (4CPU, 8GB RAM)</option>
                  <option>XLarge (8CPU, 16GB RAM)</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Operating System</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Ubuntu 22.04 LTS</option>
                  <option>Ubuntu 20.04 LTS</option>
                  <option>Debian 11</option>
                  <option>CentOS 8</option>
                  <option>Windows Server 2022</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Auto-scaling</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Disabled</option>
                  <option>CPU Based</option>
                  <option>Memory Based</option>
                  <option>Custom Metrics</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Backup Strategy</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>No Backup</option>
                  <option>Daily Snapshots</option>
                  <option>Weekly Snapshots</option>
                  <option>Real-time Replication</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Deployment Script (Bash)</label>
              <textarea 
                placeholder="#!/bin/bash\n# Auto-deployment script\napt update\napt install -y docker"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 h-24 font-mono text-sm"
              />
            </div>
          </motion.div>
        )}
      </Card>

      {/* Active Instances */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Active Instances</h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {mockVpsInstances.map((instance) => (
              <motion.div
                key={instance.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">
                          {instance.provider.substring(0, 1)}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white">{instance.name}</h4>
                        <p className="text-sm text-gray-400">
                          {instance.provider} • {instance.region} • {instance.ip}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant={instance.status === 'active' ? 'success' : 'warning'}>
                            {instance.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {instance.agents} agents
                          </span>
                          <span className="text-xs text-gray-400">
                            CPU: {instance.cpu}%
                          </span>
                          <span className="text-xs text-gray-400">
                            RAM: {instance.memory}%
                          </span>
                          <span className="text-xs text-gray-400">
                            Uptime: {instance.uptime}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        SSH
                      </Button>
                      <Button variant="ghost" size="sm">
                        Monitor
                      </Button>
                      <Button variant="ghost" size="sm">
                        Scale
                      </Button>
                      <Button variant="danger" size="sm">
                        Destroy
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Global Map */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Global Distribution</h3>
        
        <div className="bg-gray-900/50 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-2">Interactive World Map</div>
          <div className="text-sm text-gray-500">Showing VPS instances across {mockGlobalStats.totalRegions} regions</div>
          <div className="mt-4 flex justify-center gap-4">
            <Badge variant="success">North America: 8 instances</Badge>
            <Badge variant="success">Europe: 6 instances</Badge>
            <Badge variant="success">Asia: 10 instances</Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}