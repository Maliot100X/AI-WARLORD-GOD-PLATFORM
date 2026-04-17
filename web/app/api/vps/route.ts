import { NextRequest, NextResponse } from 'next/server'

// Mock VPS data
const vpsInstances = [
  {
    id: '1',
    name: 'agent-001',
    provider: 'aws',
    region: 'us-east-1',
    size: 'medium',
    status: 'running',
    ipAddress: '192.168.1.101',
    cpu: 45,
    memory: 62,
    disk: 34,
    uptime: '15d 4h 23m',
    cost: 0.05,
    tags: ['agent', 'trading', 'primary'],
    createdAt: '2026-04-02T12:00:00Z',
    lastUpdated: '2026-04-17T17:30:00Z'
  },
  {
    id: '2',
    name: 'api-server-001',
    provider: 'digitalocean',
    region: 'nyc3',
    size: 'large',
    status: 'running',
    ipAddress: '192.168.1.102',
    cpu: 23,
    memory: 45,
    disk: 67,
    uptime: '7d 12h 45m',
    cost: 0.08,
    tags: ['api', 'backend', 'production'],
    createdAt: '2026-04-10T08:00:00Z',
    lastUpdated: '2026-04-17T17:25:00Z'
  },
  {
    id: '3',
    name: 'worker-001',
    provider: 'gcp',
    region: 'us-central1',
    size: 'small',
    status: 'stopped',
    ipAddress: '192.168.1.103',
    cpu: 0,
    memory: 0,
    disk: 45,
    uptime: '0m',
    cost: 0.02,
    tags: ['worker', 'batch', 'processing'],
    createdAt: '2026-04-15T14:00:00Z',
    lastUpdated: '2026-04-17T16:45:00Z'
  }
]

