'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Skill {
  id: string
  name: string
  category: 'trading' | 'agents' | 'api' | 'github' | 'devops' | 'debugging' | 'research' | 'media'
  description: string
  installed: boolean
  version: string
  usage: number
  lastUsed: string
  dependencies: string[]
}

interface SkillCategory {
  name: string
  count: number
  color: string
  icon: string
}

interface SkillsContextType {
  skills: Skill[]
  categories: SkillCategory[]
  isLoading: boolean
  totalSkills: number
  installedSkills: number
  installSkill: (skillName: string) => Promise<void>
  uninstallSkill: (skillName: string) => Promise<void>
  searchSkills: (query: string) => Skill[]
  getSkillById: (id: string) => Skill | undefined
  getSkillsByCategory: (category: string) => Skill[]
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined)

// Initial 314 skills (sample - actual would be loaded from skills.sh)
const initialSkills: Skill[] = [
  // Trading skills
  { id: '1', name: 'ultimate-trading-bot-builder', category: 'trading' as const, description: 'Build complete cryptocurrency trading bots with GMGN integration', installed: true, version: '1.2.0', usage: 245, lastUsed: new Date().toISOString(), dependencies: ['gmgn-trading-bot-master-system', 'bybit-api-testing'] },
  { id: '2', name: 'gmgn-trading-bot-master-system', category: 'trading' as const, description: 'Complete cryptocurrency trading bot system for GMGN Open-API', installed: true, version: '2.1.0', usage: 189, lastUsed: new Date(Date.now() - 86400000).toISOString(), dependencies: ['bybit-api-troubleshooting'] },
  { id: '3', name: 'bybit-api-testing', category: 'trading' as const, description: 'Comprehensive Bybit API testing and validation before deployment', installed: true, version: '1.0.5', usage: 156, lastUsed: new Date(Date.now() - 172800000).toISOString(), dependencies: [] },
  { id: '4', name: 'bybit-api-troubleshooting', category: 'trading' as const, description: 'Comprehensive troubleshooting steps for Bybit API authentication and errors', installed: true, version: '1.1.2', usage: 98, lastUsed: new Date(Date.now() - 259200000).toISOString(), dependencies: [] },
  
  // Agent skills
  { id: '5', name: 'autonomous-ai-agents', category: 'agents' as const, description: 'Skills for spawning and orchestrating autonomous AI coding agents', installed: true, version: '3.0.0', usage: 312, lastUsed: new Date().toISOString(), dependencies: ['subagent-driven-development', 'hermes-agentrouter-simple-setup'] },
  { id: '6', name: 'subagent-driven-development', category: 'agents' as const, description: 'Use when executing implementation plans with independent subagents', installed: true, version: '2.5.1', usage: 278, lastUsed: new Date(Date.now() - 43200000).toISOString(), dependencies: [] },
  { id: '7', name: 'hermes-agentrouter-simple-setup', category: 'agents' as const, description: 'Simple nohup + tmux setup for running Hermes with AgentRouter', installed: true, version: '1.0.3', usage: 145, lastUsed: new Date(Date.now() - 86400000).toISOString(), dependencies: [] },
]

const initialCategories: SkillCategory[] = [
  { name: 'trading', count: 42, color: 'from-trading-profit to-trading-signal', icon: '📈' },
  { name: 'agents', count: 38, color: 'from-warlord-purple to-warlord-pink', icon: '🤖' },
  { name: 'api', count: 36, color: 'from-api-info to-api-success', icon: '🔌' },
  { name: 'github', count: 35, color: 'from-gray-800 to-gray-600', icon: '🐙' },
  { name: 'devops', count: 32, color: 'from-blue-600 to-cyan-500', icon: '🚀' },
  { name: 'debugging', count: 45, color: 'from-warlord-amber to-warlord-orange', icon: '🔧' },
  { name: 'research', count: 41, color: 'from-warlord-green to-warlord-cyan', icon: '🔬' },
  { name: 'media', count: 45, color: 'from-warlord-pink to-warlord-purple', icon: '🎨' },
]

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(false)

  const totalSkills = skills.length
  const installedSkills = skills.filter(skill => skill.installed).length

  const installSkill = async (skillName: string): Promise<void> => {
    setIsLoading(true)
    
    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSkills(prev => prev.map(skill => 
      skill.name === skillName ? { ...skill, installed: true, lastUsed: new Date().toISOString() } : skill
    ))
    
    // Update category count
    const skill = skills.find(s => s.name === skillName)
    if (skill) {
      setCategories(prev => prev.map(cat => 
        cat.name === skill.category ? { ...cat, count: cat.count + 1 } : cat
      ))
    }
    
    setIsLoading(false)
  }

  const uninstallSkill = async (skillName: string): Promise<void> => {
    setIsLoading(true)
    
    // Simulate uninstallation
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setSkills(prev => prev.map(skill => 
      skill.name === skillName ? { ...skill, installed: false } : skill
    ))
    
    // Update category count
    const skill = skills.find(s => s.name === skillName)
    if (skill) {
      setCategories(prev => prev.map(cat => 
        cat.name === skill.category ? { ...cat, count: Math.max(0, cat.count - 1) } : cat
      ))
    }
    
    setIsLoading(false)
  }

  const searchSkills = (query: string): Skill[] => {
    const lowercaseQuery = query.toLowerCase()
    return skills.filter(skill => 
      skill.name.toLowerCase().includes(lowercaseQuery) ||
      skill.description.toLowerCase().includes(lowercaseQuery) ||
      skill.category.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 50) // Limit results
  }

  const getSkillById = (id: string): Skill | undefined => {
    return skills.find(skill => skill.id === id)
  }

  const getSkillsByCategory = (category: string): Skill[] => {
    return skills.filter(skill => skill.category === category)
  }

  return (
    <SkillsContext.Provider value={{
      skills,
      categories,
      isLoading,
      totalSkills,
      installedSkills,
      installSkill,
      uninstallSkill,
      searchSkills,
      getSkillById,
      getSkillsByCategory,
    }}>
      {children}
    </SkillsContext.Provider>
  )
}

export function useSkills() {
  const context = useContext(SkillsContext)
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillsProvider')
  }
  return context
}