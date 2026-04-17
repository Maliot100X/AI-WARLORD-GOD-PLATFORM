'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, DollarSign,
  BarChart3, LineChart, PieChart,
  Play, Pause, Settings,
  Bitcoin, Activity, AlertTriangle
} from 'lucide-react'

export function TradingWarMachine() {
  const [stats, setStats] = useState({
    totalProfit: 0,
    winRate: 0,
    activeTrades: 0,
    dailyVolume: 0
  })
  const [trades, setTrades] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedStrategy, setSelectedStrategy] = useState('scalping')

  const strategies = [
    { id: 'scalping', name: 'Scalping Bot', profit: '+12.5%', trades: 234 },
    { id: 'swing', name: 'Swing Trading', profit: '+8.3%', trades: 89 },
    { id: 'arbitrage', name: 'Arbitrage', profit: '+15.7%', trades: 567 },
    { id: 'dca', name: 'DCA Bot', profit: '+5.2%', trades: 45 }
  ]

  const mockTrades = [
    {
      id: 1,
      pair: 'SOL/USDC',
      type: 'long',
      entry: 145.23,
      current: 148.67,
      profit: '+2.37%',
      status: 'open',
      strategy: 'scalping'
    },
    {
      id: 2,
      pair: 'BTC/USDC',
      type: 'short',
      entry: 67890,
      current: 67234,
      profit: '+0.97%',
      status: 'open',
      strategy: 'swing'
    },
    {
      id: 3,
      pair: 'ETH/USDC',
      type: 'long',
      entry: 3456,
      current: 3523,
      profit: '+1.94%',
      status: 'closed',
      strategy: 'arbitrage'
    },
    {
      id: 4,
      pair: 'BNB/USDC',
      type: 'long',
      entry: 567,
      current: 589,
      profit: '+3.88%',
      status: 'open',
      strategy: 'dca'
    }
  ]

  useEffect(() => {
    setStats({
      totalProfit: 2847.56,
      winRate: 78.5,
      activeTrades: 12,
      dailyVolume: 125678.90
    })
    setTrades(mockTrades)
  }, [])

  const toggleTrading = () => {
    setIsRunning(!isRunning)
  }

  const getPairIcon = (pair: string) => {
    if (pair.includes('SOL')) return <Activity className="w-5 h-5" />
    if (pair.includes('BTC')) return <Bitcoin className="w-5 h-5" />
    if (pair.includes('ETH')) return <DollarSign className="w-5 h-5" />
    return <DollarSign className="w-5 h-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-400'
      case 'closed': return 'text-gray-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-trading-green to-trading-blue bg-clip-text text-transparent">
            TRADING WAR MACHINE
          </h2>
          <p className="text-gray-400">Advanced cryptocurrency trading system</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTrading}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isRunning 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-green-500/20 text-green-400'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'STOP TRADING' : 'START TRADING'}</span>
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-trading-green" />
            <span className="text-xs text-gray-400">PROFIT</span>
          </div>
          <div className="text-2xl font-bold">${stats.totalProfit.toLocaleString()}</div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+12.5%</span>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">WIN RATE</span>
          </div>
          <div className="text-2xl font-bold">{stats.winRate}%</div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+2.3%</span>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">ACTIVE</span>
          </div>
          <div className="text-2xl font-bold">{stats.activeTrades}</div>
          <p className="text-sm text-gray-400">Open Trades</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-400">VOLUME</span>
          </div>
          <div className="text-2xl font-bold">${(stats.dailyVolume / 1000).toFixed(0)}K</div>
          <p className="text-sm text-gray-400">24h Volume</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategies */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium mb-4">Trading Strategies</h3>
            <div className="space-y-3">
              {strategies.map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (strategies.indexOf(strategy)) * 0.1 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedStrategy === strategy.id 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{strategy.name}</h4>
                    <span className={`text-sm ${
                      strategy.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {strategy.profit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{strategy.trades} trades</span>
                    <span>Active</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Trades */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Active Trades</h3>
              <span className="text-xs text-gray-400">{trades.length} positions</span>
            </div>
            <div className="space-y-3">
              {trades.map((trade) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: trade.id * 0.1 }}
                  className="p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPairIcon(trade.pair)}
                      <div>
                        <h4 className="font-medium">{trade.pair}</h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <span className={trade.type === 'long' ? 'text-green-400' : 'text-red-400'}>
                            {trade.type.toUpperCase()}
                          </span>
                          <span>Entry: ${trade.entry.toLocaleString()}</span>
                          <span>Current: ${trade.current.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        trade.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.profit}
                      </div>
                      <div className={`text-xs ${getStatusColor(trade.status)}`}>
                        {trade.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Performance Overview</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-white">
              <BarChart3 className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-white">
              <LineChart className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-white">
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <LineChart className="w-full h-full" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Play className="w-5 h-5 mx-auto mb-2 text-green-400" />
            <span className="text-sm">Start Bot</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Pause className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
            <span className="text-sm">Pause All</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <span className="text-sm">Configure</span>
          </button>
          <button className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-red-400" />
            <span className="text-sm">Emergency Stop</span>
          </button>
        </div>
      </div>
    </div>
  )
}