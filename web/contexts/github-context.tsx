'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Repository {
  id: string
  name: string
  owner: string
  url: string
  stars: number
  forks: number
  issues: number
  lastUpdated: string
  status: 'analyzing' | 'optimizing' | 'ready' | 'error'
}

interface PullRequest {
  id: string
  title: string
  repo: string
  number: number
  status: 'open' | 'merged' | 'closed'
  createdAt: string
  changes: { files: number; additions: number; deletions: number }
}

interface GitHubTask {
  id: string
  type: 'code_review' | 'bug_fix' | 'feature_add' | 'optimization'
  repo: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  createdAt: string
  result?: string
}

interface GitHubContextType {
  repositories: Repository[]
  pullRequests: PullRequest[]
  tasks: GitHubTask[]
  isLoading: boolean
  analyzeRepository: (repoUrl: string) => Promise<string>
  createPullRequest: (repo: string, title: string, description: string) => Promise<string>
  runCodeReview: (repo: string) => Promise<string>
  fixIssues: (repo: string) => Promise<string>
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined)

const initialRepositories: Repository[] = [
  { id: '1', name: 'ai-agent-warlord', owner: 'solxhunter', url: 'https://github.com/solxhunter/ai-agent-warlord', stars: 42, forks: 12, issues: 3, lastUpdated: new Date(Date.now() - 86400000).toISOString(), status: 'ready' },
  { id: '2', name: 'trading-bot', owner: 'solxhunter', url: 'https://github.com/solxhunter/trading-bot', stars: 89, forks: 24, issues: 7, lastUpdated: new Date(Date.now() - 43200000).toISOString(), status: 'optimizing' },
  { id: '3', name: 'api-factory', owner: 'solxhunter', url: 'https://github.com/solxhunter/api-factory', stars: 56, forks: 18, issues: 2, lastUpdated: new Date(Date.now() - 1800000).toISOString(), status: 'analyzing' },
]

const initialPullRequests: PullRequest[] = [
  { id: '1', title: 'Add systematic debugging', repo: 'ai-agent-warlord', number: 42, status: 'open', createdAt: new Date(Date.now() - 86400000).toISOString(), changes: { files: 3, additions: 245, deletions: 12 } },
  { id: '2', title: 'Fix GMGN API integration', repo: 'trading-bot', number: 23, status: 'merged', createdAt: new Date(Date.now() - 43200000).toISOString(), changes: { files: 1, additions: 45, deletions: 8 } },
  { id: '3', title: 'Optimize API generation', repo: 'api-factory', number: 15, status: 'closed', createdAt: new Date(Date.now() - 7200000).toISOString(), changes: { files: 5, additions: 189, deletions: 67 } },
]

const initialTasks: GitHubTask[] = [
  { id: '1', type: 'code_review', repo: 'ai-agent-warlord', status: 'completed', progress: 100, createdAt: new Date(Date.now() - 86400000).toISOString(), result: 'Found 3 bugs, suggested fixes' },
  { id: '2', type: 'bug_fix', repo: 'trading-bot', status: 'running', progress: 65, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'optimization', repo: 'api-factory', status: 'pending', progress: 0, createdAt: new Date(Date.now() - 1800000).toISOString() },
]

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>(initialRepositories)
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(initialPullRequests)
  const [tasks, setTasks] = useState<GitHubTask[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(false)

  const analyzeRepository = async (repoUrl: string): Promise<string> => {
    setIsLoading(true)
    
    const repoName = repoUrl.split('/').pop() || 'unknown'
    const newRepo: Repository = {
      id: Date.now().toString(),
      name: repoName,
      owner: 'user',
      url: repoUrl,
      stars: 0,
      forks: 0,
      issues: 0,
      lastUpdated: new Date().toISOString(),
      status: 'analyzing',
    }
    
    setRepositories(prev => [newRepo, ...prev])
    
    // Simulate analysis
    const simulateAnalysis = () => {
      setRepositories(prev => prev.map(repo => {
        if (repo.id === newRepo.id) {
          if (repo.status === 'analyzing') {
            return { ...repo, status: 'optimizing', issues: 5 }
          } else if (repo.status === 'optimizing') {
            return { ...repo, status: 'ready', stars: 10, forks: 3, issues: 2 }
          }
        }
        return repo
      }))
    }
    
    setTimeout(simulateAnalysis, 2000)
    setTimeout(simulateAnalysis, 4000)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 6000)
    
    return newRepo.id
  }

  const createPullRequest = async (repo: string, title: string, description: string): Promise<string> => {
    setIsLoading(true)
    
    const newPR: PullRequest = {
      id: Date.now().toString(),
      title,
      repo,
      number: Math.floor(Math.random() * 1000),
      status: 'open',
      createdAt: new Date().toISOString(),
      changes: { files: Math.floor(Math.random() * 10) + 1, additions: Math.floor(Math.random() * 500) + 50, deletions: Math.floor(Math.random() * 100) + 10 },
    }
    
    setPullRequests(prev => [newPR, ...prev])
    
    // Add task
    const newTask: GitHubTask = {
      id: Date.now().toString(),
      type: 'feature_add',
      repo,
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate PR creation progress
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.id === newTask.id && task.progress < 100) {
          const newProgress = task.progress + 25
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running',
            result: newProgress >= 100 ? `Created PR #${newPR.number} with ${newPR.changes.files} files changed` : undefined,
          }
        }
        return task
      }))
    }, 1000)
    
    setTimeout(() => {
      clearInterval(interval)
      setIsLoading(false)
    }, 5000)
    
    return newPR.id
  }

  const runCodeReview = async (repo: string): Promise<string> => {
    setIsLoading(true)
    
    const newTask: GitHubTask = {
      id: Date.now().toString(),
      type: 'code_review',
      repo,
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate code review
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.id === newTask.id && task.progress < 100) {
          const newProgress = task.progress + 20
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running',
            result: newProgress >= 100 ? 'Found 12 issues, 3 critical bugs, 5 optimizations suggested' : undefined,
          }
        }
        return task
      }))
    }, 1000)
    
    setTimeout(() => {
      clearInterval(interval)
      setIsLoading(false)
    }, 6000)
    
    return newTask.id
  }

  const fixIssues = async (repo: string): Promise<string> => {
    setIsLoading(true)
    
    const newTask: GitHubTask = {
      id: Date.now().toString(),
      type: 'bug_fix',
      repo,
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    
    setTasks(prev => [newTask, ...prev])
    
    // Simulate bug fixing
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.id === newTask.id && task.progress < 100) {
          const newProgress = task.progress + 33
          return {
            ...task,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running',
            result: newProgress >= 100 ? 'Fixed 8 bugs, improved performance by 42%' : undefined,
          }
        }
        return task
      }))
    }, 1000)
    
    setTimeout(() => {
      clearInterval(interval)
      setIsLoading(false)
    }, 4000)
    
    return newTask.id
  }

  return (
    <GitHubContext.Provider value={{
      repositories,
      pullRequests,
      tasks,
      isLoading,
      analyzeRepository,
      createPullRequest,
      runCodeReview,
      fixIssues,
    }}>
      {children}
    </GitHubContext.Provider>
  )
}

export function useGitHub() {
  const context = useContext(GitHubContext)
  if (context === undefined) {
    throw new Error('useGitHub must be used within a GitHubProvider')
  }
  return context
}