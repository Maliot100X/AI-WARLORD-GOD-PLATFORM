'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  TrendingUp,
  Code,
  Github,
  Server,
  Sparkles,
  BarChart3,
  Settings,
  Zap,
  Cpu,
  Globe,
  Shield,
  Terminal,
  Database,
  Network,
  Cloud,
  Lock,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { useAgent } from '@/contexts/agent-context'
import { useTrading } from '@/contexts/trading-context'

const navItems = [
  { icon: Home, label: 'War Room', id: 'dashboard', badge: null },
  { icon: Users, label: 'Agent Army', id: 'agents', badge: '12' },
  { icon: TrendingUp, label: 'Crypto War', id: 'trading', badge: '🔥' },
  { icon: Code, label: 'API Forge', id: 'api-factory', badge: 'NEW' },
  { icon: Github, label: 'GitHub Takeover', id: 'github', badge: '24' },
  { icon: Server, label: 'VPS Army', id: 'vps', badge: '5' },
  { icon: Sparkles, label: 'Skills Library', id: 'skills', badge: '314' },
  { icon: BarChart3, label: 'System Monitor', id: 'monitor', badge: null },
  { icon: Settings, label: 'War Command', id: 'settings', badge: null },
]

const systemItems = [
  { icon: Zap, label: 'Quick Deploy', color: 'text-warlord-purple' },
  { icon: Cpu, label: 'Agent Console', color: 'text-warlord-cyan' },
  { icon: Globe, label: 'Global Network', color: 'text-warlord-pink' },
  { icon: Shield, label: 'Security Hub', color: 'text-warlord-amber' },
  { icon: Terminal, label: 'CLI Access', color: 'text-warlord-green' },
  { icon: Database, label: 'Data Warehouse', color: 'text-blue-500' },
  { icon: Network, label: 'API Gateway', color: 'text-cyan-500' },
  { icon: Cloud, label: 'Cloud Control', color: 'text-purple-500' },
]

export function GodModeSidebar() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  
  const { agents } = useAgent()
  const { stats: tradingStats } = useTrading()

  const activeAgents = agents?.filter(a => a.status === 'running').length || 0
  const totalProfit = tradingStats?.totalProfit || 0

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`h-screen bg-warlord-darker border-r border-warlord-purple/20 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      } transition-all duration-300`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-warlord-purple/20">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warlord-purple to-warlord-pink flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-warlord-purple to-warlord-pink bg-clip-text text-transparent">
                WARLORD
              </div>
              <div className="text-xs text-muted-foreground">GOD MODE</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warlord-purple to-warlord-pink flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-b border-warlord-purple/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">AGENTS</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-white">{activeAgents}/∞</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">PROFIT</div>
              <div className={`font-bold ${totalProfit >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                ${totalProfit.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">LOAD</div>
              <div className="w-24 h-2 bg-warlord-darker rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-warlord-cyan to-warlord-blue rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, activeAgents * 10)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-warlord-purple/20 to-warlord-pink/10 text-white border border-warlord-purple/30'
                    : 'hover:bg-white/5 text-muted-foreground hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-warlord-purple/20 text-warlord-purple">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* System Tools */}
        {!collapsed && (
          <div className="mt-8 px-3">
            <div className="text-xs uppercase text-muted-foreground tracking-wider mb-3">
              System Tools
            </div>
            <div className="grid grid-cols-2 gap-2">
              {systemItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <button
                    key={idx}
                    className="p-2 bg-black/30 border border-warlord-purple/10 rounded-lg hover:bg-warlord-purple/10 transition-colors group"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <div className="text-xs text-center group-hover:text-white transition-colors">
                        {item.label}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-warlord-purple/20">
        {!collapsed ? (
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-3 py-2 bg-black/30 border border-warlord-purple/20 rounded-lg hover:bg-warlord-purple/10 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notifications</span>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded bg-warlord-pink/20 text-warlord-pink">
                3
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 bg-black/30 border border-warlord-purple/20 rounded-lg hover:bg-warlord-purple/10 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Help & Docs</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-warlord-purple/20 to-warlord-pink/10 border border-warlord-purple/30 rounded-lg hover:opacity-90 transition-opacity">
              <div className="flex items-center space-x-3">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-bold">Lock System</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <button className="p-2 hover:bg-white/5 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg">
              <Lock className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-3 p-2 bg-black/50 border border-warlord-purple/20 rounded-lg hover:bg-warlord-purple/10 transition-colors flex items-center justify-center"
        >
          {collapsed ? (
            <div className="text-xs text-muted-foreground">Expand</div>
          ) : (
            <div className="text-xs text-muted-foreground">Collapse</div>
          )}
        </button>
      </div>
    </motion.div>
  )
}