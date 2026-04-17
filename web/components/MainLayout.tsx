'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import WarRoomDashboard from '@/components/WarRoomDashboard'
import TradingWarMachine from '@/components/TradingWarMachine'
import ApiFactoryForge from '@/components/ApiFactoryForge'
import GitHubTakeover from '@/components/GitHubTakeover'
import VPSArmyDeployer from '@/components/VPSArmyDeployer'
import SkillsLibrary from '@/components/SkillsLibrary'
import SystemMonitor from '@/components/SystemMonitor'
import SettingsWarRoom from '@/components/SettingsWarRoom'
import AgentCommandCenter from '@/components/AgentCommandCenter'
import { VpsProvider } from '@/contexts/VpsContext'
import { SkillsProvider } from '@/contexts/SkillsContext'
import { WebSocketProvider } from '@/contexts/WebSocketContext'

// Navigation Items
const navItems = [
  {
    id: 'dashboard',
    name: 'War Room Dashboard',
    icon: '🏰',
    description: 'Main command center'
  },
  {
    id: 'trading',
    name: 'Trading War Machine',
    icon: '💰',
    description: 'GMGN + Bybit trading'
  },
  {
    id: 'api-factory',
    name: 'API Factory Forge',
    icon: '🏭',
    description: 'Zero-code API generator'
  },
  {
    id: 'github',
    name: 'GitHub Takeover',
    icon: '🐙',
    description: 'Repository automation'
  },
  {
    id: 'vps',
    name: 'VPS Army Deployer',
    icon: '☁️',
    description: 'Global server deployment'
  },
  {
    id: 'skills',
    name: 'Skills Library',
    icon: '📚',
    description: '314 skills browser'
  },
  {
    id: 'monitor',
    name: 'System Monitor',
    icon: '📊',
    description: 'Real-time analytics'
  },
  {
    id: 'settings',
    name: 'Settings War Room',
    icon: '⚙️',
    description: 'Platform configuration'
  },
  {
    id: 'agents',
    name: 'Agent Command Center',
    icon: '🤖',
    description: 'Multi-agent control'
  }
]

export default function MainLayout() {
  const [selectedNav, setSelectedNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (selectedNav) {
      case 'dashboard':
        return <WarRoomDashboard />
      case 'trading':
        return <TradingWarMachine />
      case 'api-factory':
        return <ApiFactoryForge />
      case 'github':
        return <GitHubTakeover />
      case 'vps':
        return <VPSArmyDeployer />
      case 'skills':
        return <SkillsLibrary />
      case 'monitor':
        return <SystemMonitor />
      case 'settings':
        return <SettingsWarRoom />
      case 'agents':
        return <AgentCommandCenter />
      default:
        return <WarRoomDashboard />
    }
  }

  return (
    <WebSocketProvider>
      <VpsProvider>
        <SkillsProvider>
          <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden"
                  >
                    ☰
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">⚔️</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      AI WARLORD GOD PLATFORM
                    </h1>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="success" className="hidden sm:flex">
                    SYSTEM OPERATIONAL
                  </Badge>
                  <Button variant="ghost" size="sm">
                    🔔
                  </Button>
                  <Button variant="ghost" size="sm">
                    ⚡
                  </Button>
                </div>
              </div>
            </header>

            <div className="flex">
              {/* Sidebar */}
              <AnimatePresence>
                {(sidebarOpen || window.innerWidth >= 1024) && (
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ duration: 0.3 }}
                    className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 min-h-screen fixed lg:relative z-40"
                  >
                    <div className="p-4">
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-white mb-2">Navigation</h2>
                        <p className="text-xs text-gray-400">AI WARLOD SYSTEMS</p>
                      </div>
                      
                      <nav className="space-y-2">
                        {navItems.map(item => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              className={`p-3 cursor-pointer transition-all ${
                                selectedNav === item.id
                                  ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30 ring-1 ring-orange-500/30'
                                  : 'hover:bg-gray-800/50'
                              }`}
                              onClick={() => {
                                setSelectedNav(item.id)
                                setSidebarOpen(false)
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-xl">{item.icon}</div>
                                <div className="flex-1">
                                  <div className="font-bold text-white text-sm">{item.name}</div>
                                  <div className="text-xs text-gray-400">{item.description}</div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </nav>
                      
                      <div className="mt-8 p-3 bg-gray-900/50 rounded-lg">
                        <div className="text-xs text-gray-400 mb-2">SYSTEM STATUS</div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-white">All systems operational</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          9/9 systems online
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <main className="flex-1 p-4 lg:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedNav}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-400">
                  AI WARLORD GOD PLATFORM v2.0.0
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>🔒 Secure</span>
                  <span>⚡ Fast</span>
                  <span>🎯 Precise</span>
                  <span>🚀 Powerful</span>
                </div>
                <div className="text-xs text-gray-500">
                  Built with ❤️ by AI Warlords
                </div>
              </div>
            </footer>
          </div>
        </SkillsProvider>
      </VpsProvider>
    </WebSocketProvider>
  )
}