import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '姜博士升维口令 - AIXien',
  description: '基于第一性原理的AI深度分析平台，帮助您提升思维维度，深度分析问题本质。',
  keywords: '姜博士,升维分析,第一性原理,AI分析,深度思考',
}

export default function HypermindLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}