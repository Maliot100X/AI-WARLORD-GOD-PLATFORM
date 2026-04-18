'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'

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
  const listeners = useRef<Map<string, Set<(data: any) => void>>>(new Map())
  const reconnectAttempts = useRef(0)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)

  const startSimulatedUpdates = useCallback(() => {
    const updates = [
      { type: 'agent-update', payload: { agentId: '1', status: 'active', cpu: 45 } },
      { type: 'trading-update', payload: { profit: 15.2, trades: 42 } },
      { type: 'system-update', payload: { memory: 67, disk: 34 } },
      { type: 'vps-update', payload: { instanceId: '1', status: 'deploying' } },
    ]

    const interval = setInterval(() => {
      const update = updates[Math.floor(Math.random() * updates.length)]
      const callbacks = listeners.current.get(update.type)
      if (callbacks) {
        callbacks.forEach((cb) => cb(update))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const connect = useCallback(() => {
    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
      return
    }

    setWsState((prev) => ({ ...prev, connecting: true, error: null }))

    try {
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          reconnectAttempts.current = 0
          setWsState((prev) => ({
            ...prev,
            connected: true,
            connecting: false,
            connectionCount: prev.connectionCount + 1,
            reconnectAttempts: 0,
          }))
          startSimulatedUpdates()
        }, 800)
        return
      }

      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')

      ws.onopen = () => {
        reconnectAttempts.current = 0
        setWsState((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          connectionCount: prev.connectionCount + 1,
          reconnectAttempts: 0,
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setWsState((prev) => ({ ...prev, lastMessage: data }))
          const callbacks = listeners.current.get(data.type)
          if (callbacks) {
            callbacks.forEach((cb) => cb(data))
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.onerror = () => {
        setWsState((prev) => ({ ...prev, error: 'WebSocket connection error', connecting: false }))
      }

      ws.onclose = () => {
        setWsState((prev) => ({ ...prev, connected: false, connecting: false }))
        const attempts = reconnectAttempts.current
        if (attempts < 5) {
          reconnectAttempts.current = attempts + 1
          setWsState((prev) => ({ ...prev, reconnectAttempts: reconnectAttempts.current }))
          const delay = Math.pow(2, attempts) * 1000
          reconnectTimer.current = setTimeout(() => connect(), delay)
        }
      }

      setSocket(ws)
    } catch (err) {
      setWsState((prev) => ({ ...prev, error: 'Failed to create WebSocket connection', connecting: false }))
    }
  }, [socket, startSimulatedUpdates])

  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }
    if (socket) {
      socket.close()
      setSocket(null)
    }
    reconnectAttempts.current = 0
    setWsState((prev) => ({ ...prev, connected: false, connecting: false, reconnectAttempts: 0 }))
  }, [socket])

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, cannot send message')
    }
  }, [socket])

  const addListener = useCallback((event: string, callback: (data: any) => void) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set())
    }
    listeners.current.get(event)!.add(callback)
  }, [])

  const removeListener = useCallback((event: string, callback: (data: any) => void) => {
    const callbacks = listeners.current.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        listeners.current.delete(event)
      }
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
