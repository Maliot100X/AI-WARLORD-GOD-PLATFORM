'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// WebSocket State Types
type WebSocketState = {
  connected: boolean
  connecting: boolean
  error: string | null
  lastMessage: any
  connectionCount: number
  reconnectAttempts: number
}

// Context
type WebSocketContextType = {
  socket: WebSocket | null
  wsState: WebSocketState
  connect: () => void
  disconnect: () => void
  sendMessage: (message: any) => void
  addListener: (event: string, callback: (data: any) => void) => void
  removeListener: (event: string, callback: (data: any) => void) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

// Provider
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [wsState, setWsState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastMessage: null,
    connectionCount: 0,
    reconnectAttempts: 0
  })
  const [listeners] = useState<Map<string, Set<(data: any) => void>>>(new Map())
  const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null)

  const connect = () => {
    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
      return
    }

    setWsState(prev => ({ ...prev, connecting: true, error: null }))

    try {
      // In development, we'll simulate WebSocket
      if (process.env.NODE_ENV === 'development') {
        // Simulate WebSocket connection
        setTimeout(() => {
          setWsState(prev => ({
            ...prev,
            connected: true,
            connecting: false,
            connectionCount: prev.connectionCount + 1,
            reconnectAttempts: 0
          }))
          
          // Start simulated real-time updates
          startSimulatedUpdates()
        }, 1000)
        return
      }

      // Real WebSocket connection for production
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')
      
      ws.onopen = () => {
        setWsState(prev => ({
          ...prev,
          connected: true,
          connecting: false,
          connectionCount: prev.connectionCount + 1,
          reconnectAttempts: 0
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setWsState(prev => ({ ...prev, lastMessage: data }))
          
          // Emit to listeners
          const callbacks = listeners.get(data.type)
          if (callbacks) {
            callbacks.forEach(callback => callback(data))
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        setWsState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          connecting: false
        }))
      }

      ws.onclose = () => {
        setWsState(prev => ({
          ...prev,
          connected: false,
          connecting: false
        }))
        
        // Auto-reconnect
        if (wsState.reconnectAttempts < 5) {
          const timer = setTimeout(() => {
            setWsState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }))
            connect()
          }, Math.pow(2, wsState.reconnectAttempts) * 1000)
          setReconnectTimer(timer)
        }
      }

      setSocket(ws)
    } catch (error) {
      setWsState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        connecting: false
      }))
    }
  }

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      setReconnectTimer(null)
    }

    if (socket) {
      socket.close()
      setSocket(null)
    }

    setWsState(prev => ({
      ...prev,
      connected: false,
      connecting: false,
      reconnectAttempts: 0
    }))
  }

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }

  const addListener = (event: string, callback: (data: any) => void) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    listeners.get(event)!.add(callback)
  }

  const removeListener = (event: string, callback: (data: any) => void) => {
    const callbacks = listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        listeners.delete(event)
      }
    }
  }

  const startSimulatedUpdates = () => {
    // Simulate real-time updates in development
    const updates = [
      { type: 'agent-update', payload: { agentId: '1', status: 'active', cpu: 45 } },
      { type: 'trading-update', payload: { profit: 15.2, trades: 42 } },
      { type: 'system-update', payload: { memory: 67, disk: 34 } },
      { type: 'vps-update', payload: { instanceId: '1', status: 'deploying' } }
    ]

    const interval = setInterval(() => {
      const update = updates[Math.floor(Math.random() * updates.length)]
      
      // Emit to listeners
      const callbacks = listeners.get(update.type)
      if (callbacks) {
        callbacks.forEach(callback => callback(update))
      }
    }, 3000)

    return () => clearInterval(interval)
  }

  useEffect(() => {
    // Auto-connect on mount
    connect()

    return () => {
      disconnect()
    }
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        wsState,
        connect,
        disconnect,
        sendMessage,
        addListener,
        removeListener
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

// Hook
export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}