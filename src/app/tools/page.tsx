'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Zap, Mic, Image, FileText, ArrowRight, Star, Users, Download } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const tools = [
    {
      id: 'voice-to-text',
      title: '语音转文字',
      description: '高精度语音识别，支持多种语言和方言，实时转换语音为文字',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      features: ['实时转换', '多语言支持', '高精度识别', '批量处理'],
      href: '/tools/voice-to-text'
    },
    {
      id: 'image-prompt',
      title: '逆向生成图像提示词',
      description: '基于AI技术，从图片反向生成详细的提示词，帮助您理解和复制图像风格',
      icon: Image,
      color: 'from-purple-500 to-pink-500',
      features: ['图像分析', '风格识别', '提示词生成', '创意灵感'],
      href: '/tools/image-prompt'
    },
    {
      id: 'knowledge-card',
      title: '根据文字生成知识卡片',
      description: '将复杂信息转化为易于理解和记忆的知识卡片，提高学习效率',
      icon: FileText,
      color: 'from-green-500 to-teal-500',
      features: ['智能摘要', '卡片设计', '知识整理', '导出分享'],
      href: '/tools/knowledge-card'
    }
  ]

  const stats = [
    { value: '1M+', label: '用户使用次数' },
    { value: '50+', label: '支持语言' },
    { value: '99.9%', label: '服务可用性' },
    { value: '24/7', label: '全天候服务' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
                <Link href="/strategy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">战略隆中会</Link>
                <Link href="/hypermind" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">升维口令</Link>
                <Link href="/diagnose" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">诊断口令</Link>
                <span className="text-blue-600 font-medium">AI实用工具</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                    <span>✨</span>
                    <span>登录</span>
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI实用工具集
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              集成最新AI技术，为您提供高效、智能的实用工具，提升工作和学习效率
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200">
                <span className="text-blue-700 font-medium">🤖 AI驱动</span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200">
                <span className="text-green-700 font-medium">⚡ 高效便捷</span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                <span className="text-purple-700 font-medium">🎯 精准智能</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="group">
                  <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/80 hover:shadow-xl transition-all duration-300 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{tool.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
                    
                    <div className="space-y-2 mb-8">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link 
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
                    >
                      <span>立即使用</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Features Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">为什么选择我们的AI工具？</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">顶级AI技术</h3>
                <p className="text-gray-600">采用最先进的AI模型和算法，确保处理结果的准确性和高质量</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">用户友好</h3>
                <p className="text-gray-600">简洁直观的界面设计，无需专业技能，人人都能轻松上手使用</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">多格式支持</h3>
                <p className="text-gray-600">支持多种输入和输出格式，满足不同场景的使用需求</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备体验AI工具的强大功能？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            立即登录，免费使用我们的AI工具集，提升您的工作效率
          </p>
          <SignedOut>
            <SignInButton>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                免费开始使用
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-wrap justify-center gap-4">
              {tools.map((tool) => (
                <Link 
                  key={tool.id}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </SignedIn>
        </div>
      </section>
    </div>
  )
}