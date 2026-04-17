'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrading } from '@/contexts/TradingContext'
import { useWebSocketContext } from '@/contexts/WebSocketContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Trading Strategies
const TRADING_STRATEGIES = [
  {
    id: 'momentum-sniper',
    name: 'Momentum Sniper',
    description: 'Catches momentum spikes before they explode',
    color: 'bg-red-500',
    profit: '+15.2%'
  },
  {
    id: 'volume-breakout',
    name: 'Volume Breakout',
    description: 'Trades unusual volume spikes',
    color: 'bg-blue-500',
    profit: '+12.8%'
  },
  {
    id: 'whale-hunter',
    name: 'Whale Hunter',
    description: 'Follows whale wallet movements',
    color: 'bg-purple-500',
    profit: '+22.1%'
  },
  {
    id: 'arbitrage-engine',
    name: 'Arbitrage Engine',
    description: 'Cross-DEX arbitrage opportunities',
    color: 'bg-green-500',
    profit: '+8.4%'
  },
  {
    id: 'pump-fun-sniper',
    name: 'Pump.fun Sniper',
    description: 'Early pump.fun token detection',
    color: 'bg-yellow-500',
    profit: '+45.7%'
  },
  {
    id: 'liquidity-sweep',
    name: 'Liquidity Sweep',
    description: 'Detects liquidity changes',
    color: 'bg-pink-500',
    profit: '+18.3%'
  },
  {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    description: 'AI pattern detection',
    color: 'bg-indigo-500',
    profit: '+13.9%'
  },
  {
    id: 'ai-prediction',
    name: 'AI Prediction',
    description: 'Machine learning predictions',
    color: 'bg-cyan-500',
    profit: '+28.5%'
  },
  {
    id: 'dex-arbitrage',
    name: 'DEX Arbitrage',
    description: 'Multi-DEX price differences',
    color: 'bg-orange-500',
    profit: '+11.2%'
  }
]

// Mock Trading Data
const mockTradingData = {
  totalProfit: 2847.32,
  dailyProfit: 342.18,
  winRate: 78.4,
  activeTrades: 12,
  totalTrades: 2847,
  bestStrategy: 'pump-fun-sniper',
  bestStrategyProfit: '+45.7%'
}

export default function TradingWarMachine() {
  const [activeStrategy, setActiveStrategy] = useState('all')
  const [tradingMode, setTradingMode] = useState<'manual' | 'auto'>('auto')
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'extreme'>('medium')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { state: tradingState, dispatch: updateTradingState } = useTrading()
  const { socket, addListener, sendMessage } = useWebSocketContext()

  useEffect(() => {
    // Listen for trading updates
    if (socket) {
      addListener('trading-update', (data) => {
        updateTradingState(data)
      })
    }
  }, [socket, updateTradingState])

  const filteredStrategies = activeStrategy === 'all' 
    ? TRADING_STRATEGIES 
    : TRADING_STRATEGIES.filter(s => s.id === activeStrategy)

  const startStrategy = (strategyId: string) => {
    // Emit strategy start event
    if (socket) {
      sendMessage({
        type: 'start-strategy',
        data: { strategyId, riskLevel }
      })
    }
  }

  const stopStrategy = (strategyId: string) => {
    if (socket) {
      sendMessage({
        type: 'stop-strategy',
        data: { strategyId }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Trading Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Total Profit</div>
          <div className="text-2xl font-bold text-white">${mockTradingData.totalProfit.toLocaleString()}</div>
          <div className="text-green-400 text-xs">+{mockTradingData.dailyProfit.toFixed(2)} today</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Win Rate</div>
          <div className="text-2xl font-bold text-white">{mockTradingData.winRate}%</div>
          <div className="text-blue-400 text-xs">{mockTradingData.activeTrades} active trades</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Total Trades</div>
          <div className="text-2xl font-bold text-white">{mockTradingData.totalTrades.toLocaleString()}</div>
          <div className="text-purple-400 text-xs">All time</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border-yellow-500/30">
          <div className="text-yellow-400 text-sm">Best Strategy</div>
          <div className="text-lg font-bold text-white">{TRADING_STRATEGIES.find(s => s.id === mockTradingData.bestStrategy)?.name}</div>
          <div className="text-yellow-400 text-xs">{mockTradingData.bestStrategyProfit}</div>
        </Card>
      </div>

      {/* Trading Controls */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Trading War Machine</h2>
            <Badge variant={tradingMode === 'auto' ? 'success' : 'warning'}>
              {tradingMode === 'auto' ? 'AUTO TRADING' : 'MANUAL TRADING'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as any)}
              className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="extreme">Extreme Risk</option>
            </select>
            
            <Button
              variant={tradingMode === 'auto' ? 'danger' : 'success'}
              onClick={() => setTradingMode(tradingMode === 'auto' ? 'manual' : 'auto')}
            >
              {tradingMode === 'auto' ? 'Stop Auto' : 'Start Auto'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </Button>
          </div>
        </div>

        {/* Strategy Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeStrategy === 'all' ? 'primary' : 'ghost'}
            onClick={() => setActiveStrategy('all')}
            size="sm"
          >
            All Strategies
          </Button>
          {TRADING_STRATEGIES.map((strategy) => (
            <Button
              key={strategy.id}
              variant={activeStrategy === strategy.id ? 'primary' : 'ghost'}
              onClick={() => setActiveStrategy(strategy.id)}
              size="sm"
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${strategy.color}`} />
              {strategy.name}
            </Button>
          ))}
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredStrategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${strategy.color}`} />
                      <h3 className="font-bold text-white">{strategy.name}</h3>
                    </div>
                    <Badge variant="success">{strategy.profit}</Badge>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{strategy.description}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => startStrategy(strategy.id)}
                      disabled={tradingMode !== 'auto'}
                    >
                      Start
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => stopStrategy(strategy.id)}
                    >
                      Stop
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      Config
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Advanced Panel */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced Trading Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Max Position Size (SOL)</label>
                <input 
                  type="number" 
                  defaultValue="10"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Stop Loss (%)</label>
                <input 
                  type="number" 
                  defaultValue="5"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Take Profit (%)</label>
                <input 
                  type="number" 
                  defaultValue="15"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Max Concurrent Trades</label>
                <input 
                  type="number" 
                  defaultValue="5"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Blacklisted Tokens (comma separated)</label>
              <input 
                type="text" 
                placeholder="TOKEN1,TOKEN2,TOKEN3"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
              />
            </div>
          </motion.div>
        )}
      </Card>

      {/* Active Trades */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Active Trades</h3>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{i}</span>
                </div>
                <div>
                  <div className="font-bold text-white">TOKEN_{i}</div>
                  <div className="text-sm text-gray-400">Pump.fun Sniper</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-green-400 font-bold">+{Math.random() * 10 + 5}%</div>
                <div className="text-sm text-gray-400">{Math.floor(Math.random() * 5 + 1)}m ago</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}