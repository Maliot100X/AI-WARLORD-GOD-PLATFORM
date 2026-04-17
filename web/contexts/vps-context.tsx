'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface VPSInstance {
  id: string
  name: string
  provider: 'DigitalOcean' | 'AWS' | 'Google Cloud' | 'Vultr' | 'Linode'
  region: string
  status: 'running' | 'stopped' | 'error' | 'deploying'
  cpu: number
  memory: number
  storage: number
  ip: string
  cost: number
  deployedAt: string
  agentCount: number
}

interface DeploymentTask {
  id: string
  instanceId: string
  type: 'create' | 'scale' | 'deploy_agent' | 'destroy'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  createdAt: string
  error?: string
}

interface VPSContextType {
  instances: VPSInstance[]
  tasks: DeploymentTask[]
  isLoading: boolean
  totalCost: number
  totalInstances: number
  createInstance: (config: Omit<VPSInstance, 'id' | 'status' | 'deployedAt' | 'agentCount'>) => Promise<string>
  deployAgent: (instanceId: string, agentType: string) => Promise<string>
  scaleInstance: (instanceId: string, cpu: number, memory: number) => Promise<string>
  destroyInstance: (instanceId: string) => Promise<void>
  getInstanceStats: (instanceId: string) => VPSInstance | undefined
}

const VPSContext = createContext<VPSContextType | undefined>(undefined)

const initialInstances: VPSInstance[] = [
  { id: '1', name: 'Warlord-USA-1', provider: 'DigitalOcean', region: 'NYC1', status: 'running', cpu: 4, memory: 8, storage: 100, ip: '192.168.1.100', cost: 40, deployedAt: new Date(Date.now() - 86400000).toISOString(), agentCount: 3 },
  { id: '2', name: 'Warlord-EU-1', provider: 'AWS', region: 'Frankfurt', status: 'running', cpu: 8, memory: 16, storage: 200, ip: '10.0.0.42', cost: 85, deployedAt: new Date(Date.now() - 43200000).toISOString(), agentCount: 5 },
  { id: '3', name: 'Warlord-ASIA-1', provider: 'Google Cloud', region: 'Tokyo', status: 'deploying', cpu: 2, memory: 4, storage: 50, ip: '172.16.0.10', cost: 25, deployedAt: new Date(Date.now() - 1800000).toISOString(), agentCount: 0 },
  { id: '4', name: 'Warlord-AUS-1', provider: 'Vultr', region: 'Sydney', status: 'stopped', cpu: 4, memory: 8, storage: 100, ip: '203.0.113.5', cost: 40, deployedAt: new Date(Date.now() - 7200000).toISOString(), agentCount: 2 },
]

