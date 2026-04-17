import { NextRequest, NextResponse } from 'next/server'

// Mock trading data
const tradingData = {
  stats: {
    totalProfit: 12450.32,
    dailyProfit: 342.15,
    successRate: 94.5,
    totalTrades: 1242,
    activeTrades: 12,
    winRate: 68.3
  },
  positions: [
    {
      id: '1',
      symbol: 'SOL/USDT',
      type: 'long',
      size: 10.5,
      entryPrice: 145.32,
      currentPrice: 148.75,
      pnl: 35.91,
      pnlPercent: 2.36,
      status: 'open',
      strategy: 'momentum-sniper',
      openedAt: '2026-04-17T17:20:00Z'
    },
    {
      id: '2',
      symbol: 'BTC/USDT',
      type: 'short',
      size: 0.5,
      entryPrice: 67234.50,
      currentPrice: 66985.20,
      pnl: 124.65,
      pnlPercent: 0.37,
      status: 'open',
      strategy: 'whale-hunter',
      openedAt: '2026-04-17T17:15:00Z'
    }
  ],
  history: [
    {
      id: '1',
      symbol: 'SOL/USDT',
      type: 'long',
      size: 15.2,
      entryPrice: 142.10,
      exitPrice: 147.85,
      pnl: 87.42,
      pnlPercent: 4.05,
      status: 'closed',
      strategy: 'momentum-sniper',
      openedAt: '2026-04-17T16:45:00Z',
      closedAt: '2026-04-17T17:10:00Z'
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      type: 'long',
      size: 5.8,
      entryPrice: 3234.50,
      exitPrice: 3287.20,
      pnl: 306.06,
      pnlPercent: 1.63,
      status: 'closed',
      strategy: 'pump-fun-sniper',
      openedAt: '2026-04-17T16:30:00Z',
      closedAt: '2026-04-17T16:55:00Z'
    }
  ],
  signals: [
    {
      id: '1',
      symbol: 'SOL/USDT',
      type: 'long',
      strength: 0.85,
      confidence: 0.92,
      strategy: 'momentum-sniper',
      reason: 'Volume spike + RSI oversold',
      createdAt: '2026-04-17T17:23:45Z'
    },
    {
      id: '2',
      symbol: 'BTC/USDT',
      type: 'short',
      strength: 0.72,
      confidence: 0.88,
      strategy: 'whale-hunter',
      reason: 'Large sell order detected',
      createdAt: '2026-04-17T17:22:30Z'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // stats, positions, history, signals
    
    switch (type) {
      case 'stats':
        return NextResponse.json({
          success: true,
          data: tradingData.stats
        })
        
      case 'positions':
        const positionStatus = searchParams.get('status')
        const positions = positionStatus 
          ? tradingData.positions.filter(p => p.status === positionStatus)
          : tradingData.positions
          
        return NextResponse.json({
          success: true,
          data: positions,
          total: positions.length
        })
        
      case 'history':
        const limit = searchParams.get('limit') || '50'
        const offset = searchParams.get('offset') || '0'
        const history = tradingData.history
          .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
          
        return NextResponse.json({
          success: true,
          data: history,
          total: tradingData.history.length,
          offset: parseInt(offset),
          limit: parseInt(limit)
        })
        
      case 'signals':
        const signalStrategy = searchParams.get('strategy')
        const signals = signalStrategy
          ? tradingData.signals.filter(s => s.strategy === signalStrategy)
          : tradingData.signals
          
        return NextResponse.json({
          success: true,
          data: signals,
          total: signals.length
        })
        
      default:
        return NextResponse.json({
          success: true,
          data: tradingData
        })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trading data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'open-position':
        const newPosition = {
          id: Date.now().toString(),
          symbol: data.symbol,
          type: data.type,
          size: data.size,
          entryPrice: data.price,
          currentPrice: data.price,
          pnl: 0,
          pnlPercent: 0,
          status: 'open',
          strategy: data.strategy || 'manual',
          openedAt: new Date().toISOString()
        }
        
        tradingData.positions.unshift(newPosition)
        
        return NextResponse.json({
          success: true,
          data: newPosition,
          message: 'Position opened successfully'
        }, { status: 201 })
        
      case 'close-position':
        const positionIndex = tradingData.positions.findIndex(p => p.id === data.positionId)
        
        if (positionIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Position not found' },
            { status: 404 }
          )
        }
        
        const position = tradingData.positions[positionIndex]
        const closedPosition = {
          ...position,
          exitPrice: data.price,
          pnl: data.pnl,
          pnlPercent: data.pnlPercent,
          status: 'closed' as const,
          closedAt: new Date().toISOString()
        }
        
        tradingData.history.unshift(closedPosition)
        tradingData.positions.splice(positionIndex, 1)
        
        return NextResponse.json({
          success: true,
          data: closedPosition,
          message: 'Position closed successfully'
        })
        
      case 'execute-signal':
        // Execute trading signal
        return NextResponse.json({
          success: true,
          message: 'Signal executed successfully',
          data: {
            signalId: data.signalId,
            action: 'executed',
            timestamp: new Date().toISOString()
          }
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process trading action' },
      { status: 500 }
    )
  }
}