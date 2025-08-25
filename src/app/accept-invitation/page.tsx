'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // 获取邀请相关的参数
    const invitationToken = searchParams.get('__clerk_invitation_token')
    const redirectUrl = searchParams.get('redirect_url')
    
    // 如果有邀请token，处理邀请逻辑
    if (invitationToken) {
      // 延迟跳转到登录页面，让Clerk有时间处理邀请
      setTimeout(() => {
        router.push('/sign-in')
      }, 2000)
    } else {
      // 没有邀请token，直接跳转到登录页面
      router.push('/sign-in')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          正在处理您的邀请...
        </h1>
        <p className="text-gray-600 mb-6">
          请稍候，我们正在为您设置账户访问权限
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          如果页面没有自动跳转，请点击 
          <a href="/sign-in" className="text-blue-600 hover:underline ml-1">这里</a>
        </p>
      </div>
    </div>
  )
}