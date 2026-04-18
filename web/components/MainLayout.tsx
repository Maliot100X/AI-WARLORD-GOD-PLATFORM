'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Skull,
  TrendingUp as Dragon,
  Zap as Lightning,
  Sword,
  Server,
  BookOpen,
  Activity,
  Rocket,
  Flame,
  Sparkles as Thunder,
  Star,
} from 'lucide-react'
import WarRoomDashboard from '@/components/WarRoomDashboard'
import AgentCommandCenter from '@/components/AgentCommandCenter'
import TradingWarMachine from '@/components/TradingWarMachine'
import ApiFactoryForge from '@/components/ApiFactoryForge'
import GitHubTakeover from '@/components/GitHubTakeover'
import VPSArmyDeployer from '@/components/VPSArmyDeployer'
import SkillsLibrary from '@/components/SkillsLibrary'
import SystemMonitor from '@/components/SystemMonitor'

const tabs = [
  {
    id: 'warroom',
    name: 'WAR ROOM',
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    glow: 'shadow-purple-500/50',
  },
  {
    id: 'agents',
    name: 'AGENT ARMY',
    icon: Skull,
    color: 'from-red-600 to-orange-600',
    glow: 'shadow-red-500/50',
  },
  {
    id: 'trading',
    name: 'CRYPTO WAR',
    icon: Dragon,
    color: 'from-green-600 to-blue-600',
    glow: 'shadow-green-500/50',
  },
  {
    id: 'api',
    name: 'API FORGE',
    icon: Lightning,
    color: 'from-yellow-600 to-red-600',
    glow: 'shadow-yellow-500/50',
  },
  {
    id: 'github',
    name: 'GITHUB STORM',
    icon: Sword,
    color: 'from-gray-600 to-blue-600',
    glow: 'shadow-gray-500/50',
  },
  {
    id: 'vps',
    name: 'VPS LEGION',
    icon: Server,
    color: 'from-indigo-600 to-purple-600',
    glow: 'shadow-indigo-500/50',
  },
  {
    id: 'skills',
    name: 'SKILLS VAULT',
    icon: BookOpen,
    color: 'from-cyan-600 to-blue-600',
    glow: 'shadow-cyan-500/50',
  },
  {
    id: 'monitor',
    name: 'SYSTEM CORE',
    icon: Activity,
    color: 'from-teal-600 to-green-600',
    glow: 'shadow-teal-500/50',
  },
]

const CONTENT_MAP: Record<string, React.ReactNode> = {
  warroom: <WarRoomDashboard />,
  agents: <AgentCommandCenter />,
  trading: <TradingWarMachine />,
  api: <ApiFactoryForge />,
  github: <GitHubTakeover />,
  vps: <VPSArmyDeployer />,
  skills: <SkillsLibrary />,
  monitor: <SystemMonitor />,
}

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('warroom')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(139,92,246,0.08) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Crown className="w-12 h-12 text-purple-500" />
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-balance">
              AI WARLORD GOD PLATFORM
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Crown className="w-12 h-12 text-blue-500" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-400 font-bold tracking-wider">
            CONTROL &bull; DOMINATE &bull; CONQUER &bull; AUTOMATE
          </p>
        </motion.div>

        {/* NAVIGATION */}
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
                className={`relative px-5 py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl ${tab.glow}`
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CONTENT AREA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20 rounded-3xl blur-xl" />
          <div className="relative bg-black/80 backdrop-blur-lg rounded-3xl border border-gray-800/50 p-6 lg:p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {CONTENT_MAP[activeTab] ?? children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>POWERED BY AI WARLORD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thunder className="w-4 h-4 text-yellow-500" />
              <span>BUILT WITH GOD MODE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-purple-500" />
              <span>EPIC AUTOMATION</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainLayout
