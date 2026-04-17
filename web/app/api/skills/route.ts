import { NextRequest, NextResponse } from 'next/server'

// Mock skills data
const skills = [
  {
    id: '1',
    name: 'Trading Bot Builder',
    category: 'trading',
    description: 'Build and deploy automated trading bots',
    tags: ['trading', 'bot', 'automation', 'crypto'],
    difficulty: 'intermediate',
    rating: 4.8,
    downloads: 1242,
    author: 'trader-pro',
    version: '2.1.0',
    lastUpdated: '2026-04-17T17:20:00Z',
    dependencies: ['terminal', 'web', 'file'],
    features: [
      'Automated trading strategies',
      'Real-time market data',
      'Risk management',
      'Performance analytics'
    ]
  },
  {
    id: '2',
    name: 'API Generator',
    category: 'development',
    description: 'Generate REST APIs from natural language',
    tags: ['api', 'generator', 'rest', 'development'],
    difficulty: 'beginner',
    rating: 4.5,
    downloads: 856,
    author: 'api-wizard',
    version: '1.3.0',
    lastUpdated: '2026-04-17T17:15:00Z',
    dependencies: ['execute_code', 'file'],
    features: [
      'Natural language to API',
      'Automatic documentation',
      'Rate limiting',
      'Authentication'
    ]
  },
  {
    id: '3',
    name: 'GitHub Automation',
    category: 'development',
    description: 'Automate GitHub workflows and repository management',
    tags: ['github', 'automation', 'workflow', 'ci-cd'],
    difficulty: 'intermediate',
    rating: 4.7,
    downloads: 634,
    author: 'github-ninja',
    version: '3.0.0',
    lastUpdated: '2026-04-17T17:10:00Z',
    dependencies: ['github', 'terminal'],
    features: [
      'Automated PR management',
      'Issue tracking',
      'Repository analytics',
      'Team collaboration'
    ]
  },
  {
    id: '4',
    name: 'VPS Deployer',
    category: 'devops',
    description: 'Deploy and manage VPS instances across providers',
    tags: ['vps', 'deploy', 'cloud', 'devops'],
    difficulty: 'advanced',
    rating: 4.6,
    downloads: 423,
    author: 'cloud-master',
    version: '1.5.0',
    lastUpdated: '2026-04-17T17:05:00Z',
    dependencies: ['terminal', 'web'],
    features: [
      'Multi-cloud support',
      'Auto-scaling',
      'Monitoring',
      'Cost optimization'
    ]
  }
]

const categories = [
  { id: 'trading', name: 'Trading', count: 42 },
  { id: 'development', name: 'Development', count: 89 },
  { id: 'devops', name: 'DevOps', count: 56 },
  { id: 'data-science', name: 'Data Science', count: 34 },
  { id: 'ai-ml', name: 'AI/ML', count: 78 },
  { id: 'security', name: 'Security', count: 23 },
  { id: 'automation', name: 'Automation', count: 67 },
  { id: 'gaming', name: 'Gaming', count: 15 }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // skills, categories, search
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    switch (type) {
      case 'categories':
        return NextResponse.json({
          success: true,
          data: categories
        })
        
      case 'search':
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Search query is required' },
            { status: 400 }
          )
        }
        
        const searchResults = skills.filter(skill => 
          skill.name.toLowerCase().includes(query.toLowerCase()) ||
          skill.description.toLowerCase().includes(query.toLowerCase()) ||
          skill.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        
        return NextResponse.json({
          success: true,
          data: searchResults.slice(offset, offset + limit),
          total: searchResults.length,
          offset,
          limit
        })
        
      case 'featured':
        const featuredSkills = skills
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6)
          
        return NextResponse.json({
          success: true,
          data: featuredSkills
        })
        
      case 'trending':
        const trendingSkills = skills
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 6)
          
        return NextResponse.json({
          success: true,
          data: trendingSkills
        })
        
      default:
        let filteredSkills = skills
        
        if (category) {
          filteredSkills = filteredSkills.filter(skill => skill.category === category)
        }
        
        if (difficulty) {
          filteredSkills = filteredSkills.filter(skill => skill.difficulty === difficulty)
        }
        
        const paginatedSkills = filteredSkills.slice(offset, offset + limit)
        
        return NextResponse.json({
          success: true,
          data: paginatedSkills,
          total: filteredSkills.length,
          offset,
          limit
        })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'install-skill':
        const skillIndex = skills.findIndex(skill => skill.id === data.skillId)
        
        if (skillIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Skill not found' },
            { status: 404 }
          )
        }
        
        const skill = skills[skillIndex]
        
        // Simulate skill installation
        return NextResponse.json({
          success: true,
          data: {
            skill,
            installationId: Date.now().toString(),
            status: 'installing',
            message: 'Skill installation started'
          }
        })
        
      case 'create-skill':
        const newSkill = {
          id: Date.now().toString(),
          name: data.name,
          category: data.category,
          description: data.description,
          tags: data.tags || [],
          difficulty: data.difficulty || 'beginner',
          rating: 0,
          downloads: 0,
          author: data.author,
          version: data.version || '1.0.0',
          lastUpdated: new Date().toISOString(),
          dependencies: data.dependencies || [],
          features: data.features || []
        }
        
        skills.unshift(newSkill)
        
        return NextResponse.json({
          success: true,
          data: newSkill,
          message: 'Skill created successfully'
        }, { status: 201 })
        
      case 'rate-skill':
        const rateSkillIndex = skills.findIndex(skill => skill.id === data.skillId)
        
        if (rateSkillIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Skill not found' },
            { status: 404 }
          )
        }
        
        // Update skill rating (simplified)
        skills[rateSkillIndex] = {
          ...skills[rateSkillIndex],
          rating: ((skills[rateSkillIndex].rating * skills[rateSkillIndex].downloads) + data.rating) / (skills[rateSkillIndex].downloads + 1),
          downloads: skills[rateSkillIndex].downloads + 1
        }
        
        return NextResponse.json({
          success: true,
          data: skills[rateSkillIndex],
          message: 'Skill rated successfully'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process skill action' },
      { status: 500 }
    )
  }
}