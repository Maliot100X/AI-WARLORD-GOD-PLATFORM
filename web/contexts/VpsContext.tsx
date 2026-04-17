'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// VPS State Types
type VpsState = {
  instances: Array<{
    id: string
    name: string
    provider: string
    region: string
    ip: string
    status: 'active' | 'deploying' | 'stopped' | 'error'
    agents: number
    cpu: number
    memory: number
    uptime: string
  }>
  providers: Array<{
    id: string
    name: string
    description: string
    icon: string
    color: string
    regions: string[]
  }>
  stats: {
    totalInstances: number
    activeAgents: number
    totalRegions: number
    averageUptime: string
  }
  loading: boolean
  error: string | null
}

type VpsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INSTANCES'; payload: VpsState['instances'] }
  | { type: 'SET_PROVIDERS'; payload: VpsState['providers'] }
  | { type: 'SET_STATS'; payload: VpsState['stats'] }
  | { type: 'UPDATE_INSTANCE'; payload: Partial<VpsState['instances'][0]> & { id: string } }
  | { type: 'ADD_INSTANCE'; payload: VpsState['instances'][0] }
  | { type: 'REMOVE_INSTANCE'; payload: string }
  | { type: 'RESET' }

const initialState: VpsState = {
  instances: [],
  providers: [],
  stats: {
    totalInstances: 0,
    activeAgents: 0,
    totalRegions: 0,
    averageUptime: '0%'
  },
  loading: false,
  error: null
}

function vpsReducer(state: VpsState, action: VpsAction): VpsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_INSTANCES':
      return { ...state, instances: action.payload, loading: false }
    case 'SET_PROVIDERS':
      return { ...state, providers: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'UPDATE_INSTANCE':
      return {
        ...state,
        instances: state.instances.map(instance =>
          instance.id === action.payload.id
            ? { ...instance, ...action.payload }
            : instance
        )
      }
    case 'ADD_INSTANCE':
      return {
        ...state,
        instances: [action.payload, ...state.instances]
      }
    case 'REMOVE_INSTANCE':
      return {
        ...state,
        instances: state.instances.filter(instance => instance.id !== action.payload)
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// Context
type VpsContextType = {
  vpsState: VpsState
  updateVpsState: (action: VpsAction) => void
  deployVps: (config: { provider: string; name: string; region: string; size: string }) => Promise<void>
  stopVps: (id: string) => Promise<void>
  restartVps: (id: string) => Promise<void>
  destroyVps: (id: string) => Promise<void>
}

const VpsContext = createContext<VpsContextType | undefined>(undefined)

// Provider
export function VpsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(vpsReducer, initialState)

  const updateVpsState = (action: VpsAction) => {
    dispatch(action)
  }

  const deployVps = async (config: { provider: string; name: string; region: string; size: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newInstance = {
        id: Date.now().toString(),
        name: config.name,
        provider: config.provider,
        region: config.region,
        ip: 'Deploying...',
        status: 'deploying' as const,
        agents: 0,
        cpu: 0,
        memory: 0,
        uptime: 'Just created'
      }
      
      dispatch({ type: 'ADD_INSTANCE', payload: newInstance })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to deploy VPS instance' })
    }
  }

  const stopVps = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ 
        type: 'UPDATE_INSTANCE', 
        payload: { id, status: 'stopped' as const } 
      })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to stop VPS instance' })
    }
  }

  const restartVps = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      dispatch({ 
        type: 'UPDATE_INSTANCE', 
        payload: { id, status: 'active' as const } 
      })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to restart VPS instance' })
    }
  }

  const destroyVps = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ type: 'REMOVE_INSTANCE', payload: id })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to destroy VPS instance' })
    }
  }

  return (
    <VpsContext.Provider
      value={{
        vpsState: state,
        updateVpsState,
        deployVps,
        stopVps,
        restartVps,
        destroyVps
      }}
    >
      {children}
    </VpsContext.Provider>
  )
}

// Hook
export function useVpsContext() {
  const context = useContext(VpsContext)
  if (context === undefined) {
    throw new Error('useVpsContext must be used within a VpsProvider')
  }
  return context
}