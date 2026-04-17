'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// Settings Types
interface GeneralSettings {
  platformName: string
  theme: 'dark' | 'light' | 'auto'
  language: string
  timezone: string
  autoSave: boolean
}

interface AgentsSettings {
  maxConcurrent: number
  defaultModel: string
  timeout: number
  retryAttempts: number
}

interface TradingSettings {
  enabled: boolean
  defaultExchange: string
  maxPositionSize: number
  stopLoss: number
  takeProfit: number
}

interface ApiFactorySettings {
  defaultFramework: 'express' | 'fastify' | 'nextjs'
  autoDeploy: boolean
  rateLimit: number
  corsEnabled: boolean
}

interface GitHubSettings {
  autoSync: boolean
  defaultBranch: string
  autoMerge: boolean
  webhookSecret: string
}

interface AdvancedSettings {
  debugMode: boolean
  loggingLevel: 'error' | 'warn' | 'info' | 'debug'
  performanceMode: boolean
  experimentalFeatures: boolean
}

interface Settings {
  general: GeneralSettings
  agents: AgentsSettings
  trading: TradingSettings
  apiFactory: ApiFactorySettings
  github: GitHubSettings
  vps: {
    defaultProvider: string
    defaultRegion: string
    instanceSize: string
    autoScaling: string
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
    ipWhitelist: string
    auditLog: boolean
  }
  notifications: {
    email: boolean
    slack: boolean
    telegram: boolean
    discord: boolean
  }
  advanced: AdvancedSettings
}

// Settings Categories
const SETTINGS_CATEGORIES = [
  {
    id: 'general',
    name: 'General',
    description: 'Platform-wide settings',
    icon: '⚙️'
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Agent configuration and limits',
    icon: '🤖'
  },
  {
    id: 'trading',
    name: 'Trading',
    description: 'Trading bot settings and API keys',
    icon: '💰'
  },
  {
    id: 'api-factory',
    name: 'API Factory',
    description: 'API generation and deployment',
    icon: '🏭'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repository management and automation',
    icon: '🐙'
  },
  {
    id: 'vps',
    name: 'VPS Army',
    description: 'Server deployment and management',
    icon: '☁️'
  },
  {
    id: 'skills',
    name: 'Skills',
    description: 'Skill library and installation',
    icon: '📚'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Authentication and access control',
    icon: '🔒'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Alert and notification preferences',
    icon: '🔔'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Developer and technical settings',
    icon: '🔧'
  }
]

// Mock Settings Data
const mockSettings = {
  general: {
    platformName: 'AI WARLORD GOD PLATFORM',
    theme: 'dark' as const,
    language: 'en',
    timezone: 'UTC',
    autoSave: true
  },
  agents: {
    maxConcurrent: 50,
    defaultModel: 'claude-opus-4.6',
    timeout: 300,
    retryAttempts: 3
  },
  trading: {
    enabled: true,
    defaultExchange: 'binance',
    maxPositionSize: 10,
    stopLoss: 5,
    takeProfit: 15
  },
  apiFactory: {
    defaultFramework: 'nextjs' as const,
    autoDeploy: true,
    rateLimit: 60,
    corsEnabled: true
  },
  github: {
    autoSync: true,
    defaultBranch: 'main',
    autoMerge: false,
    webhookSecret: 'secret123'
  },
  vps: {
    defaultProvider: 'aws',
    defaultRegion: 'us-east-1',
    instanceSize: 'medium',
    autoScaling: 'disabled'
  },
  security: {
    twoFactor: true,
    sessionTimeout: 3600,
    ipWhitelist: '',
    auditLog: true
  },
  notifications: {
    email: true,
    slack: false,
    telegram: true,
    discord: false
  },
  advanced: {
    debugMode: false,
    loggingLevel: 'info' as const,
    performanceMode: false,
    experimentalFeatures: false
  }
}

