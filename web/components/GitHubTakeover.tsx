'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGitHub } from '@/contexts/GitHubContext'
import { useWebSocketContext } from '@/contexts/WebSocketContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// GitHub Actions
const GITHUB_ACTIONS = [
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Automated code analysis and suggestions',
    icon: '🔍',
    color: 'bg-purple-500',
    auto: true
  },
  {
    id: 'pr-automation',
    name: 'PR Automation',
    description: 'Auto-merge, label, and manage pull requests',
    icon: '🔄',
    color: 'bg-blue-500',
    auto: true
  },
  {
    id: 'issue-management',
    name: 'Issue Management',
    description: 'Auto-label, assign, and categorize issues',
    icon: '🐛',
    color: 'bg-red-500',
    auto: true
  },
  {
    id: 'security-scan',
    name: 'Security Scan',
    description: 'Vulnerability detection and fixes',
    icon: '🔒',
    color: 'bg-yellow-500',
    auto: true
  },
  {
    id: 'dependency-update',
    name: 'Dependency Updates',
    description: 'Auto-update packages and dependencies',
    icon: '📦',
    color: 'bg-green-500',
    auto: true
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Auto-generate and update docs',
    icon: '📚',
    color: 'bg-indigo-500',
    auto: false
  }
]

// Mock GitHub Repos
const mockRepos = [
  {
    id: '1',
    name: 'awesome-project',
    fullName: 'user/awesome-project',
    language: 'JavaScript',
    stars: 142,
    issues: 23,
    prs: 5,
    lastUpdate: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'crypto-bot',
    fullName: 'user/crypto-bot',
    language: 'Python',
    stars: 89,
    issues: 12,
    prs: 3,
    lastUpdate: '1 day ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'api-server',
    fullName: 'user/api-server',
    language: 'TypeScript',
    stars: 234,
    issues: 8,
    prs: 2,
    lastUpdate: '3 days ago',
    status: 'monitoring'
  }
]

// Mock Recent Activity
const mockActivity = [
  {
    type: 'pr_merged',
    repo: 'awesome-project',
    message: 'Merged PR #42: Add new feature',
    time: '5 min ago'
  },
  {
    type: 'issue_closed',
    repo: 'crypto-bot',
    message: 'Closed issue #15: Bug fix',
    time: '15 min ago'
  },
  {
    type: 'security_fix',
    repo: 'api-server',
    message: 'Applied security patch',
    time: '1 hour ago'
  },
  {
    type: 'dependency_update',
    repo: 'awesome-project',
    message: 'Updated 3 dependencies',
    time: '2 hours ago'
  }
]

