'use client'

import { useState } from 'react'
import { Search, Filter, Bell, User, Moon, Sun, Wifi, WifiOff } from 'lucide-react'
import { useWebSocket } from '@/contexts/websocket-context'
// import { useTheme } from 'next-themes'

export function WarRoomNav() {
  const [searchQuery, setSearchQuery] = useState('')
  const { isConnected } = useWebSocket()
  // const { theme, setTheme } = useTheme()
  const [notifications] = useState([
    { id: 1, text: 'Agent #42 completed mission', time: '2 min ago', read: false },
    { id: 2, text: 'GMGN signal detected: SOL pumping', time: '5 min ago', read: false },
    { id: 3, text: 'New skill installed: api-factory', time: '10 min ago', read: true },
  ])

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <div className="border-b border-warlord-purple/30 bg-black/30 backdrop-blur-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents, missions, skills, logs..."
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-warlord-purple/20 rounded-lg text-sm focus:outline-none focus:border-warlord-purple placeholder:text-muted-foreground"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-3 ml-6">
            {/* Network Status */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
              isConnected 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-white/10 rounded-lg relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-warlord-pink rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{unreadNotifications}</span>
                  </div>
                )}
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              // onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <Moon className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-bold">WARLORD COMMANDER</div>
                <div className="text-xs text-muted-foreground">Solxhunter X100</div>
              </div>
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-warlord-purple to-warlord-pink flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex items-center space-x-6 mt-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warlord-purple rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Agents:</span>
            <span className="font-bold text-white">12 active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warlord-cyan rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Missions:</span>
            <span className="font-bold text-white">24 running</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-trading-profit rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">24h Profit:</span>
            <span className="font-bold text-trading-profit">+$1,248.56</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warlord-amber rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">System Load:</span>
            <span className="font-bold text-white">42%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warlord-green rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Uptime:</span>
            <span className="font-bold text-white">14d 6h 23m</span>
          </div>
        </div>
      </div>
    </div>
  )
}