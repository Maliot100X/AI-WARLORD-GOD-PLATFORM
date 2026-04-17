'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Skills State Types
type SkillsState = {
  skills: Array<{
    id: string
    name: string
    category: string
    description: string
    author: string
    rating: number
    downloads: number
    tags: string[]
    installed: boolean
    version: string
    dependencies: string[]
  }>
  categories: Array<{
    id: string
    name: string
    description: string
    icon: string
    color: string
    count: number
  }>
  installedSkills: string[]
  installing: string[]
  uninstalling: string[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedCategory: string | null
}

type SkillsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SKILLS'; payload: SkillsState['skills'] }
  | { type: 'SET_CATEGORIES'; payload: SkillsState['categories'] }
  | { type: 'SET_INSTALLED_SKILLS'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'START_INSTALLING'; payload: string }
  | { type: 'FINISH_INSTALLING'; payload: string }
  | { type: 'START_UNINSTALLING'; payload: string }
  | { type: 'FINISH_UNINSTALLING'; payload: string }
  | { type: 'UPDATE_SKILL'; payload: Partial<SkillsState['skills'][0]> & { id: string } }
  | { type: 'RESET' }

const initialState: SkillsState = {
  skills: [],
  categories: [],
  installedSkills: [],
  installing: [],
  uninstalling: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null
}

function skillsReducer(state: SkillsState, action: SkillsAction): SkillsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_SKILLS':
      return { ...state, skills: action.payload, loading: false }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'SET_INSTALLED_SKILLS':
      return { ...state, installedSkills: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload }
    case 'START_INSTALLING':
      return { ...state, installing: [...state.installing, action.payload] }
    case 'FINISH_INSTALLING':
      return {
        ...state,
        installing: state.installing.filter(id => id !== action.payload),
        installedSkills: [...state.installedSkills, action.payload]
      }
    case 'START_UNINSTALLING':
      return { ...state, uninstalling: [...state.uninstalling, action.payload] }
    case 'FINISH_UNINSTALLING':
      return {
        ...state,
        uninstalling: state.uninstalling.filter(id => id !== action.payload),
        installedSkills: state.installedSkills.filter(id => id !== action.payload)
      }
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.payload.id
            ? { ...skill, ...action.payload }
            : skill
        )
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// Context
type SkillsContextType = {
  skillsState: SkillsState
  updateSkillsState: (action: SkillsAction) => void
  installSkill: (skillId: string) => Promise<void>
  uninstallSkill: (skillId: string) => Promise<void>
  searchSkills: (query: string) => Promise<void>
  filterByCategory: (categoryId: string | null) => void
  refreshSkills: () => Promise<void>
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined)

// Provider
export function SkillsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(skillsReducer, initialState)

  const updateSkillsState = (action: SkillsAction) => {
    dispatch(action)
  }

  const installSkill = async (skillId: string) => {
    dispatch({ type: 'START_INSTALLING', payload: skillId })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      dispatch({ type: 'FINISH_INSTALLING', payload: skillId })
      
      // Update skill status
      dispatch({
        type: 'UPDATE_SKILL',
        payload: { id: skillId, installed: true }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to install skill' })
      dispatch({ type: 'START_INSTALLING', payload: skillId })
    }
  }

  const uninstallSkill = async (skillId: string) => {
    dispatch({ type: 'START_UNINSTALLING', payload: skillId })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ type: 'FINISH_UNINSTALLING', payload: skillId })
      
      // Update skill status
      dispatch({
        type: 'UPDATE_SKILL',
        payload: { id: skillId, installed: false }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to uninstall skill' })
      dispatch({ type: 'START_UNINSTALLING', payload: skillId })
    }
  }

  const searchSkills = async (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
    
    if (query.trim()) {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // In a real app, this would filter from API
        dispatch({ type: 'SET_LOADING', payload: false })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to search skills' })
      }
    }
  }

  const filterByCategory = (categoryId: string | null) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId })
  }

  const refreshSkills = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockSkills = [
        {
          id: 'ultimate-trading-bot-builder',
          name: 'Ultimate Trading Bot Builder',
          category: 'trading',
          description: 'Build complete crypto trading bots with GMGN integration',
          author: 'trading-team',
          rating: 4.8,
          downloads: 15420,
          tags: ['trading', 'crypto', 'gmgn', 'bot'],
          installed: false,
          version: '1.0.0',
          dependencies: []
        },
        {
          id: 'gmgn-trading-bot-master-system',
          name: 'GMGN Trading Bot Master System',
          category: 'trading',
          description: 'Complete GMGN Open trading bot system',
          author: 'gmgn-team',
          rating: 4.9,
          downloads: 23150,
          tags: ['gmgn', 'trading', 'master', 'system'],
          installed: true,
          version: '2.1.0',
          dependencies: []
        }
      ]
      
      dispatch({ type: 'SET_SKILLS', payload: mockSkills })
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh skills' })
    }
  }

  return (
    <SkillsContext.Provider
      value={{
        skillsState: state,
        updateSkillsState,
        installSkill,
        uninstallSkill,
        searchSkills,
        filterByCategory,
        refreshSkills
      }}
    >
      {children}
    </SkillsContext.Provider>
  )
}

// Hook
export function useSkillsContext() {
  const context = useContext(SkillsContext)
  if (context === undefined) {
    throw new Error('useSkillsContext must be used within a SkillsProvider')
  }
  return context
}