const providers = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    sizes: [
      { id: 'small', name: 'Small', cpu: 1, memory: 1, disk: 25, cost: 0.01 },
      { id: 'medium', name: 'Medium', cpu: 2, memory: 4, disk: 50, cost: 0.05 },
      { id: 'large', name: 'Large', cpu: 4, memory: 8, disk: 100, cost: 0.10 },
      { id: 'xlarge', name: 'XLarge', cpu: 8, memory: 16, disk: 200, cost: 0.20 }
    ]
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    regions: ['nyc1', 'nyc3', 'sfo1', 'lon1'],
    sizes: [
      { id: 'small', name: 'Small', cpu: 1, memory: 1, disk: 25, cost: 0.006 },
      { id: 'medium', name: 'Medium', cpu: 2, memory: 4, disk: 50, cost: 0.012 },
      { id: 'large', name: 'Large', cpu: 4, memory: 8, disk: 100, cost: 0.024 },
      { id: 'xlarge', name: 'XLarge', cpu: 8, memory: 16, disk: 200, cost: 0.048 }
    ]
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    regions: ['us-central1', 'us-east1', 'europe-west1', 'asia-southeast1'],
    sizes: [
      { id: 'small', name: 'Small', cpu: 1, memory: 1, disk: 25, cost: 0.008 },
      { id: 'medium', name: 'Medium', cpu: 2, memory: 4, disk: 50, cost: 0.016 },
      { id: 'large', name: 'Large', cpu: 4, memory: 8, disk: 100, cost: 0.032 },
      { id: 'xlarge', name: 'XLarge', cpu: 8, memory: 16, disk: 200, cost: 0.064 }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // instances, providers, stats
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')
    
    switch (type) {
      case 'instances':
        let filteredInstances = vpsInstances
        
        if (status) {
          filteredInstances = filteredInstances.filter(instance => instance.status === status)
        }
        
        if (provider) {
          filteredInstances = filteredInstances.filter(instance => instance.provider === provider)
        }
        
        return NextResponse.json({
          success: true,
          data: filteredInstances,
          total: filteredInstances.length
        })
        
      case 'providers':
        return NextResponse.json({
          success: true,
          data: providers
        })
        
      case 'stats':
        const stats = {
          totalInstances: vpsInstances.length,
          runningInstances: vpsInstances.filter(i => i.status === 'running').length,
          stoppedInstances: vpsInstances.filter(i => i.status === 'stopped').length,
          totalCost: vpsInstances.reduce((sum, instance) => sum + instance.cost, 0),
          avgCpu: vpsInstances
            .filter(i => i.status === 'running')
            .reduce((sum, instance) => sum + instance.cpu, 0) / vpsInstances.filter(i => i.status === 'running').length || 0,
          avgMemory: vpsInstances
            .filter(i => i.status === 'running')
            .reduce((sum, instance) => sum + instance.memory, 0) / vpsInstances.filter(i => i.status === 'running').length || 0
        }
        
        return NextResponse.json({
          success: true,
          data: stats
        })
        
      default:
        return NextResponse.json({
          success: true,
          data: {
            instances: vpsInstances,
            providers: providers
          }
        })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch VPS data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'create-instance':
        const providerConfig = providers.find(p => p.id === data.provider)
        if (!providerConfig) {
          return NextResponse.json(
            { success: false, error: 'Provider not found' },
            { status: 404 }
          )
        }
        
        const sizeConfig = providerConfig.sizes.find(s => s.id === data.size)
        if (!sizeConfig) {
          return NextResponse.json(
            { success: false, error: 'Size not found' },
            { status: 404 }
          )
        }
        
        const newInstance = {
          id: Date.now().toString(),
          name: data.name,
          provider: data.provider,
          region: data.region,
          size: data.size,
          status: 'creating',
          ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
          cpu: 0,
          memory: 0,
          disk: 0,
          uptime: '0m',
          cost: sizeConfig.cost,
          tags: data.tags || [],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
        
        vpsInstances.unshift(newInstance)
        
        // Simulate instance creation
        setTimeout(() => {
          const index = vpsInstances.findIndex(i => i.id === newInstance.id)
          if (index !== -1) {
            vpsInstances[index] = {
              ...vpsInstances[index],
              status: 'running',
              cpu: 15,
              memory: 25,
              disk: 10,
              uptime: '1m'
            }
          }
        }, 5000)
        
        return NextResponse.json({
          success: true,
          data: newInstance,
          message: 'Instance creation initiated'
        }, { status: 201 })
        
      case 'start-instance':
        const startInstanceIndex = vpsInstances.findIndex(i => i.id === data.instanceId)
        
        if (startInstanceIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Instance not found' },
            { status: 404 }
          )
        }
        
        vpsInstances[startInstanceIndex] = {
          ...vpsInstances[startInstanceIndex],
          status: 'starting',
          lastUpdated: new Date().toISOString()
        }
        
        // Simulate instance start
        setTimeout(() => {
          const index = vpsInstances.findIndex(i => i.id === data.instanceId)
          if (index !== -1) {
            vpsInstances[index] = {
              ...vpsInstances[index],
              status: 'running',
              cpu: 15,
              memory: 25,
              disk: 10,
              uptime: '1m'
            }
          }
        }, 3000)
        
        return NextResponse.json({
          success: true,
          data: vpsInstances[startInstanceIndex],
          message: 'Instance start initiated'
        })
        
      case 'stop-instance':
        const stopInstanceIndex = vpsInstances.findIndex(i => i.id === data.instanceId)
        
        if (stopInstanceIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Instance not found' },
            { status: 404 }
          )
        }
        
        vpsInstances[stopInstanceIndex] = {
          ...vpsInstances[stopInstanceIndex],
          status: 'stopping',
          lastUpdated: new Date().toISOString()
        }
        
        // Simulate instance stop
        setTimeout(() => {
          const index = vpsInstances.findIndex(i => i.id === data.instanceId)
          if (index !== -1) {
            vpsInstances[index] = {
              ...vpsInstances[index],
              status: 'stopped',
              cpu: 0,
              memory: 0,
              uptime: '0m'
            }
          }
        }, 3000)
        
        return NextResponse.json({
          success: true,
          data: vpsInstances[stopInstanceIndex],
          message: 'Instance stop initiated'
        })
        
      case 'restart-instance':
        const restartInstanceIndex = vpsInstances.findIndex(i => i.id === data.instanceId)
        
        if (restartInstanceIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Instance not found' },
            { status: 404 }
          )
        }
        
        vpsInstances[restartInstanceIndex] = {
          ...vpsInstances[restartInstanceIndex],
          status: 'restarting',
          lastUpdated: new Date().toISOString()
        }
        
        // Simulate instance restart
        setTimeout(() => {
          const index = vpsInstances.findIndex(i => i.id === data.instanceId)
          if (index !== -1) {
            vpsInstances[index] = {
              ...vpsInstances[index],
              status: 'running',
              uptime: '1m'
            }
          }
        }, 5000)
        
        return NextResponse.json({
          success: true,
          data: vpsInstances[restartInstanceIndex],
          message: 'Instance restart initiated'
        })
        
      case 'delete-instance':
        const deleteInstanceIndex = vpsInstances.findIndex(i => i.id === data.instanceId)
        
        if (deleteInstanceIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Instance not found' },
            { status: 404 }
          )
        }
        
        const deletedInstance = vpsInstances[deleteInstanceIndex]
        vpsInstances.splice(deleteInstanceIndex, 1)
        
        return NextResponse.json({
          success: true,
          data: deletedInstance,
          message: 'Instance deleted successfully'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process VPS action' },
      { status: 500 }
    )
  }
}