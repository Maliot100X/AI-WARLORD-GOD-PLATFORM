import { NextRequest, NextResponse } from 'next/server'

// Mock GitHub data
const repositories = [
  {
    id: '1',
    name: 'AI-WARLORD-GOD-PLATFORM',
    fullName: 'Maliot100X/AI-WARLORD-GOD-PLATFORM',
    description: 'Complete AI platform for autonomous agents, trading, and automation',
    private: false,
    language: 'TypeScript',
    stars: 42,
    forks: 8,
    issues: 3,
    pullRequests: 2,
    lastUpdated: '2026-04-17T17:30:00Z'
  },
  {
    id: '2',
    name: 'ultimate-trading-bot',
    fullName: 'Maliot100X/ultimate-trading-bot',
    description: 'Advanced cryptocurrency trading bot with GMGN integration',
    private: false,
    language: 'Python',
    stars: 156,
    forks: 23,
    issues: 12,
    pullRequests: 5,
    lastUpdated: '2026-04-17T16:45:00Z'
  }
]

const issues = [
  {
    id: '1',
    title: 'Add VPS deployment support',
    body: 'Need to add automated VPS deployment for global agent army',
    state: 'open',
    assignee: 'developer1',
    labels: ['enhancement', 'vps'],
    createdAt: '2026-04-17T17:20:00Z',
    updatedAt: '2026-04-17T17:25:00Z'
  },
  {
    id: '2',
    title: 'Fix memory leak in agent runner',
    body: 'Agents are not properly cleaning up memory after execution',
    state: 'open',
    assignee: 'developer2',
    labels: ['bug', 'performance'],
    createdAt: '2026-04-17T17:15:00Z',
    updatedAt: '2026-04-17T17:18:00Z'
  }
]

const pullRequests = [
  {
    id: '1',
    title: 'Feature: Trading strategy enhancements',
    body: 'Added new momentum sniper strategy with improved risk management',
    state: 'open',
    author: 'trader-dev',
    baseBranch: 'main',
    headBranch: 'feature/trading-enhancements',
    mergeable: true,
    createdAt: '2026-04-17T17:10:00Z',
    updatedAt: '2026-04-17T17:30:00Z'
  },
  {
    id: '2',
    title: 'Fix: API rate limiting issue',
    body: 'Fixed the rate limiting bug that was causing 429 errors',
    state: 'merged',
    author: 'api-dev',
    baseBranch: 'main',
    headBranch: 'fix/rate-limiting',
    mergeable: true,
    createdAt: '2026-04-17T16:30:00Z',
    updatedAt: '2026-04-17T17:00:00Z',
    mergedAt: '2026-04-17T17:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // repos, issues, prs
    const state = searchParams.get('state')
    
    switch (type) {
      case 'repos':
        const language = searchParams.get('language')
        let filteredRepos = repositories
        
        if (language) {
          filteredRepos = filteredRepos.filter(repo => repo.language === language)
        }
        
        return NextResponse.json({
          success: true,
          data: filteredRepos,
          total: filteredRepos.length
        })
        
      case 'issues':
        let filteredIssues = issues
        
        if (state) {
          filteredIssues = filteredIssues.filter(issue => issue.state === state)
        }
        
        return NextResponse.json({
          success: true,
          data: filteredIssues,
          total: filteredIssues.length
        })
        
      case 'prs':
      case 'pull-requests':
        let filteredPRs = pullRequests
        
        if (state) {
          filteredPRs = filteredPRs.filter(pr => pr.state === state)
        }
        
        return NextResponse.json({
          success: true,
          data: filteredPRs,
          total: filteredPRs.length
        })
        
      default:
        return NextResponse.json({
          success: true,
          data: {
            repos: repositories,
            issues: issues.filter(i => i.state === 'open'),
            pullRequests: pullRequests.filter(pr => pr.state === 'open')
          }
        })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'create-repo':
        const newRepo = {
          id: Date.now().toString(),
          name: data.name,
          fullName: `${data.owner}/${data.name}`,
          description: data.description,
          private: data.private || false,
          language: data.language || 'TypeScript',
          stars: 0,
          forks: 0,
          issues: 0,
          pullRequests: 0,
          lastUpdated: new Date().toISOString()
        }
        
        repositories.unshift(newRepo)
        
        return NextResponse.json({
          success: true,
          data: newRepo,
          message: 'Repository created successfully'
        }, { status: 201 })
        
      case 'create-issue':
        const newIssue = {
          id: Date.now().toString(),
          title: data.title,
          body: data.body,
          state: 'open',
          assignee: data.assignee,
          labels: data.labels || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        issues.unshift(newIssue)
        
        // Update repo issue count
        const repoIndex = repositories.findIndex(r => r.name === data.repository)
        if (repoIndex !== -1) {
          repositories[repoIndex].issues += 1
        }
        
        return NextResponse.json({
          success: true,
          data: newIssue,
          message: 'Issue created successfully'
        }, { status: 201 })
        
      case 'create-pr':
        const newPR = {
          id: Date.now().toString(),
          title: data.title,
          body: data.body,
          state: 'open',
          author: data.author,
          baseBranch: data.baseBranch,
          headBranch: data.headBranch,
          mergeable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        pullRequests.unshift(newPR)
        
        // Update repo PR count
        const prRepoIndex = repositories.findIndex(r => r.name === data.repository)
        if (prRepoIndex !== -1) {
          repositories[prRepoIndex].pullRequests += 1
        }
        
        return NextResponse.json({
          success: true,
          data: newPR,
          message: 'Pull request created successfully'
        }, { status: 201 })
        
      case 'merge-pr':
        const prIndex = pullRequests.findIndex(pr => pr.id === data.prId)
        
        if (prIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Pull request not found' },
            { status: 404 }
          )
        }
        
        pullRequests[prIndex] = {
          ...pullRequests[prIndex],
          state: 'merged',
          mergedAt: new Date().toISOString()
        }
        
        return NextResponse.json({
          success: true,
          data: pullRequests[prIndex],
          message: 'Pull request merged successfully'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process GitHub action' },
      { status: 500 }
    )
  }
}