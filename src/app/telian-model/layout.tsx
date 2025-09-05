import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特连光电模式（员工版） - AIXien',
  description: '基于第一性原理的员工问题深度分析平台，价值对齐导航系统，帮助企业员工提升思维维度。',
  keywords: '特连光电,员工管理,第一性原理,价值对齐,问题分析',
}

export default function TelianModelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}