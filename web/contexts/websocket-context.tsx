'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WebSocketContextType {
  socket: WebSocket | null
  isConnected: boolean
  lastMessage: any
  sendMessage: (message: any) => void
  connect: () => void
  disconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {},
  connect: () => {},
  disconnect: () => {}
})

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)

  const connect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setLastMessage(message)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      // Auto-reconnect after 5 seconds
      setTimeout(connect, 5000)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setSocket(ws)
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
      setSocket(null)
      setIsConnected(false)
    }
  }

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }

  useEffect(() => {
    connect()
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{
      socket,
      isConnected,
      lastMessage,
      sendMessage,
      connect,
      disconnect
    }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}