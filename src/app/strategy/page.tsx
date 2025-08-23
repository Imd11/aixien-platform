'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Zap, Target, Users, TrendingUp, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function StrategyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold">AIXien</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">首页</Link>
                <span className="text-indigo-600 font-medium">战略隆中会</span>
                <Link href="/hypermind" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">升维口令</Link>
                <Link href="/diagnose" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">诊断口令</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                    登录参与
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              战略隆中会
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              （此项目待上线）
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}