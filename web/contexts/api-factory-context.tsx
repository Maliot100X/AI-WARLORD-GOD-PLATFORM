'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ApiEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  status: 'generating' | 'ready' | 'error'
  url: string
  createdAt: string
  requests: number
}

interface WebsiteToApiJob {
  id: string
  url: string
  status: 'pending' | 'scraping' | 'analyzing' | 'generating' | 'completed' | 'failed'
  progress: number
  endpoints: number
  createdAt: string
  error?: string
}

interface ApiFactoryContextType {
  endpoints: ApiEndpoint[]
  jobs: WebsiteToApiJob[]
  isLoading: boolean
  generateApiFromWebsite: (url: string) => Promise<string>
  getEndpointDetails: (id: string) => ApiEndpoint | undefined
  deleteEndpoint: (id: string) => void
  testEndpoint: (id: string) => Promise<any>
}

const ApiFactoryContext = createContext<ApiFactoryContextType | undefined>(undefined)

const initialEndpoints: ApiEndpoint[] = [
  { id: '1', name: 'Get Products', method: 'GET', path: '/api/products', status: 'ready', url: 'https://api.example.com/products', createdAt: new Date(Date.now() - 86400000).toISOString(), requests: 1245 },
  { id: '2', name: 'Create User', method: 'POST', path: '/api/users', status: 'ready', url: 'https://api.example.com/users', createdAt: new Date(Date.now() - 43200000).toISOString(), requests: 342 },
  { id: '3', name: 'Update Order', method: 'PUT', path: '/api/orders/{id}', status: 'generating', url: 'https://api.example.com/orders/{id}', createdAt: new Date(Date.now() - 1800000).toISOString(), requests: 0 },
]

const initialJobs: WebsiteToApiJob[] = [
  { id: '1', url: 'https://example.com', status: 'completed', progress: 100, endpoints: 12, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', url: 'https://jsonplaceholder.typicode.com', status: 'generating', progress: 75, endpoints: 8, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', url: 'https://invalid-website.xyz', status: 'failed', progress: 0, endpoints: 0, createdAt: new Date(Date.now() - 1800000).toISOString(), error: 'Failed to fetch website' },
]

export function ApiFactoryProvider({ children }: { children: ReactNode }) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(initialEndpoints)
  const [jobs, setJobs] = useState<WebsiteToApiJob[]>(initialJobs)
  const [isLoading, setIsLoading] = useState(false)

  const generateApiFromWebsite = async (url: string): Promise<string> => {
    setIsLoading(true)
    
    const newJob: WebsiteToApiJob = {
      id: Date.now().toString(),
      url,
      status: 'pending',
      progress: 0,
      endpoints: 0,
      createdAt: new Date().toISOString(),
    }
    
    setJobs(prev => [newJob, ...prev])
    
    // Simulate API generation process
    const simulateProgress = () => {
      setJobs(prev => prev.map(job => {
        if (job.id === newJob.id) {
          if (job.progress < 100) {
            const newProgress = job.progress + 25
            let newStatus = job.status
            
            if (newProgress >= 100) {
              newStatus = 'completed'
              // Add generated endpoints
              const newEndpoints: ApiEndpoint[] = [
                { id: Date.now().toString(), name: 'Get Data', method: 'GET', path: '/api/data', status: 'ready', url: `https://api.warlord.com/${Date.now()}`, createdAt: new Date().toISOString(), requests: 0 },
                { id: (Date.now() + 1).toString(), name: 'Post Data', method: 'POST', path: '/api/data', status: 'ready', url: `https://api.warlord.com/${Date.now() + 1}`, createdAt: new Date().toISOString(), requests: 0 },
              ]
              setEndpoints(prev => [...newEndpoints, ...prev])
            } else if (newProgress >= 75) {
              newStatus = 'generating'
            } else if (newProgress >= 50) {
              newStatus = 'analyzing'
            } else if (newProgress >= 25) {
              newStatus = 'scraping'
            }
            
            return {
              ...job,
              status: newStatus,
              progress: newProgress,
              endpoints: newProgress >= 100 ? 2 : job.endpoints,
            }
          }
        }
        return job
      }))
    }
    
    // Simulate progress steps
    setTimeout(simulateProgress, 1000)
    setTimeout(simulateProgress, 2000)
    setTimeout(simulateProgress, 3000)
    setTimeout(simulateProgress, 4000)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
    
    return newJob.id
  }

  const getEndpointDetails = (id: string) => {
    return endpoints.find(endpoint => endpoint.id === id)
  }

  const deleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(endpoint => endpoint.id !== id))
  }

  const testEndpoint = async (id: string): Promise<any> => {
    const endpoint = getEndpointDetails(id)
    if (!endpoint) throw new Error('Endpoint not found')
    
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          endpoint: endpoint.path,
          method: endpoint.method,
          response: { message: 'Test successful', data: { id: 1, name: 'Test Item' } },
          timestamp: new Date().toISOString(),
        })
      }, 1000)
    })
  }

  return (
    <ApiFactoryContext.Provider value={{
      endpoints,
      jobs,
      isLoading,
      generateApiFromWebsite,
      getEndpointDetails,
      deleteEndpoint,
      testEndpoint,
    }}>
      {children}
    </ApiFactoryContext.Provider>
  )
}

export function useApiFactory() {
  const context = useContext(ApiFactoryContext)
  if (context === undefined) {
    throw new Error('useApiFactory must be used within an ApiFactoryProvider')
  }
  return context
}