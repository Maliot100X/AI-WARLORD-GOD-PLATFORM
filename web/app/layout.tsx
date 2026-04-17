import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SkillsProvider } from '@/contexts/skills-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <body className={inter.className}>
        <SkillsProvider>
          {children}
        </SkillsProvider>
      </body>
    </html>
  )
}