'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkillsContext } from '@/contexts/SkillsContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// Skills Categories
const SKILLS_CATEGORIES = [
  {
    id: 'autonomous-ai-agents',
    name: 'Autonomous AI Agents',
    description: 'Spawn and orchestrate AI coding agents',
    icon: '🤖',
    color: 'bg-purple-500',
    count: 3
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Generate art, music, and creative content',
    icon: '🎨',
    color: 'bg-pink-500',
    count: 10
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Jupyter notebooks, analysis, visualization',
    icon: '📊',
    color: 'bg-blue-500',
    count: 2
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Deployment, infrastructure, automation',
    icon: '⚙️',
    color: 'bg-green-500',
    count: 5
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Email management and automation',
    icon: '📧',
    color: 'bg-yellow-500',
    count: 1
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Game servers, mods, automation',
    icon: '🎮',
    color: 'bg-red-500',
    count: 2
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repository management, workflows',
    icon: '🐙',
    color: 'bg-gray-500',
    count: 7
  },
  {
    id: 'leisure',
    name: 'Leisure',
    description: 'Find nearby places, activities',
    icon: '🌴',
    color: 'bg-cyan-500',
    count: 1
  },
  {
    id: 'mcp',
    name: 'MCP',
    description: 'Model Context Protocol servers',
    icon: '🔌',
    color: 'bg-indigo-500',
    count: 2
  },
  {
    id: 'media',
    name: 'Media',
    description: 'YouTube, GIFs, music generation',
    icon: '🎬',
    color: 'bg-orange-500',
    count: 5
  },
  {
    id: 'mlops',
    name: 'MLOps',
    description: 'ML training, deployment, optimization',
    icon: '🧠',
    color: 'bg-teal-500',
    count: 20
  },
  {
    id: 'note-taking',
    name: 'Note Taking',
    description: 'Obsidian, research, documentation',
    icon: '📝',
    color: 'bg-brown-500',
    count: 1
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Google Workspace, Linear, Notion',
    icon: '💼',
    color: 'bg-purple-600',
    count: 7
  },
  {
    id: 'red-teaming',
    name: 'Red Teaming',
    description: 'Security testing, jailbreaking',
    icon: '🔓',
    color: 'bg-red-600',
    count: 1
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Academic papers, market data',
    icon: '🔬',
    color: 'bg-blue-600',
    count: 4
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    description: 'Home automation, IoT devices',
    icon: '🏠',
    color: 'bg-green-600',
    count: 1
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Twitter, content monitoring',
    icon: '📱',
    color: 'bg-pink-600',
    count: 1
  },
  {
    id: 'software-development',
    name: 'Software Development',
    description: 'Coding, debugging, testing',
    icon: '💻',
    color: 'bg-blue-700',
    count: 8
  },
  {
    id: 'trading',
    name: 'Trading',
    description: 'Crypto trading, API integration',
    icon: '💰',
    color: 'bg-green-700',
    count: 5
  }
]

// Mock Skills Data
const mockSkills = [
  {
    id: 'ultimate-trading-bot-builder',
    name: 'Ultimate Trading Bot Builder',
    category: 'trading',
    description: 'Build complete crypto trading bots with GMGN integration',
    author: 'trading-team',
    rating: 4.8,
    downloads: 15420,
    tags: ['trading', 'crypto', 'gmgn', 'bot']
  },
  {
    id: 'gmgn-trading-bot-master-system',
    name: 'GMGN Trading Bot Master System',
    category: 'trading',
    description: 'Complete GMGN Open trading bot system',
    author: 'gmgn-team',
    rating: 4.9,
    downloads: 23150,
    tags: ['gmgn', 'trading', 'master', 'system']
  },
  {
    id: 'bybit-api-testing',
    name: 'Bybit API Testing',
    category: 'trading',
    description: 'Comprehensive Bybit API testing before deployment',
    author: 'bybit-team',
    rating: 4.7,
    downloads: 8934,
    tags: ['bybit', 'api', 'testing', 'trading']
  },
  {
    id: 'autonomous-ai-agents',
    name: 'Autonomous AI Agents',
    category: 'autonomous-ai-agents',
    description: 'Skills for spawning autonomous AI coding agents',
    author: 'ai-team',
    rating: 4.9,
    downloads: 31200,
    tags: ['ai', 'agents', 'autonomous', 'coding']
  },
  {
    id: 'github-code-review',
    name: 'GitHub Code Review',
    category: 'github',
    description: 'Review code changes by analyzing git diffs',
    author: 'github-team',
    rating: 4.6,
    downloads: 18720,
    tags: ['github', 'code-review', 'diff', 'analysis']
  }
]

