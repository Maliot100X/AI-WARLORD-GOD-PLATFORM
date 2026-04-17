'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// GitHub Types
type Repository = {
  id: string
  name: string
  fullName: string
  description: string
  private: boolean
  language: string
  stars: number
  forks: number
  issues: number
  pullRequests: number
  lastUpdated: string
}

type Issue = {
  id: string
  title: string
  body: string
  state: string
  assignee: string
  labels: string[]
  createdAt: string
  updatedAt: string
}

type PullRequest = {
  id: string
  title: string
  body: string
  state: string
  author: string
  baseBranch: string
  headBranch: string
  mergeable: boolean
  createdAt: string
  updatedAt: string
  mergedAt?: string
}

type GitHubState = {
  repositories: Repository[]
  issues: Issue[]
  pullRequests: PullRequest[]
  loading: boolean
  error: string | null
  selectedRepo: Repository | null
}

type GitHubAction =
  | { type: 'SET_REPOSITORIES'; payload: Repository[] }
  | { type: 'SET_ISSUES'; payload: Issue[] }
  | { type: 'SET_PULL_REQUESTS'; payload: PullRequest[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_REPO'; payload: Repository | null }
  | { type: 'ADD_ISSUE'; payload: Issue }
  | { type: 'ADD_PULL_REQUEST'; payload: PullRequest }
  | { type: 'MERGE_PR'; payload: string }

const initialState: GitHubState = {
  repositories: [],
  issues: [],
  pullRequests: [],
  loading: false,
  error: null,
  selectedRepo: null
}

function githubReducer(state: GitHubState, action: GitHubAction): GitHubState {
  switch (action.type) {
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.payload }
    case 'SET_ISSUES':
      return { ...state, issues: action.payload }
    case 'SET_PULL_REQUESTS':
      return { ...state, pullRequests: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SELECT_REPO':
      return { ...state, selectedRepo: action.payload }
    case 'ADD_ISSUE':
      return { ...state, issues: [action.payload, ...state.issues] }
    case 'ADD_PULL_REQUEST':
      return { ...state, pullRequests: [action.payload, ...state.pullRequests] }
    case 'MERGE_PR':
      return {
        ...state,
        pullRequests: state.pullRequests.map(pr =>
          pr.id === action.payload
            ? { ...pr, state: 'merged', mergedAt: new Date().toISOString() }
            : pr
        )
      }
    default:
      return state
  }
}

type GitHubContextType = {
  state: GitHubState
  dispatch: React.Dispatch<GitHubAction>
  fetchRepositories: () => Promise<void>
  fetchIssues: (repoName?: string) => Promise<void>
  fetchPullRequests: (repoName?: string) => Promise<void>
  createRepository: (repo: Omit<Repository, 'id' | 'stars' | 'forks' | 'issues' | 'pullRequests' | 'lastUpdated'>) => Promise<void>
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'> & { repository: string }) => Promise<void>
  createPullRequest: (pr: Omit<PullRequest, 'id' | 'createdAt' | 'updatedAt' | 'mergedAt'> & { repository: string }) => Promise<void>
  mergePullRequest: (prId: string) => Promise<void>
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined)

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(githubReducer, initialState)

  const fetchRepositories = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/github?type=repos')
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_REPOSITORIES', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch repositories' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchIssues = async (repoName?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const url = repoName 
        ? `/api/github?type=issues&repository=${repoName}`
        : '/api/github?type=issues'
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_ISSUES', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch issues' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchPullRequests = async (repoName?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const url = repoName 
        ? `/api/github?type=prs&repository=${repoName}`
        : '/api/github?type=prs'
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_PULL_REQUESTS', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch pull requests' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createRepository = async (repoData: Omit<Repository, 'id' | 'stars' | 'forks' | 'issues' | 'pullRequests' | 'lastUpdated'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-repo', ...repoData })
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_REPOSITORIES', payload: [data.data, ...state.repositories] })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create repository' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'> & { repository: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-issue', ...issueData })
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'ADD_ISSUE', payload: data.data })
        
        // Update repo issue count
        const updatedRepos = state.repositories.map(repo => 
          repo.name === issueData.repository
            ? { ...repo, issues: repo.issues + 1 }
            : repo
        )
        dispatch({ type: 'SET_REPOSITORIES', payload: updatedRepos })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create issue' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createPullRequest = async (prData: Omit<PullRequest, 'id' | 'createdAt' | 'updatedAt' | 'mergedAt'> & { repository: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-pr', ...prData })
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'ADD_PULL_REQUEST', payload: data.data })
        
        // Update repo PR count
        const updatedRepos = state.repositories.map(repo => 
          repo.name === prData.repository
            ? { ...repo, pullRequests: repo.pullRequests + 1 }
            : repo
        )
        dispatch({ type: 'SET_REPOSITORIES', payload: updatedRepos })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create pull request' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const mergePullRequest = async (prId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'merge-pr', prId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'MERGE_PR', payload: prId })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to merge pull request' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <GitHubContext.Provider
      value={{
        state,
        dispatch,
        fetchRepositories,
        fetchIssues,
        fetchPullRequests,
        createRepository,
        createIssue,
        createPullRequest,
        mergePullRequest
      }}
    >
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