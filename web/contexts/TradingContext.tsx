'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Trading Types
type TradingStats = {
  totalProfit: number
  dailyProfit: number
  successRate: number
  totalTrades: number
  activeTrades: number
  winRate: number
}

type Position = {
  id: string
  symbol: string
  type: 'long' | 'short'
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  status: 'open' | 'closed'
  strategy: string
  openedAt: string
  closedAt?: string
}

type Trade = {
  id: string
  symbol: string
  type: 'long' | 'short'
  size: number
  entryPrice: number
  exitPrice: number
  pnl: number
  pnlPercent: number
  status: 'closed'
  strategy: string
  openedAt: string
  closedAt: string
}

type Signal = {
  id: string
  symbol: string
  type: 'long' | 'short'
  strength: number
  confidence: number
  strategy: string
  reason: string
  createdAt: string
}

type TradingState = {
  stats: TradingStats
  positions: Position[]
  history: Trade[]
  signals: Signal[]
  loading: boolean
  error: string | null
  selectedPosition: Position | null
}

type TradingAction =
  | { type: 'SET_STATS'; payload: TradingStats }
  | { type: 'SET_POSITIONS'; payload: Position[] }
  | { type: 'SET_HISTORY'; payload: Trade[] }
  | { type: 'SET_SIGNALS'; payload: Signal[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_POSITION'; payload: Position | null }
  | { type: 'ADD_POSITION'; payload: Position }
  | { type: 'UPDATE_POSITION'; payload: Position }
  | { type: 'CLOSE_POSITION'; payload: Trade }
  | { type: 'ADD_SIGNAL'; payload: Signal }
  | { type: 'EXECUTE_SIGNAL'; payload: string }

const initialState: TradingState = {
  stats: {
    totalProfit: 0,
    dailyProfit: 0,
    successRate: 0,
    totalTrades: 0,
    activeTrades: 0,
    winRate: 0
  },
  positions: [],
  history: [],
  signals: [],
  loading: false,
  error: null,
  selectedPosition: null
}

function tradingReducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_POSITIONS':
      return { ...state, positions: action.payload }
    case 'SET_HISTORY':
      return { ...state, history: action.payload }
    case 'SET_SIGNALS':
      return { ...state, signals: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SELECT_POSITION':
      return { ...state, selectedPosition: action.payload }
    case 'ADD_POSITION':
      return { ...state, positions: [action.payload, ...state.positions] }
    case 'UPDATE_POSITION':
      return {
        ...state,
        positions: state.positions.map(pos =>
          pos.id === action.payload.id ? action.payload : pos
        )
      }
    case 'CLOSE_POSITION':
      return {
        ...state,
        positions: state.positions.filter(pos => pos.id !== action.payload.id),
        history: [action.payload, ...state.history]
      }
    case 'ADD_SIGNAL':
      return { ...state, signals: [action.payload, ...state.signals] }
    case 'EXECUTE_SIGNAL':
      return {
        ...state,
        signals: state.signals.filter(signal => signal.id !== action.payload)
      }
    default:
      return state
  }
}

type TradingContextType = {
  state: TradingState
  dispatch: React.Dispatch<TradingAction>
  fetchStats: () => Promise<void>
  fetchPositions: (status?: string) => Promise<void>
  fetchHistory: (limit?: number, offset?: number) => Promise<void>
  fetchSignals: (strategy?: string) => Promise<void>
  openPosition: (position: Omit<Position, 'id' | 'openedAt' | 'pnl' | 'pnlPercent'>) => Promise<void>
  closePosition: (positionId: string, price: number) => Promise<void>
  executeSignal: (signalId: string) => Promise<void>
  updatePrices: () => Promise<void>
}

const TradingContext = createContext<TradingContextType | undefined>(undefined)

export function TradingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState)

  const fetchStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/trading?type=stats')
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_STATS', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch trading stats' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchPositions = async (status?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const url = status ? `/api/trading?type=positions&status=${status}` : '/api/trading?type=positions'
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_POSITIONS', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch positions' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchHistory = async (limit = 50, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/trading?type=history&limit=${limit}&offset=${offset}`)
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_HISTORY', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch trading history' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchSignals = async (strategy?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const url = strategy ? `/api/trading?type=signals&strategy=${strategy}` : '/api/trading?type=signals'
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_SIGNALS', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch trading signals' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const openPosition = async (positionData: Omit<Position, 'id' | 'openedAt' | 'pnl' | 'pnlPercent'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'open-position',
          ...positionData,
          price: positionData.entryPrice
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const newPosition: Position = {
          ...positionData,
          id: data.data.id,
          openedAt: data.data.openedAt,
          pnl: 0,
          pnlPercent: 0
        }
        dispatch({ type: 'ADD_POSITION', payload: newPosition })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to open position' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const closePosition = async (positionId: string, price: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const position = state.positions.find(p => p.id === positionId)
      
      if (!position) {
        dispatch({ type: 'SET_ERROR', payload: 'Position not found' })
        return
      }
      
      const pnl = position.type === 'long'
        ? (price - position.entryPrice) * position.size
        : (position.entryPrice - price) * position.size
      
      const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100
      
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'close-position',
          positionId,
          price,
          pnl,
          pnlPercent
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const closedTrade: Trade = {
          ...position,
          exitPrice: price,
          pnl,
          pnlPercent,
          status: 'closed',
          closedAt: new Date().toISOString()
        }
        dispatch({ type: 'CLOSE_POSITION', payload: closedTrade })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to close position' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const executeSignal = async (signalId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute-signal',
          signalId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'EXECUTE_SIGNAL', payload: signalId })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to execute signal' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updatePrices = async () => {
    try {
      // Simulate price updates
      const updatedPositions = state.positions.map(position => {
        const priceChange = (Math.random() - 0.5) * 0.02 // ±1% change
        const newPrice = position.currentPrice * (1 + priceChange)
        const pnl = position.type === 'long'
          ? (newPrice - position.entryPrice) * position.size
          : (position.entryPrice - newPrice) * position.size
        const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100
        
        return {
          ...position,
          currentPrice: newPrice,
          pnl,
          pnlPercent
        }
      })
      
      dispatch({ type: 'SET_POSITIONS', payload: updatedPositions })
    } catch (error) {
      console.error('Failed to update prices:', error)
    }
  }

  return (
    <TradingContext.Provider
      value={{
        state,
        dispatch,
        fetchStats,
        fetchPositions,
        fetchHistory,
        fetchSignals,
        openPosition,
        closePosition,
        executeSignal,
        updatePrices
      }}
    >
      {children}
    </TradingContext.Provider>
  )
}

export function useTrading() {
  const context = useContext(TradingContext)
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider')
  }
  return context
}