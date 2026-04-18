import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SkillsProvider } from '@/contexts/skills-context'
import { WebSocketProvider } from '@/contexts/WebSocketContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AI Warlord God Platform',
  description: 'Control 100+ subagents, Crypto Trading, Zero-Code API Factory, GitHub Takeover, VPS Army - ALL IN ONE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-warlord-dark">
      <body className={`${inter.variable} font-sans`}>
        <WebSocketProvider>
          <SkillsProvider>
            {children}
          </SkillsProvider>
        </WebSocketProvider>
      </body>
    </html>
  )
}
