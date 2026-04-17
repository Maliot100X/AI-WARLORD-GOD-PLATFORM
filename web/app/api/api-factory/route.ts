import { NextRequest, NextResponse } from 'next/server'

// Mock API data
let apis: Array<{
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
  lastDeployed: string | null
}> = [
  {
    id: '1',
    name: 'User Management API',
    version: 'v1',
    description: 'CRUD operations for user management',
    endpoints: [
      { method: 'GET', path: '/users', description: 'Get all users' },
      { method: 'POST', path: '/users', description: 'Create new user' },
      { method: 'GET', path: '/users/:id', description: 'Get user by ID' },
      { method: 'PUT', path: '/users/:id', description: 'Update user' },
      { method: 'DELETE', path: '/users/:id', description: 'Delete user' }
    ],
    auth: 'jwt',
    rateLimit: 60,
    status: 'active',
    createdAt: '2026-04-17T17:20:00Z',
    lastDeployed: '2026-04-17T17:25:00Z'
  },
  {
    id: '2',
    name: 'Trading Bot API',
    version: 'v2',
    description: 'API for trading bot operations',
    endpoints: [
      { method: 'GET', path: '/trading/stats', description: 'Get trading statistics' },
      { method: 'GET', path: '/trading/positions', description: 'Get open positions' },
      { method: 'POST', path: '/trading/positions', description: 'Open new position' },
      { method: 'DELETE', path: '/trading/positions/:id', description: 'Close position' }
    ],
    auth: 'api-key',
    rateLimit: 120,
    status: 'active',
    createdAt: '2026-04-17T17:15:00Z',
    lastDeployed: '2026-04-17T17:30:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const auth = searchParams.get('auth')
    
    let filteredApis = apis
    
    if (status) {
      filteredApis = filteredApis.filter(api => api.status === status)
    }
    
    if (auth) {
      filteredApis = filteredApis.filter(api => api.auth === auth)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredApis,
      total: filteredApis.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch APIs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newApi = {
      id: Date.now().toString(),
      name: body.name,
      version: body.version || 'v1',
      description: body.description,
      endpoints: body.endpoints || [],
      auth: body.auth || 'none',
      rateLimit: body.rateLimit || 60,
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastDeployed: null as string | null
    }
    
    apis.unshift(newApi)
    
    return NextResponse.json({
      success: true,
      data: newApi,
      message: 'API created successfully'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create API' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiId = searchParams.get('id')
    const body = await request.json()
    
    if (!apiId) {
      return NextResponse.json(
        { success: false, error: 'API ID is required' },
        { status: 400 }
      )
    }
    
    const apiIndex = apis.findIndex(api => api.id === apiId)
    
    if (apiIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'API not found' },
        { status: 404 }
      )
    }
    
    apis[apiIndex] = {
      ...apis[apiIndex],
      ...body,
      id: apiId // Prevent ID changes
    }
    
    return NextResponse.json({
      success: true,
      data: apis[apiIndex],
      message: 'API updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update API' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiId = searchParams.get('id')
    
    if (!apiId) {
      return NextResponse.json(
        { success: false, error: 'API ID is required' },
        { status: 400 }
      )
    }
    
    const apiIndex = apis.findIndex(api => api.id === apiId)
    
    if (apiIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'API not found' },
        { status: 404 }
      )
    }
    
    apis.splice(apiIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'API deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete API' },
      { status: 500 }
    )
  }
}