const initialTasks: DeploymentTask[] = [
  { id: '1', instanceId: '3', type: 'create', status: 'running', progress: 65, createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: '2', instanceId: '1', type: 'deploy_agent', status: 'completed', progress: 100, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', instanceId: '2', type: 'scale', status: 'failed', progress: 0, createdAt: new Date(Date.now() - 5400000).toISOString(), error: 'Insufficient quota' },
]

export function VPSProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<VPSInstance[]>(initialInstances)
  const [tasks, setTasks] = useState<DeploymentTask[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(false)

  const totalCost = instances.reduce((sum, instance) => sum + instance.cost, 0)
  const totalInstances = instances.length

  const createInstance = async (config: Omit<VPSInstance, 'id' | 'status' | 'deployedAt' | 'agentCount'>): Promise<string> => {
    setIsLoading(true)
    
    const newInstance: VPSInstance = {
      ...config,
      id: Date.now().toString(),
      status: 'deploying',
      deployedAt: new Date().toISOString(),
      agentCount: 0,
    }
    
    setInstances(prev => [newInstance, ...prev])
    
    const newTask: DeploymentTask = {
      id: Date.now().toString(),
      instanceId: newInstance.id,
      type: 'create',
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate deployment
    const simulateDeployment = () => {
      setTasks(prev => prev.map(task => {
        if (task.id === newTask.id && task.progress < 100) {
          const newProgress = task.progress + 25
          const newStatus = newProgress >= 100 ? 'completed' : 'running'
          
          // Update instance status when deployment completes
          if (newProgress >= 100) {
            setInstances(prevInstances => prevInstances.map(instance => 
              instance.id === newInstance.id ? { ...instance, status: 'running' } : instance
            ))
          }
          
          return { ...task, progress: newProgress, status: newStatus }
        }
        return task
      }))
    }
    
    setTimeout(simulateDeployment, 1000)
    setTimeout(simulateDeployment, 2000)
    setTimeout(simulateDeployment, 3000)
    setTimeout(simulateDeployment, 4000)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
    
    return newInstance.id
  }

  const deployAgent = async (instanceId: string, agentType: string): Promise<string> => {
    setIsLoading(true)
    
    const newTask: DeploymentTask = {
      id: Date.now().toString(),
      instanceId,
      type: 'deploy_agent',
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate agent deployment
    const simulateDeployment = () => {
      setTasks(prev => prev.map(task => {
        if (task.id === newTask.id && task.progress < 100) {
          const newProgress = task.progress + 33
          const newStatus = newProgress >= 100 ? 'completed' : 'running'
          
          // Update agent count when deployment completes
          if (newProgress >= 100) {
            setInstances(prevInstances => prevInstances.map(instance => 
              instance.id === instanceId ? { ...instance, agentCount: instance.agentCount + 1 } : instance
            ))
          }
          
          return { ...task, progress: newProgress, status: newStatus }
        }
        return task
      }))
    }
    
    setTimeout(simulateDeployment, 1000)
    setTimeout(simulateDeployment, 2000)
    setTimeout(simulateDeployment, 3000)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 4000)
    
    return newTask.id
  }

  const scaleInstance = async (instanceId: string, cpu: number, memory: number): Promise<string> => {
    setIsLoading(true)
    
    const newTask: DeploymentTask = {
      id: Date.now().toString(),
      instanceId,
      type: 'scale',
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate scaling
    const simulateScaling = () => {
      setTasks(prev => prev.map(task => {
        if (task.id === newTask.id && task.progress < 100) {
          const newProgress = task.progress + 50
          const newStatus = newProgress >= 100 ? 'completed' : 'running'
          
          // Update instance specs when scaling completes
          if (newProgress >= 100) {
            setInstances(prevInstances => prevInstances.map(instance => 
              instance.id === instanceId ? { ...instance, cpu, memory } : instance
            ))
          }
          
          return { ...task, progress: newProgress, status: newStatus }
        }
        return task
      }))
    }
    
    setTimeout(simulateScaling, 1000)
    setTimeout(simulateScaling, 2000)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    
    return newTask.id
  }

  const destroyInstance = async (instanceId: string): Promise<void> => {
    setIsLoading(true)
    
    const newTask: DeploymentTask = {
      id: Date.now().toString(),
      instanceId,
      type: 'destroy',
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate destruction
    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.id === newTask.id ? { ...task, progress: 100, status: 'completed' } : task
      ))
      
      // Remove instance
      setInstances(prev => prev.filter(instance => instance.id !== instanceId))
      
      setIsLoading(false)
    }, 3000)
  }

  const getInstanceStats = (instanceId: string): VPSInstance | undefined => {
    return instances.find(instance => instance.id === instanceId)
  }

  return (
    <VPSContext.Provider value={{
      instances,
      tasks,
      isLoading,
      totalCost,
      totalInstances,
      createInstance,
      deployAgent,
      scaleInstance,
      destroyInstance,
      getInstanceStats,
    }}>
      {children}
    </VPSContext.Provider>
  )
}

export function useVPS() {
  const context = useContext(VPSContext)
  if (context === undefined) {
    throw new Error('useVPS must be used within a VPSProvider')
  }
  return context
}