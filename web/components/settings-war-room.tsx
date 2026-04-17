'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Shield, Key, Database,
  Save, RefreshCw, AlertTriangle,
  ToggleLeft, ToggleRight, ChevronRight,
  Globe, Github, Terminal, Zap
} from 'lucide-react'

export function SettingsWarRoom() {
  const [settings, setSettings] = useState({
    general: {
      darkMode: true,
      notifications: true,
      autoSave: true,
      telemetry: false
    },
    security: {
      twoFactor: true,
      apiEncryption: true,
      rateLimit: '1000/hour',
      sessionTimeout: '30m'
    },
    api: {
      baseUrl: 'https://api.aiwarlord.com',
      version: 'v2',
      timeout: 30000,
      retries: 3
    },
    agents: {
      maxConcurrent: 10,
      autoRestart: true,
      logLevel: 'info',
      performanceMode: 'balanced'
    },
    trading: {
      enabled: false,
      maxRisk: 5,
      stopLoss: 2,
      takeProfit: 10
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const sections = [
    {
      id: 'general',
      name: 'General',
      icon: Settings,
      description: 'Basic application settings'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Security and privacy controls'
    },
    {
      id: 'api',
      name: 'API Configuration',
      icon: Database,
      description: 'API endpoints and settings'
    },
    {
      id: 'agents',
      name: 'Agent Settings',
      icon: Terminal,
      description: 'AI agent configuration'
    },
    {
      id: 'trading',
      name: 'Trading Settings',
      icon: Zap,
      description: 'Trading bot configuration'
    }
  ]

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [key]: value
      }
    }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    }, 1500)
  }

  const resetSettings = () => {
    setSaveStatus('reset')
    setTimeout(() => setSaveStatus(null), 3000)
  }

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {enabled ? (
        <ToggleRight className="h-6 w-6 text-blue-400" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-gray-400" />
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-settings-purple to-settings-blue bg-clip-text text-transparent">
            SETTINGS WAR ROOM
          </h2>
          <p className="text-gray-400">Configure your AI Warlord platform</p>
        </div>
        <div className="flex items-center space-x-2">
          {saveStatus === 'success' && (
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center space-x-1">
              <Save className="w-4 h-4" />
              <span>Saved</span>
            </div>
          )}
          {saveStatus === 'reset' && (
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center space-x-1">
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </div>
          )}
          <button
            onClick={resetSettings}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isSaving 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-settings-purple to-settings-blue hover:shadow-lg'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium mb-4">Sections</h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{section.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-6 h-6 text-settings-purple" />
              <h3 className="text-lg font-medium">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-gray-400">Enable dark theme</p>
                </div>
                <ToggleSwitch
                  enabled={settings.general.darkMode}
                  onChange={() => updateSetting('general', 'darkMode', !settings.general.darkMode)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-gray-400">Receive system notifications</p>
                </div>
                <ToggleSwitch
                  enabled={settings.general.notifications}
                  onChange={() => updateSetting('general', 'notifications', !settings.general.notifications)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto Save</h4>
                  <p className="text-sm text-gray-400">Automatically save changes</p>
                </div>
                <ToggleSwitch
                  enabled={settings.general.autoSave}
                  onChange={() => updateSetting('general', 'autoSave', !settings.general.autoSave)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Telemetry</h4>
                  <p className="text-sm text-gray-400">Share anonymous usage data</p>
                </div>
                <ToggleSwitch
                  enabled={settings.general.telemetry}
                  onChange={() => updateSetting('general', 'telemetry', !settings.general.telemetry)}
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-medium">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400">Require 2FA for login</p>
                </div>
                <ToggleSwitch
                  enabled={settings.security.twoFactor}
                  onChange={() => updateSetting('security', 'twoFactor', !settings.security.twoFactor)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">API Encryption</h4>
                  <p className="text-sm text-gray-400">Encrypt all API traffic</p>
                </div>
                <ToggleSwitch
                  enabled={settings.security.apiEncryption}
                  onChange={() => updateSetting('security', 'apiEncryption', !settings.security.apiEncryption)}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Rate Limit</h4>
                <select
                  value={settings.security.rateLimit}
                  onChange={(e) => updateSetting('security', 'rateLimit', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
                >
                  <option value="500/hour">500 requests/hour</option>
                  <option value="1000/hour">1000 requests/hour</option>
                  <option value="5000/hour">5000 requests/hour</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
              <div>
                <h4 className="font-medium mb-2">Session Timeout</h4>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
                >
                  <option value="15m">15 minutes</option>
                  <option value="30m">30 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-medium">API Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Base URL</h4>
                <input
                  type="text"
                  value={settings.api.baseUrl}
                  onChange={(e) => updateSetting('api', 'baseUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">API Version</h4>
                <select
                  value={settings.api.version}
                  onChange={(e) => updateSetting('api', 'version', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
                >
                  <option value="v1">v1</option>
                  <option value="v2">v2</option>
                  <option value="v3">v3 (Beta)</option>
                </select>
              </div>
              <div>
                <h4 className="font-medium mb-2">Timeout (ms)</h4>
                <input
                  type="number"
                  value={settings.api.timeout}
                  onChange={(e) => updateSetting('api', 'timeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Retry Attempts</h4>
                <input
                  type="number"
                  value={settings.api.retries}
                  onChange={(e) => updateSetting('api', 'retries', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}