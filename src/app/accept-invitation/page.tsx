'use client'

import { SignIn } from '@clerk/nextjs'
import { Zap } from 'lucide-react'

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            欢迎加入 AIXien
          </h1>
          <p className="text-gray-600">
            请完成账户设置以开始使用
          </p>
        </div>
        
        {/* Clerk Sign In Component */}
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-none bg-transparent",
              headerTitle: "hidden",
              headerSubtitle: "hidden"
            }
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  )
}