export default function SkillsLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [installedSkills, setInstalledSkills] = useState<string[]>([
    'ultimate-trading-bot-builder',
    'gmgn-trading-bot-master-system',
    'autonomous-ai-agents'
  ])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { skillsState, updateSkillsState } = useSkillsContext()

  const filteredSkills = mockSkills.filter(skill => {
    const matchesCategory = !selectedCategory || skill.category === selectedCategory
    const matchesSearch = !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const installSkill = (skillId: string) => {
    if (!installedSkills.includes(skillId)) {
      setInstalledSkills([...installedSkills, skillId])
    }
  }

  const uninstallSkill = (skillId: string) => {
    setInstalledSkills(installedSkills.filter(id => id !== skillId))
  }

  const isSkillInstalled = (skillId: string) => installedSkills.includes(skillId)

  return (
    <div className="space-y-6">
      {/* Skills Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Total Skills</div>
          <div className="text-2xl font-bold text-white">314</div>
          <div className="text-purple-400 text-xs">In library</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Installed</div>
          <div className="text-2xl font-bold text-white">{installedSkills.length}</div>
          <div className="text-green-400 text-xs">Active skills</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Categories</div>
          <div className="text-2xl font-bold text-white">{SKILLS_CATEGORIES.length}</div>
          <div className="text-blue-400 text-xs">Skill types</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border-yellow-500/30">
          <div className="text-yellow-400 text-sm">Total Downloads</div>
          <div className="text-2xl font-bold text-white">2.4M</div>
          <div className="text-yellow-400 text-xs">All time</div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Skills Library</h2>
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 text-white"
            />
          </div>
          <Button variant="primary">
            Search
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Categories ({SKILLS_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0)})
            </Button>
            {SKILLS_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{skill.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{skill.description}</p>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-white">{skill.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-400">📥</span>
                          <span className="text-sm text-white">{skill.downloads.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          by {skill.author}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 flex-wrap mb-3">
                        {skill.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isSkillInstalled(skill.id) ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          disabled
                        >
                          ✓ Installed
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => uninstallSkill(skill.id)}
                        >
                          Uninstall
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => installSkill(skill.id)}
                        >
                          Install
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          View
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced Skills Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Auto-update Skills</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Enabled</option>
                  <option>Disabled</option>
                  <option>Prompt before update</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Skill Dependencies</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Auto-install</option>
                  <option>Manual install</option>
                  <option>Skip if missing</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Skill Verification</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Strict (all checks)</option>
                  <option>Normal (basic checks)</option>
                  <option>None (skip verification)</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Installation Source</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Official Repository</option>
                  <option>Community Repository</option>
                  <option>Custom URL</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Blacklisted Skills</label>
              <input 
                type="text" 
                placeholder="skill1,skill2,skill3"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
              />
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Custom Skill Repository URL</label>
              <input 
                type="url" 
                placeholder="https://github.com/user/custom-skills"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
              />
            </div>
          </motion.div>
        )}
      </Card>

      {/* Installed Skills */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Installed Skills ({installedSkills.length})</h3>
        
        <div className="space-y-3">
          {installedSkills.map((skillId) => {
            const skill = mockSkills.find(s => s.id === skillId)
            if (!skill) return null
            
            return (
              <div key={skillId} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {skill.name.substring(0, 1)}
                    </span>
                  </div>
                  
                  <div>
                    <div className="font-bold text-white">{skill.name}</div>
                    <div className="text-sm text-gray-400">{skill.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active</Badge>
                  <Button variant="ghost" size="sm">
                    Configure
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => uninstallSkill(skillId)}>
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}