export default function GitHubTakeover() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [repoUrl, setRepoUrl] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [activeActions, setActiveActions] = useState<string[]>(['code-review', 'security-scan'])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { state: githubState, dispatch } = useGitHub()
  const { socket, addListener, sendMessage } = useWebSocketContext()

  useEffect(() => {
    // Listen for GitHub updates
    if (socket) {
      addListener('github-update', (data) => {
        if (data.repositories) {
          dispatch({ type: 'SET_REPOSITORIES', payload: data.repositories })
        }
        if (data.issues) {
          dispatch({ type: 'SET_ISSUES', payload: data.issues })
        }
        if (data.pullRequests) {
          dispatch({ type: 'SET_PULL_REQUESTS', payload: data.pullRequests })
        }
      })
    }
  }, [socket, addListener, dispatch])

  const connectRepo = async () => {
    if (!repoUrl) return
    
    setIsConnecting(true)
    
    // Emit repo connection event
    if (socket) {
      sendMessage({
        type: 'connect-repo',
        data: { repoUrl }
      })
    }
    
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false)
      setRepoUrl('')
      // Add new repo to mock data
      mockRepos.unshift({
        id: Date.now().toString(),
        name: repoUrl.split('/').pop() || 'new-repo',
        fullName: repoUrl,
        language: 'Unknown',
        stars: 0,
        issues: 0,
        prs: 0,
        lastUpdate: 'Just now',
        status: 'active'
      })
    }, 2000)
  }

  const toggleAction = (actionId: string) => {
    if (activeActions.includes(actionId)) {
      setActiveActions(activeActions.filter(id => id !== actionId))
    } else {
      setActiveActions([...activeActions, actionId])
    }
  }

  return (
    <div className="space-y-6">
      {/* GitHub Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-700/20 border-purple-500/30">
          <div className="text-purple-400 text-sm">Connected Repos</div>
          <div className="text-2xl font-bold text-white">{mockRepos.length}</div>
          <div className="text-purple-400 text-xs">Active monitoring</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-700/20 border-blue-500/30">
          <div className="text-blue-400 text-sm">Total Stars</div>
          <div className="text-2xl font-bold text-white">
            {mockRepos.reduce((sum, r) => sum + r.stars, 0)}
          </div>
          <div className="text-blue-400 text-xs">Across repos</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-700/20 border-green-500/30">
          <div className="text-green-400 text-sm">Issues Fixed</div>
          <div className="text-2xl font-bold text-white">1,247</div>
          <div className="text-green-400 text-xs">Auto-resolved</div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-700/20 border-yellow-500/30">
          <div className="text-yellow-400 text-sm">PRs Merged</div>
          <div className="text-2xl font-bold text-white">856</div>
          <div className="text-yellow-400 text-xs">Auto-merged</div>
        </Card>
      </div>

      {/* Connect New Repository */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">GitHub Takeover Bot</h2>
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
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-gray-800 text-white"
            />
          </div>
          <Button
            variant="primary"
            onClick={connectRepo}
            disabled={!repoUrl || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Repo'}
          </Button>
        </div>

        {/* Active Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Active Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {GITHUB_ACTIONS.map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    activeActions.includes(action.id)
                      ? 'ring-2 ring-green-500 bg-green-900/20'
                      : 'hover:bg-gray-800/50 opacity-60'
                  }`}
                  onClick={() => toggleAction(action.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-lg`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{action.name}</h4>
                      <p className="text-xs text-gray-400">{action.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {action.auto && <Badge variant="success">Auto</Badge>}
                        {activeActions.includes(action.id) && <Badge variant="primary">Active</Badge>}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced GitHub Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm">Auto-merge PRs</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Disabled</option>
                  <option>When checks pass</option>
                  <option>Always</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Security Scan Level</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Advanced</option>
                  <option>Paranoid</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Issue Auto-assign</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Disabled</option>
                  <option>Round Robin</option>
                  <option>Load Based</option>
                  <option>Expertise Based</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Update Frequency</label>
                <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                  <option>Real-time</option>
                  <option>Every 5 minutes</option>
                  <option>Every hour</option>
                  <option>Daily</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-gray-400 text-sm">Excluded Files/Patterns</label>
              <input 
                type="text" 
                placeholder="node_modules/, *.log, .env"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
              />
            </div>
          </motion.div>
        )}
      </Card>

      {/* Connected Repositories */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Connected Repositories</h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {mockRepos.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">
                          {repo.language ? repo.language.substring(0, 1) : 'R'}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white">{repo.fullName}</h4>
                        <p className="text-sm text-gray-400">
                          {repo.language} • {repo.stars} stars • {repo.issues} issues • {repo.prs} PRs
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant={repo.status === 'active' ? 'success' : 'secondary'}>
                            {repo.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Updated {repo.lastUpdate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Configure
                      </Button>
                      <Button variant="ghost" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {mockActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/30 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {activity.type === 'pr_merged' && '🔄'}
                {activity.type === 'issue_closed' && '✅'}
                {activity.type === 'security_fix' && '🔒'}
                {activity.type === 'dependency_update' && '📦'}
              </div>
              
              <div className="flex-1">
                <p className="text-white">
                  <span className="font-bold">{activity.repo}</span>: {activity.message}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}