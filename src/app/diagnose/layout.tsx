import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '姜博士三加一诊断口令 - AIXien',
  description: '基于三加一模式的问题阶段诊断，专业的AI诊断平台，精准识别问题阶段。',
  keywords: '姜博士,三加一诊断,问题诊断,AI诊断,企业诊断',
}

export default function DiagnoseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}