export default function SettingsWarRoom() {
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [settings, setSettings] = useState<Settings>(mockSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setHasChanges(false)
    }, 1500)
  }

  const resetSettings = () => {
    setSettings(mockSettings)
    setHasChanges(false)
  }

  const currentSettings = settings[selectedCategory as keyof typeof settings] as any

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings War Room</h2>
          <div className="flex items-center gap-4">
            {hasChanges && (
              <Badge variant="warning">Unsaved Changes</Badge>
            )}
            <Button
              variant="ghost"
              onClick={resetSettings}
              disabled={!hasChanges}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={saveSettings}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2">
          {SETTINGS_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className="flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Settings Content */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {SETTINGS_CATEGORIES.find(c => c.id === selectedCategory)?.name} Settings
          </h3>
          <p className="text-gray-400">
            {SETTINGS_CATEGORIES.find(c => c.id === selectedCategory)?.description}
          </p>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* General Settings */}
          {selectedCategory === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Platform Name</label>
                <Input
                  type="text"
                  value={currentSettings.platformName}
                  onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Theme</label>
                <select
                  value={currentSettings.theme}
                  onChange={(e) => updateSetting('general', 'theme', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Language</label>
                <select
                  value={currentSettings.language}
                  onChange={(e) => updateSetting('general', 'language', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Timezone</label>
                <select
                  value={currentSettings.timezone}
                  onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.autoSave}
                    onChange={(e) => updateSetting('general', 'autoSave', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Auto-save changes</span>
                </label>
              </div>
            </div>
          )}

          {/* Agents Settings */}
          {selectedCategory === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Max Concurrent Agents</label>
                <Input
                  type="number"
                  value={currentSettings.maxConcurrent}
                  onChange={(e) => updateSetting('agents', 'maxConcurrent', parseInt(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Default Timeout (seconds)</label>
                <Input
                  type="number"
                  value={currentSettings.defaultTimeout}
                  onChange={(e) => updateSetting('agents', 'defaultTimeout', parseInt(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Log Level</label>
                <select
                  value={currentSettings.logLevel}
                  onChange={(e) => updateSetting('agents', 'logLevel', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.autoRestart}
                    onChange={(e) => updateSetting('agents', 'autoRestart', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Auto-restart failed agents</span>
                </label>
              </div>
            </div>
          )}

          {/* Trading Settings */}
          {selectedCategory === 'trading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.enabled}
                    onChange={(e) => updateSetting('trading', 'enabled', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Enable Trading Bot</span>
                </label>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Default Strategy</label>
                <select
                  value={currentSettings.defaultStrategy}
                  onChange={(e) => updateSetting('trading', 'defaultStrategy', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="momentum-sniper">Momentum Sniper</option>
                  <option value="volume-breakout">Volume Breakout</option>
                  <option value="whale-hunter">Whale Hunter</option>
                  <option value="arbitrage-engine">Arbitrage Engine</option>
                  <option value="pump-fun-sniper">Pump.fun Sniper</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Max Position Size (SOL)</label>
                <Input
                  type="number"
                  value={currentSettings.maxPositionSize}
                  onChange={(e) => updateSetting('trading', 'maxPositionSize', parseFloat(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Stop Loss (%)</label>
                <Input
                  type="number"
                  value={currentSettings.stopLoss}
                  onChange={(e) => updateSetting('trading', 'stopLoss', parseFloat(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Take Profit (%)</label>
                <Input
                  type="number"
                  value={currentSettings.takeProfit}
                  onChange={(e) => updateSetting('trading', 'takeProfit', parseFloat(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
            </div>
          )}

          {/* API Factory Settings */}
          {selectedCategory === 'api-factory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Rate Limit (requests/min)</label>
                <Input
                  type="number"
                  value={currentSettings.rateLimit}
                  onChange={(e) => updateSetting('apiFactory', 'rateLimit', parseInt(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Cache Duration (seconds)</label>
                <Input
                  type="number"
                  value={currentSettings.cacheDuration}
                  onChange={(e) => updateSetting('apiFactory', 'cacheDuration', parseInt(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Default Authentication</label>
                <select
                  value={currentSettings.defaultAuth}
                  onChange={(e) => updateSetting('apiFactory', 'defaultAuth', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="none">No Auth</option>
                  <option value="api-key">API Key</option>
                  <option value="jwt">JWT</option>
                  <option value="oauth2">OAuth2</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Response Format</label>
                <select
                  value={currentSettings.responseFormat}
                  onChange={(e) => updateSetting('apiFactory', 'responseFormat', e.target.value)}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                >
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                  <option value="csv">CSV</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {selectedCategory === 'security' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.twoFactor}
                    onChange={(e) => updateSetting('security', 'twoFactor', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Enable Two-Factor Authentication</span>
                </label>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Session Timeout (seconds)</label>
                <Input
                  type="number"
                  value={currentSettings.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">IP Whitelist (comma separated)</label>
                <Input
                  type="text"
                  placeholder="192.168.1.1,10.0.0.1"
                  value={currentSettings.ipWhitelist}
                  onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
                  className="bg-gray-800 text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.auditLog}
                    onChange={(e) => updateSetting('security', 'auditLog', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Enable Audit Logging</span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {selectedCategory === 'notifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.email}
                    onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Email Notifications</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.slack}
                    onChange={(e) => updateSetting('notifications', 'slack', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Slack Notifications</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.telegram}
                    onChange={(e) => updateSetting('notifications', 'telegram', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Telegram Notifications</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentSettings.discord}
                    onChange={(e) => updateSetting('notifications', 'discord', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Discord Notifications</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Advanced Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Configuration Export</label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Export JSON</Button>
                  <Button variant="ghost" size="sm">Export YAML</Button>
                  <Button variant="ghost" size="sm">Export ENV</Button>
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Configuration Import</label>
                <input 
                  type="file" 
                  accept=".json,.yaml,.yml,.env"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Danger Zone</label>
                <div className="flex gap-2">
                  <Button variant="danger" size="sm">Reset All Settings</Button>
                  <Button variant="danger" size="sm">Clear Cache</Button>
                  <Button variant="danger" size="sm">Purge Data</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* API Keys Section */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">API Keys & Integrations</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <h4 className="font-bold text-white">GMGN API</h4>
              <p className="text-sm text-gray-400">Trading signals and market data</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Configured</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <h4 className="font-bold text-white">Bybit API</h4>
              <p className="text-sm text-gray-400">Trading execution and account</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Configured</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <h4 className="font-bold text-white">GitHub API</h4>
              <p className="text-sm text-gray-400">Repository management</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Configured</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <h4 className="font-bold text-white">OpenAI API</h4>
              <p className="text-sm text-gray-400">AI model access</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="warning">Not Configured</Badge>
              <Button variant="primary" size="sm">Configure</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}