import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '姜博士爆款文章口令（Fery定制版） - AIXien',
  description: '基于爆款写作理论的AI创作平台，帮助您打造具有爆款特质的文章内容。',
  keywords: '姜博士,爆款文章,创作指导,写作技巧,AI写作,内容营销,Fery',
}

export default function ViralWritingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}