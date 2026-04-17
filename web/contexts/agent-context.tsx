'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Agent {
  id: string
  name: string
  type: string
  status: 'running' | 'idle' | 'stopped' | 'error'
  uptime: string
  tasks: number
  success: string
}

interface AgentContextType {
  agents: Agent[]
  selectedAgent: Agent | null
  addAgent: (agent: Omit<Agent, 'id'>) => void
  removeAgent: (id: string) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  selectAgent: (agent: Agent) => void
  startAgent: (id: string) => void
  stopAgent: (id: string) => void
  restartAgent: (id: string) => void
}

const AgentContext = createContext<AgentContextType>({
  agents: [],
  selectedAgent: null,
  addAgent: () => {},
  removeAgent: () => {},
  updateAgent: () => {},
  selectAgent: () => {},
  startAgent: () => {},
  stopAgent: () => {},
  restartAgent: () => {}
})

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const addAgent = (agentData: Omit<Agent, 'id'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: Date.now().toString()
    }
    setAgents(prev => [...prev, newAgent])
  }

  const removeAgent = (id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id))
    if (selectedAgent?.id === id) {
      setSelectedAgent(null)
    }
  }

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === id ? { ...agent, ...updates } : agent
      )
    )
    if (selectedAgent?.id === id) {
      setSelectedAgent(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const selectAgent = (agent: Agent) => {
    setSelectedAgent(agent)
  }

  const startAgent = (id: string) => {
    updateAgent(id, { status: 'running', uptime: '0h 0m' })
  }

  const stopAgent = (id: string) => {
    updateAgent(id, { status: 'stopped', uptime: '0h 0m' })
  }

  const restartAgent = (id: string) => {
    updateAgent(id, { status: 'running', uptime: '0h 0m' })
  }

  // Initialize with mock agents
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Trading Agent Alpha',
        type: 'trading',
        status: 'running',
        uptime: '2h 34m',
        tasks: 142,
        success: '98.2%'
      },
      {
        id: '2',
        name: 'GitHub Agent',
        type: 'development',
        status: 'idle',
        uptime: '0h 0m',
        tasks: 89,
        success: '94.7%'
      },
      {
        id: '3',
        name: 'API Monitor',
        type: 'monitoring',
        status: 'running',
        uptime: '5d 12h',
        tasks: 2156,
        success: '99.8%'
      }
    ]
    setAgents(mockAgents)
  }, [])

  return (
    <AgentContext.Provider value={{
      agents,
      selectedAgent,
      addAgent,
      removeAgent,
      updateAgent,
      selectAgent,
      startAgent,
      stopAgent,
      restartAgent
    }}>
      {children}
    </AgentContext.Provider>
  )
}

export const useAgent = () => {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider')
  }
  return context
}