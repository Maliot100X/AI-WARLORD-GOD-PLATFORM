import { NextRequest, NextResponse } from 'next/server'

// Mock agents data
let agents = [
  {
    id: '1',
    name: 'Trading Bot Builder',
    type: 'trading',
    status: 'running',
    progress: 75,
    startTime: '2026-04-17 17:20:00',
    model: 'claude-3-opus',
    tools: ['terminal', 'file', 'web'],
    metadata: {
      strategy: 'momentum-sniper',
      target: 'SOL'
    },
    output: 'Building trading bot components...'
  },
  {
    id: '2',
    name: 'Code Review Agent',
    type: 'development',
    status: 'completed',
    progress: 100,
    startTime: '2026-04-17 17:15:00',
    endTime: '2026-04-17 17:18:30',
    model: 'claude-3-sonnet',
    tools: ['github', 'file'],
    metadata: {
      repository: 'AI-WARLORD-GOD-PLATFORM',
      pullRequest: '#42'
    },
    output: 'Code review completed. Found 3 minor issues, all resolved.'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    let filteredAgents = agents
    
    if (status) {
      filteredAgents = filteredAgents.filter(agent => agent.status === status)
    }
    
    if (type) {
      filteredAgents = filteredAgents.filter(agent => agent.type === type)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredAgents,
      total: filteredAgents.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newAgent = {
      id: Date.now().toString(),
      name: body.name,
      type: body.type,
      status: 'idle',
      progress: 0,
      startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      model: body.model || 'claude-3-opus',
      tools: body.tools || ['terminal'],
      metadata: body.metadata || {},
      output: 'Agent created and ready to run'
    }
    
    agents.unshift(newAgent)
    
    return NextResponse.json({
      success: true,
      data: newAgent,
      message: 'Agent created successfully'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('id')
    const body = await request.json()
    
    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      )
    }
    
    const agentIndex = agents.findIndex(agent => agent.id === agentId)
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    agents[agentIndex] = {
      ...agents[agentIndex],
      ...body,
      id: agentId // Prevent ID changes
    }
    
    return NextResponse.json({
      success: true,
      data: agents[agentIndex],
      message: 'Agent updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update agent' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('id')
    
    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'Agent ID is required' },
        { status: 400 }
      )
    }
    
    const agentIndex = agents.findIndex(agent => agent.id === agentId)
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    agents.splice(agentIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete agent' },
      { status: 500 }
    )
  }
}