'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Trade {
  id: string
  pair: string
  type: 'long' | 'short'
  entry: number
  current: number
  profit: string
  status: 'open' | 'closed' | 'pending'
  strategy: string
}

interface TradingContextType {
  trades: Trade[]
  isTrading: boolean
  stats: {
    totalProfit: number
    winRate: number
    activeTrades: number
    dailyVolume: number
  }
  addTrade: (trade: Omit<Trade, 'id'>) => void
  removeTrade: (id: string) => void
  updateTrade: (id: string, updates: Partial<Trade>) => void
  startTrading: () => void
  stopTrading: () => void
  executeTrade: (tradeData: Omit<Trade, 'id'>) => void
}

const TradingContext = createContext<TradingContextType>({
  trades: [],
  isTrading: false,
  stats: {
    totalProfit: 0,
    winRate: 0,
    activeTrades: 0,
    dailyVolume: 0
  },
  addTrade: () => {},
  removeTrade: () => {},
  updateTrade: () => {},
  startTrading: () => {},
  stopTrading: () => {},
  executeTrade: () => {}
})

export function TradingProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isTrading, setIsTrading] = useState(false)
  const [stats, setStats] = useState({
    totalProfit: 2847.56,
    winRate: 78.5,
    activeTrades: 12,
    dailyVolume: 125678.90
  })

  const addTrade = (tradeData: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString()
    }
    setTrades(prev => [...prev, newTrade])
    updateStats()
  }

  const removeTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id))
    updateStats()
  }

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(prev => 
      prev.map(trade => 
        trade.id === id ? { ...trade, ...updates } : trade
      )
    )
    updateStats()
  }

  const startTrading = () => {
    setIsTrading(true)
  }

  const stopTrading = () => {
    setIsTrading(false)
  }

  const executeTrade = (tradeData: Omit<Trade, 'id'>) => {
    if (!isTrading) return
    
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString()
    }
    setTrades(prev => [...prev, newTrade])
    updateStats()
  }

  const updateStats = () => {
    const activeTrades = trades.filter(t => t.status === 'open').length
    const totalProfit = trades.reduce((sum, trade) => {
      const profitPercent = parseFloat(trade.profit.replace('%', ''))
      const profitAmount = (trade.entry * profitPercent) / 100
      return sum + profitAmount
    }, 0)
    
    const closedTrades = trades.filter(t => t.status === 'closed')
    const winRate = closedTrades.length > 0 
      ? (closedTrades.filter(t => parseFloat(t.profit) > 0).length / closedTrades.length) * 100
      : 0

    setStats(prev => ({
      ...prev,
      totalProfit,
      winRate,
      activeTrades
    }))
  }

  // Initialize with mock trades
  useEffect(() => {
    const mockTrades: Trade[] = [
      {
        id: '1',
        pair: 'SOL/USDC',
        type: 'long',
        entry: 145.23,
        current: 148.67,
        profit: '+2.37%',
        status: 'open',
        strategy: 'scalping'
      },
      {
        id: '2',
        pair: 'BTC/USDC',
        type: 'short',
        entry: 67890,
        current: 67234,
        profit: '+0.97%',
        status: 'open',
        strategy: 'swing'
      },
      {
        id: '3',
        pair: 'ETH/USDC',
        type: 'long',
        entry: 3456,
        current: 3523,
        profit: '+1.94%',
        status: 'closed',
        strategy: 'arbitrage'
      }
    ]
    setTrades(mockTrades)
  }, [])

  return (
    <TradingContext.Provider value={{
      trades,
      isTrading,
      stats,
      addTrade,
      removeTrade,
      updateTrade,
      startTrading,
      stopTrading,
      executeTrade
    }}>
      {children}
    </TradingContext.Provider>
  )
}

export const useTrading = () => {
  const context = useContext(TradingContext)
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider')
  }
  return context
}