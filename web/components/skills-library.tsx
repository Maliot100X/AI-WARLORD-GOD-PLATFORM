'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cog, BookOpen, Zap, Download, Upload,
  Search, Filter, Grid, List,
  Star, Eye, Play, Settings
} from 'lucide-react'

export function SkillsLibrary() {
  const [skills, setSkills] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const categories = [
    { id: 'all', name: 'All Skills', count: 314 },
    { id: 'trading', name: 'Trading', count: 12 },
    { id: 'agents', name: 'AI Agents', count: 8 },
    { id: 'api', name: 'API Tools', count: 15 },
    { id: 'github', name: 'GitHub', count: 10 },
    { id: 'devops', name: 'DevOps', count: 20 },
    { id: 'debugging', name: 'Debugging', count: 7 },
    { id: 'creative', name: 'Creative', count: 25 },
    { id: 'research', name: 'Research', count: 18 }
  ]

  const mockSkills = [
    {
      id: 'ultimate-trading-bot-builder',
      name: 'Ultimate Trading Bot Builder',
      category: 'trading',
      description: 'Build complete cryptocurrency trading bots with GMGN integration',
      downloads: 1337,
      rating: 4.9,
      isInstalled: true
    },
    {
      id: 'autonomous-ai-agents',
      name: 'Autonomous AI Agents',
      category: 'agents',
      description: 'Deploy and manage multiple AI agents simultaneously',
      downloads: 892,
      rating: 4.8,
      isInstalled: true
    },
    {
      id: 'api-factory',
      name: 'Zero-Code API Factory',
      category: 'api',
      description: 'Convert any website into a fully functional REST API',
      downloads: 2156,
      rating: 4.7,
      isInstalled: false
    },
    {
      id: 'github-takeover',
      name: 'GitHub Takeover Bot',
      category: 'github',
      description: 'Automatically improve and maintain GitHub repositories',
      downloads: 567,
      rating: 4.6,
      isInstalled: true
    },
    {
      id: 'systematic-debugging',
      name: 'Systematic Debugging',
      category: 'debugging',
      description: 'Methodical approach to finding and fixing bugs',
      downloads: 3421,
      rating: 5.0,
      isInstalled: true
    },
    {
      id: 'ascii-art-generator',
      name: 'ASCII Art Generator',
      category: 'creative',
      description: 'Create beautiful ASCII art from images and text',
      downloads: 789,
      rating: 4.3,
      isInstalled: false
    }
  ]

  useEffect(() => {
    setSkills(mockSkills)
  }, [])

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const installSkill = (skillId: string) => {
    setSkills(skills.map(skill => 
      skill.id === skillId ? { ...skill, isInstalled: true } : skill
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-skills-gold to-skills-orange bg-clip-text text-transparent">
            SKILLS LIBRARY
          </h2>
          <p className="text-gray-400">314+ skills available for instant installation</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-skills-gold to-skills-orange text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className={`grid ${
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      } gap-4`}>
        {filteredSkills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-skills-gold to-skills-orange rounded-lg flex items-center justify-center">
                  <Cog className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{skill.name}</h3>
                  <span className="text-xs text-gray-400">{skill.category}</span>
                </div>
              </div>
              {skill.isInstalled && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                  Installed
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-400 mb-3">{skill.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{skill.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{skill.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{skill.downloads * 10}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button className="text-xs text-blue-400 hover:text-blue-300">
                View Details
              </button>
              {!skill.isInstalled && (
                <motion.button
                  onClick={() => installSkill(skill.id)}
                  className="px-3 py-1 bg-gradient-to-r from-skills-gold to-skills-orange rounded text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Install
                </motion.button>
              )}
              {skill.isInstalled && (
                <button className="px-3 py-1 bg-gray-700 rounded text-sm font-medium">
                  Configure
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          Showing {filteredSkills.length} of {skills.length} skills
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4 text-gray-400" />
            <span>Total Downloads: 12.5K</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-gray-400" />
            <span>Avg Rating: 4.7</span>
          </div>
        </div>
      </div>
    </div>
  )
}