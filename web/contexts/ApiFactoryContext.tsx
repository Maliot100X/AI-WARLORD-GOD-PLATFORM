'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// API Factory Types
type Api = {
  id: string
  name: string
  version: string
  description: string
  endpoints: Array<{
    method: string
    path: string
    description: string
  }>
  auth: string
  rateLimit: number
  status: string
  createdAt: string
  lastDeployed?: string
}

type ApiFactoryState = {
  apis: Api[]
  loading: boolean
  error: string | null
  selectedApi: Api | null
}

type ApiFactoryAction =
  | { type: 'SET_APIS'; payload: Api[] }
  | { type: 'ADD_API'; payload: Api }
  | { type: 'UPDATE_API'; payload: Api }
  | { type: 'DELETE_API'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_API'; payload: Api | null }

const initialState: ApiFactoryState = {
  apis: [],
  loading: false,
  error: null,
  selectedApi: null
}

function apiFactoryReducer(state: ApiFactoryState, action: ApiFactoryAction): ApiFactoryState {
  switch (action.type) {
    case 'SET_APIS':
      return { ...state, apis: action.payload }
    case 'ADD_API':
      return { ...state, apis: [action.payload, ...state.apis] }
    case 'UPDATE_API':
      return {
        ...state,
        apis: state.apis.map(api =>
          api.id === action.payload.id ? action.payload : api
        )
      }
    case 'DELETE_API':
      return {
        ...state,
        apis: state.apis.filter(api => api.id !== action.payload)
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SELECT_API':
      return { ...state, selectedApi: action.payload }
    default:
      return state
  }
}

type ApiFactoryContextType = {
  state: ApiFactoryState
  dispatch: React.Dispatch<ApiFactoryAction>
  fetchApis: () => Promise<void>
  createApi: (api: Omit<Api, 'id' | 'createdAt'>) => Promise<void>
  updateApi: (id: string, api: Partial<Api>) => Promise<void>
  deleteApi: (id: string) => Promise<void>
  deployApi: (id: string) => Promise<void>
}

const ApiFactoryContext = createContext<ApiFactoryContextType | undefined>(undefined)

export function ApiFactoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(apiFactoryReducer, initialState)

  const fetchApis = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/api-factory')
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'SET_APIS', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch APIs' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createApi = async (apiData: Omit<Api, 'id' | 'createdAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/api-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'ADD_API', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create API' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateApi = async (id: string, apiData: Partial<Api>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/api-factory?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'UPDATE_API', payload: data.data })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update API' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteApi = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/api-factory?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        dispatch({ type: 'DELETE_API', payload: id })
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete API' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deployApi = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/api-factory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deploy', id })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const updatedApi = state.apis.find(api => api.id === id)
        if (updatedApi) {
          dispatch({ type: 'UPDATE_API', payload: { ...updatedApi, lastDeployed: new Date().toISOString() } })
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to deploy API' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <ApiFactoryContext.Provider
      value={{
        state,
        dispatch,
        fetchApis,
        createApi,
        updateApi,
        deleteApi,
        deployApi
      }}
    >
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