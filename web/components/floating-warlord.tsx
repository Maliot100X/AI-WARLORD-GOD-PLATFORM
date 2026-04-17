'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, MessageSquare, X, ChevronUp, ChevronDown,
  Zap, Cpu, Brain, Sparkles, Terminal,
  Send, Mic, Image, FileCode, Globe
} from 'lucide-react'
import { useSkills } from '@/contexts/skills-context'
import { useAgent } from '@/contexts/agent-context'
import { useWebSocket } from '@/contexts/websocket-context'

const skillsCategories = {
  'trading': ['ultimate-trading-bot-builder', 'gmgn-trading-bot-master-system', 'bybit-api-testing', 'bybit-api-troubleshooting'],
  'agents': ['autonomous-ai-agents', 'subagent-driven-development', 'hermes-agentrouter-simple-setup', 'hermes-vps-persistence'],
  'api': ['vercel-env-fix', 'webhook-subscriptions', 'api-factory', 'browser-use'],
  'github': ['github-code-review', 'github-pr-workflow', 'github-issues', 'github-repo-management'],
  'devops': ['clawpump-x402-service-deployment', 'vercel-deployment', 'docker-management', 'vps-deployment'],
  'debugging': ['systematic-debugging', 'test-driven-development', 'writing-plans', 'plan-mode'],
}

export function FloatingWarlord() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [activeSkill, setActiveSkill] = useState<any>(null)
  const chatEndRef = useRef<any>(null)
  
  const { skills } = useSkills()
  const { agents } = useAgent()
  const { isConnected, sendMessage } = useWebSocket()

  const totalSkills = skills?.length || 314

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }

    // Find relevant skill for the query
    const query = message.toLowerCase()
    let suggestedSkill = null
    
    if (query.includes('trading') || query.includes('crypto') || query.includes('gmgn') || query.includes('bybit')) {
      suggestedSkill = 'ultimate-trading-bot-builder'
    } else if (query.includes('agent') || query.includes('subagent') || query.includes('deploy')) {
      suggestedSkill = 'autonomous-ai-agents'
    } else if (query.includes('api') || query.includes('website') || query.includes('scrape')) {
      suggestedSkill = 'api-factory'
    } else if (query.includes('github') || query.includes('repo') || query.includes('pr')) {
      suggestedSkill = 'github-code-review'
    } else if (query.includes('debug') || query.includes('error') || query.includes('fix')) {
      suggestedSkill = 'systematic-debugging'
    }

    setChatHistory(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I understand you're asking about "${message}". ${
          suggestedSkill 
            ? `I suggest using the **${suggestedSkill}** skill for this. I have ${totalSkills} skills available including trading bots, agent deployment, API generation, and GitHub automation.`
            : `I can help with that using one of my ${totalSkills} skills. What specifically do you want to accomplish?`
        }`,
        skill: suggestedSkill,
        timestamp: new Date().toISOString()
      }
      setChatHistory(prev => [...prev, aiResponse])
    }, 500)

    setMessage('')
  }

  const quickActions = [
    { icon: Zap, label: 'Deploy Agent Army', action: () => setMessage('Deploy 10 subagents for web scraping') },
    { icon: Terminal, label: 'Start Trading Bot', action: () => setMessage('Start GMGN trading bot with Bybit') },
    { icon: FileCode, label: 'Generate API', action: () => setMessage('Convert website to REST API') },
    { icon: Globe, label: 'Scan Skills.sh', action: () => setMessage('Find and install all skills from skills.sh') },
    { icon: Brain, label: 'Debug System', action: () => setMessage('Systematic debugging of current errors') },
  ]

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-warlord-purple to-warlord-pink shadow-2xl flex items-center justify-center group"
        >
          <Bot className="w-8 h-8 text-white" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-warlord-cyan rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">{totalSkills}</span>
          </div>
          <div className="absolute -bottom-12 right-0 bg-black/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Warlord Assistant
          </div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 ${
              isMinimized ? 'w-80' : 'w-96'
            } bg-warlord-darker border border-warlord-purple/30 rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-warlord-purple/20 to-warlord-pink/20 p-4 border-b border-warlord-purple/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warlord-purple to-warlord-pink flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white">AI WARLORD ASSISTANT</div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{totalSkills} skills • {agents?.length || 0} agents active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                {/* Chat History */}
                <div className="h-64 overflow-y-auto p-4 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-warlord-purple/50 mx-auto mb-3" />
                      <div className="text-lg font-bold">AI WARLORD ASSISTANT</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        I know {totalSkills} skills including trading bots, agent deployment,<br />
                        API generation, GitHub automation, and systematic debugging.
                      </div>
                      <div className="mt-4 text-xs text-warlord-cyan">
                        Ask me anything about the platform!
                      </div>
                    </div>
                  ) : (
                    <>
                      {chatHistory.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-warlord-purple/20 ml-8'
                              : 'bg-black/30 mr-8'
                          }`}
                        >
                          <div className="text-sm">{msg.content}</div>
                          {msg.skill && (
                            <div className="mt-2 text-xs text-warlord-cyan">
                              Suggested skill: <span className="font-bold">{msg.skill}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-warlord-purple/20">
                  <div className="text-xs text-muted-foreground mb-2">QUICK ACTIONS</div>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className="flex-1 min-w-[120px] px-3 py-2 bg-black/50 border border-warlord-purple/20 rounded-lg hover:bg-warlord-purple/10 transition-colors text-xs flex items-center space-x-2"
                      >
                        <action.icon className="w-3 h-3" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-warlord-purple/20">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about trading, agents, APIs, GitHub, debugging..."
                      className="flex-1 bg-black/50 border border-warlord-purple/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-warlord-purple"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-gradient-to-r from-warlord-purple to-warlord-pink rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Type <span className="text-warlord-cyan">/help</span> for commands • 
                    <span className="text-warlord-purple mx-2">{totalSkills}</span> skills available
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}