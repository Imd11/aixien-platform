import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIXien - 智能分析与诊断平台',
  description: '专业的AI工具平台，让AI助力您的创作与思考。与虚拟姜博士对话，提升思维维度。',
  keywords: '姜博士,AI工具,战略咨询,知识卡片,AI对话',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <head>
          <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDJMMTkgMTRIMTNWMjJMNyAxMEgxM1YyWiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iIzFFM0E4QSIvPgo8L3N2Zz4K" />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}