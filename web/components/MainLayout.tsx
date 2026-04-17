'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useWebSocketContext } from '@/contexts/WebSocketContext'
import { 
  Settings, 
  User, 
  Shield, 
  Zap, 
  Target, 
  Globe, 
  Server, 
  BookOpen, 
  Activity,
  Crown,
  Skull,
  Flame,
  Lightning,
  Rocket,
  Sword,
  Dragon,
  Phoenix,
  Thunder,
  Star,
  Diamond,
  Crown as King
} from 'lucide-react'

// EPIC WARLORD LAYOUT WITH HOLLYWOOD STYLE
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('warroom')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const tabs = [
    { 
      id: 'warroom', 
      name: 'WAR ROOM', 
      icon: Crown, 
      color: 'from-purple-600 to-pink-600',
      glow: 'shadow-purple-500/50'
    },
    { 
      id: 'agents', 
      name: 'AGENT ARMY', 
      icon: Skull, 
      color: 'from-red-600 to-orange-600',
      glow: 'shadow-red-500/50'
    },
    { 
      id: 'trading', 
      name: 'CRYPTO WAR', 
      icon: Dragon, 
      color: 'from-green-600 to-blue-600',
      glow: 'shadow-green-500/50'
    },
    { 
      id: 'api', 
      name: 'API FORGE', 
      icon: Lightning, 
      color: 'from-yellow-600 to-red-600',
      glow: 'shadow-yellow-500/50'
    },
    { 
      id: 'github', 
      name: 'GITHUB STORM', 
      icon: Sword, 
      color: 'from-gray-600 to-blue-600',
      glow: 'shadow-gray-500/50'
    },
    { 
      id: 'vps', 
      name: 'VPS LEGION', 
      icon: Server, 
      color: 'from-indigo-600 to-purple-600',
      glow: 'shadow-indigo-500/50'
    },
    { 
      id: 'skills', 
      name: 'SKILLS VAULT', 
      icon: BookOpen, 
      color: 'from-cyan-600 to-blue-600',
      glow: 'shadow-cyan-500/50'
    },
    { 
      id: 'monitor', 
      name: 'SYSTEM CORE', 
      icon: Activity, 
      color: 'from-teal-600 to-green-600',
      glow: 'shadow-teal-500/50'
    },
    { 
      id: 'command', 
      name: 'WAR COMMAND', 
      icon: Rocket, 
      color: 'from-orange-600 to-red-600',
      glow: 'shadow-orange-500/50'
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'warroom':
        return <WarRoomDashboard />
      case 'agents':
        return <AgentCommandCenter />
      case 'trading':
        return <TradingWarMachine />
      case 'api':
        return <ApiFactoryForge />
      case 'github':
        return <GitHubTakeover />
      case 'vps':
        return <VPSArmyDeployer />
      case 'skills':
        return <SkillsLibrary />
      case 'monitor':
        return <SystemMonitor />
      case 'command':
        return <WarCommandCenter />
      default:
        return <WarRoomDashboard />
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 ${isFullscreen ? '' : 'p-4'}`}>
      {/* EPIC BACKGROUND ANIMATION */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* EPIC HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-12 h-12 text-purple-500" />
            </motion.div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI WARLOD GOD PLATFORM
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <King className="w-12 h-12 text-blue-500" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-400 font-bold tracking-wider">
            CONTROL • DOMINATE • CONQUER • AUTOMATE
          </p>
        </motion.div>

        {/* NAVIGATION - EPIC STYLE */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl ${tab.glow}` 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CONTENT AREA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* EPIC BACKGROUND FOR CONTENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20 rounded-3xl blur-xl"></div>
          
          {/* CONTENT */}
          <div className="relative bg-black/80 backdrop-blur-lg rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* EPIC FOOTER */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>POWERED BY AI WARLORD</span>
            </div>
            <div className="flex items-center gap-1">
              <Thunder className="w-4 h-4 text-yellow-500" />
              <span>BUILT WITH GOD MODE</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-purple-500" />
              <span>EPIC AUTOMATION</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// EPIC WAR ROOM DASHBOARD
const WarRoomDashboard = () => {
  const [stats, setStats] = useState({
    agents: 0,
    trades: 0,
    apis: 0,
    vps: 0,
    uptime: '0h'
  })

  useEffect(() => {
    // Simulate real-time stats
    const interval = setInterval(() => {
      setStats(prev => ({
        agents: prev.agents + Math.floor(Math.random() * 5),
        trades: prev.trades + Math.floor(Math.random() * 10),
        apis: prev.apis + Math.floor(Math.random() * 3),
        vps: prev.vps,
        uptime: `${Math.floor(Math.random() * 24)}h`
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* EPIC TITLE */}
      <div className="text-center">
        <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          WAR ROOM COMMAND CENTER
        </h2>
        <p className="text-gray-400 font-bold">REAL-TIME BATTLEFIELD OVERVIEW</p>
      </div>

      {/* EPIC STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Skull, label: 'ACTIVE AGENTS', value: stats.agents, color: 'from-red-600 to-orange-600' },
          { icon: Dragon, label: 'TRADES EXECUTED', value: stats.trades, color: 'from-green-600 to-blue-600' },
          { icon: Lightning, label: 'APIS CREATED', value: stats.apis, color: 'from-yellow-600 to-red-600' },
          { icon: Server, label: 'VPS ONLINE', value: stats.vps, color: 'from-indigo-600 to-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-bold">{stat.label}</p>
                  <p className="text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent" 
                     style={{ backgroundImage: `linear-gradient(to right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* EPIC STATUS PANEL */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800/50 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              SYSTEM STATUS
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Agent Army', status: 'ONLINE', color: 'text-green-500' },
                { name: 'Trading Engine', status: 'ACTIVE', color: 'text-green-500' },
                { name: 'API Factory', status: 'READY', color: 'text-green-500' },
                { name: 'GitHub Storm', status: 'DEPLOYED', color: 'text-green-500' },
                { name: 'VPS Legion', status: 'STANDBY', color: 'text-yellow-500' },
                { name: 'Skills Vault', status: 'LOADED', color: 'text-green-500' }
              ].map((system, index) => (
                <div key={system.name} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <span className="text-gray-300 font-bold">{system.name}</span>
                  <Badge className={`${system.color} bg-opacity-20 font-bold`}>
                    {system.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-purple-500" />
              QUICK ACTIONS
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'DEPLOY ARMY', color: 'from-purple-600 to-pink-600' },
                { name: 'START TRADING', color: 'from-green-600 to-blue-600' },
                { name: 'FORGE API', color: 'from-yellow-600 to-red-600' },
                { name: 'STORM GITHUB', color: 'from-gray-600 to-blue-600' }
              ].map((action) => (
                <Button
                  key={action.name}
                  className={`bg-gradient-to-r ${action.color} text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                >
                  {action.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* EPIC LIVE FEED */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800/50 p-8">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          LIVE BATTLE FEED
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[
            { time: '2s ago', event: 'Agent Alpha deployed successfully', color: 'text-green-500' },
            { time: '5s ago', event: 'Trade executed: BTC/USDT +$1,234', color: 'text-green-500' },
            { time: '8s ago', event: 'API created: Weather Service', color: 'text-blue-500' },
            { time: '12s ago', event: 'GitHub PR merged: Feature Update', color: 'text-purple-500' },
            { time: '15s ago', event: 'VPS server: US-East-1 online', color: 'text-green-500' }
          ].map((feed, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
              <span className="text-gray-500 text-sm font-bold">{feed.time}</span>
              <span className={`font-bold ${feed.color}`}>{feed.event}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Placeholder components for other tabs - these will be replaced with epic versions
const AgentCommandCenter = () => (
  <div className="text-center py-12">
    <Skull className="w-24 h-24 text-red-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">AGENT ARMY COMMAND CENTER</h2>
    <p className="text-gray-400 font-bold">DEPLOY AND CONTROL YOUR AI ARMY</p>
  </div>
)

const TradingWarMachine = () => (
  <div className="text-center py-12">
    <Dragon className="w-24 h-24 text-green-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">CRYPTO WAR MACHINE</h2>
    <p className="text-gray-400 font-bold">AUTOMATED TRADING WITH GOD MODE</p>
  </div>
)

const ApiFactoryForge = () => (
  <div className="text-center py-12">
    <Lightning className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">API FACTORY FORGE</h2>
    <p className="text-gray-400 font-bold">TURN ANY WEBSITE INTO AN API</p>
  </div>
)

const GitHubTakeover = () => (
  <div className="text-center py-12">
    <Sword className="w-24 h-24 text-gray-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">GITHUB TAKEOVER STORM</h2>
    <p className="text-gray-400 font-bold">AUTOMATE YOUR GITHUB DOMINATION</p>
  </div>
)

const VPSArmyDeployer = () => (
  <div className="text-center py-12">
    <Server className="w-24 h-24 text-indigo-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">VPS ARMY DEPLOYER</h2>
    <p className="text-gray-400 font-bold">GLOBAL SERVER DEPLOYMENT</p>
  </div>
)

const SkillsLibrary = () => (
  <div className="text-center py-12">
    <BookOpen className="w-24 h-24 text-cyan-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">SKILLS VAULT</h2>
    <p className="text-gray-400 font-bold">314 SKILLS FOR TOTAL DOMINATION</p>
  </div>
)

const SystemMonitor = () => (
  <div className="text-center py-12">
    <Activity className="w-24 h-24 text-teal-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">SYSTEM CORE MONITOR</h2>
    <p className="text-gray-400 font-bold">REAL-TIME SYSTEM OVERVIEW</p>
  </div>
)

const WarCommandCenter = () => (
  <div className="text-center py-12">
    <Rocket className="w-24 h-24 text-orange-500 mx-auto mb-4" />
    <h2 className="text-4xl font-black text-white mb-2">WAR COMMAND CENTER</h2>
    <p className="text-gray-400 font-bold">EXECUTE EPIC COMMANDS</p>
  </div>
)

export default MainLayout