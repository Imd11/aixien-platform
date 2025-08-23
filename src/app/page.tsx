'use client'

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Zap, ChevronDown, ArrowUp, Bot, Brain, Clock, TrendingUp, Check, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'

export default function Home() {
  const { isSignedIn } = useUser()
  const [userInput, setUserInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [showResponse, setShowResponse] = useState(false)
  const [isMonthly, setIsMonthly] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Ensure always light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  const handleAIChat = async () => {
    // 检查用户是否登录
    if (!isSignedIn) {
      setShowLoginPrompt(true)
      return
    }

    if (!userInput.trim()) return

    setShowResponse(true)
    setAiResponse('正在思考中...')
    
    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        `关于"${userInput}"，我认为需要从战略维度来思考。战略不是解决问题，战略是升维让问题不存在。`,
        `对于"${userInput}"这个问题，我建议从三个维度来分析：\n1. 现状分析\n2. 目标设定\n3. 路径规划\n\n让我们一起升维思考。`,
        `"${userInput}"是一个很好的问题。在商业实践中，我们需要跳出具体问题，思考更高层次的解决方案。`
      ]
      setAiResponse(responses[Math.floor(Math.random() * responses.length)])
    }, 2000)
  }

  const handleFeatureClick = (url: string) => {
    // 对于外部链接，直接打开，无需登录检查
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    
    // 对于内部链接，检查登录状态
    if (!isSignedIn) {
      setShowLoginPrompt(true)
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="scroll-smooth">
      {/* Header */}
      <header>
        <div className="nav-container">
          <div className="nav-left">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="logo">AIXien</span>
            </div>
            <nav className="hidden md:flex">
              <a href="#hero" className="active">虚拟姜博士</a>
              <button onClick={() => handleFeatureClick('/strategy')} className="nav-link">战略隆中会</button>
              <div className="dropdown">
                <a href="#theory-apps" className="dropdown-toggle">
                  姜博士理论AI应用
                  <ChevronDown className="w-4 h-4 inline ml-1" />
                </a>
                <div className="dropdown-content">
                  <button onClick={() => handleFeatureClick('/hypermind')} className="dropdown-item">姜博士升维口令</button>
                  <button onClick={() => handleFeatureClick('/diagnose')} className="dropdown-item">姜博士三加一诊断口令</button>
                </div>
              </div>
              <div className="dropdown">
                <a href="#ai-tools" className="dropdown-toggle">
                  AI实用工具
                  <ChevronDown className="w-4 h-4 inline ml-1" />
                </a>
                <div className="dropdown-content">
                  <button onClick={() => handleFeatureClick('/tools/voice-to-text')} className="dropdown-item">语音转文字</button>
                  <button onClick={() => handleFeatureClick('#knowledge-card')} className="dropdown-item">根据文字生成知识卡片</button>
                  <button onClick={() => handleFeatureClick('/tools/html-to-image')} className="dropdown-item">HTML转图像</button>
                </div>
              </div>
              <div className="dropdown">
                <a href="#external-tools" className="dropdown-toggle">
                  外部工具
                  <ChevronDown className="w-4 h-4 inline ml-1" />
                </a>
                <div className="dropdown-content">
                  <button onClick={() => handleFeatureClick('https://huggingface.co/spaces/fancyfeast/joy-caption-pre-alpha')} className="dropdown-item">逆向生成图像提示词</button>
                  <button onClick={() => handleFeatureClick('https://www.runoob.com/runcode')} className="dropdown-item">HTML渲染</button>
                  <button onClick={() => handleFeatureClick('https://mermaid.live')} className="dropdown-item">Mermaid在线编译</button>
                </div>
              </div>
              <div className="dropdown">
                <a href="#common-links" className="dropdown-toggle">
                  常用链接
                  <ChevronDown className="w-4 h-4 inline ml-1" />
                </a>
                <div className="dropdown-content">
                  <button onClick={() => handleFeatureClick('https://chatgpt.com/')} className="dropdown-item">ChatGPT</button>
                  <button onClick={() => handleFeatureClick('https://gemini.google.com/app')} className="dropdown-item">Gemini</button>
                  <button onClick={() => handleFeatureClick('https://claude.ai/new')} className="dropdown-item">Claude</button>
                  <button onClick={() => handleFeatureClick('https://grok.com/')} className="dropdown-item">Grok</button>
                  <button onClick={() => handleFeatureClick('https://www.google.com/intl/zh-CN/chrome/')} className="dropdown-item">Chrome浏览器下载</button>
                  <button onClick={() => handleFeatureClick('https://pan.baidu.com/s/1Ut3Fd9BFtt9s0au8fSKS4w?pwd=cf95')} className="dropdown-item">Typora下载</button>
                </div>
              </div>
              <a href="#about">关于作者</a>
            </nav>
          </div>
          <div className="nav-right">
            <SignedOut>
              <SignInButton>
                <button className="login-button">
                  <span className="star-icon">✨</span>
                  <span>登录</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Featured Carousel */}
      <section className="featured-carousel">
        <div className="carousel-card">
          <img src="https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=姜博士最新峰会展示" alt="峰会展示" className="carousel-bg" />
          <div className="carousel-content">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                AI工具
              </span>
              <span className="ml-2 text-sm opacity-90">2025/4/27</span>
            </div>
            <h1>姜博士最新峰会展示</h1>
            <p className="text-xl opacity-90 mb-6">战略不是解决问题，战略是升维让问题不存在</p>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <PlayCircle className="w-5 h-5" />
                <span>观看视频</span>
              </button>
            </div>
          </div>
          <div className="carousel-controls">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Hero Section */}
      <section id="hero" className="creator-tool">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>虚拟姜博士</h2>
            <p>随时随地与姜博士对话，24h为您在线答疑</p>
          </div>
          
          <div className="input-area">
            <textarea 
              id="user-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="输入您想要问的问题..."
            />
            <button 
              id="generate-button"
              onClick={handleAIChat}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
          
          {/* Features of Virtual Dr. Jiang */}
          <div className="gallery mt-12">
            <div className="card">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI智能对话</h3>
              <p className="text-gray-600">基于先进的大语言模型，提供专业的咨询服务</p>
            </div>
            
            <div className="card">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24小时在线</h3>
              <p className="text-gray-600">随时随地获得专业答疑，不受时间限制</p>
            </div>
            
            <div className="card">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">战略升维</h3>
              <p className="text-gray-600">战略不是解决问题，是升维让问题不存在</p>
            </div>
          </div>
              
          {/* AI Response Area */}
          {showResponse && (
            <div id="ai-response" className="mt-8 bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-4">
                <Bot className="w-6 h-6 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">姜博士回复</span>
              </div>
              <div id="response-content" className="text-gray-700 leading-relaxed">
                <MarkdownRenderer content={aiResponse} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="introduction">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>为什么选择"锡恩咨询"？</h2>
            <p className="text-xl text-gray-600">姜博士带你提升维度</p>
          </div>
          
          <div className="gallery">
            <div className="card">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">20年战略经验</h3>
              <p className="text-gray-600">中国企业战略执行第一人</p>
            </div>
            
            <div className="card">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">独创理论体系</h3>
              <p className="text-gray-600">战略&哲学体系</p>
            </div>
            
            <div className="card">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI赋能创新</h3>
              <p className="text-gray-600">将姜博士的战略智慧与AI技术深度融合，让每个企业都能享受顶级战略咨询</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2>定价</h2>
            <p className="text-xl text-gray-600 mb-8">选择最适合您的计划。所有付费计划都包括全部功能的访问。</p>
            
            {/* Billing Toggle */}
            <div className="billing-cycle-switcher">
              <button 
                onClick={() => setIsMonthly(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isMonthly ? 'bg-white shadow-sm' : ''
                }`}
              >
                按月
              </button>
              <button 
                onClick={() => setIsMonthly(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium text-gray-600 flex items-center ${
                  !isMonthly ? 'bg-white shadow-sm' : ''
                }`}
              >
                年付
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">5折</span>
              </button>
            </div>
            
            {/* Limited Offer Banner */}
            <div className="promo-banner">
              <p className="font-medium">内测期间前10个名额，立刻加入，享受终身优惠</p>
            </div>
          </div>
          
          <div className="pricing-plans">
            {/* Free Plan */}
            <div className="plan">
              <div className="text-center mb-8">
                <h3>免费版</h3>
                <p className="text-gray-600 text-sm mb-4">适合试用和体验</p>
                <div className="price">$0</div>
                <div className="text-gray-600 text-sm">USD</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">每天 10 次虚拟姜博士对话</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">基础理论a工具使用</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">社群内容分享</span>
                </li>
              </ul>
              <button disabled>当前计划</button>
            </div>
            
            {/* Lite Plan */}
            <div className="plan">
              <div className="text-center mb-8">
                <h3>轻量版</h3>
                <p className="text-gray-600 text-sm mb-4">适合每日轻度阅读</p>
                <div className="price">${isMonthly ? '7.5' : '90.0'}</div>
                <div className="text-gray-600 text-sm">USD / {isMonthly ? '每月' : '每年'}</div>
                {!isMonthly && <div className="text-sm text-gray-500 mt-2">90.0 USD / 每年 5折</div>}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">每天 100 次虚拟姜博士对话</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">升维口令 + 三加一诊断</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">战略隆中会分析报告</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">实用AI工具套件</span>
                </li>
              </ul>
              <button className="cta">升级到 轻量版</button>
            </div>
            
            {/* Standard Plan (Recommended) */}
            <div className="plan recommended">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">
                推荐
              </div>
              <div className="text-center mb-8">
                <h3>标准版</h3>
                <p className="text-gray-600 text-sm mb-4">适合每日阅读</p>
                <div className="price">${isMonthly ? '14.9' : '178.8'}</div>
                <div className="text-gray-600 text-sm">USD / {isMonthly ? '每月' : '每年'}</div>
                {!isMonthly && <div className="text-sm text-gray-500 mt-2">178.8 USD / 每年 5折</div>}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">每天 500 次虚拟姜博士对话</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">全部理论AI应用</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">专业战略咨询指导</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">每月一对一答疑</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">优先客服支持</span>
                </li>
              </ul>
              <button className="cta">升级到 标准版</button>
            </div>
            
            {/* Advanced Plan */}
            <div className="plan">
              <div className="text-center mb-8">
                <h3>高级版</h3>
                <p className="text-gray-600 text-sm mb-4">适合每日专业文字阅读和写作</p>
                <div className="price">${isMonthly ? '29.9' : '358.8'}</div>
                <div className="text-gray-600 text-sm">USD / {isMonthly ? '每月' : '每年'}</div>
                {!isMonthly && <div className="text-sm text-gray-500 mt-2">358.8 USD / 每年 5折</div>}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">无限次虚拟姜博士对话</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">全部功能无限使用</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">每周姜博士直播课程</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">企业战略定制咨询</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">API接入 + 专属客服</span>
                </li>
              </ul>
              <button className="cta">升级到 高级版</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          {/* Links */}
          <div className="footer-column">
            <h4>相关链接</h4>
            <a href="#" target="_blank" rel="noopener noreferrer">战略隆中会社群</a>
            <a href="#" target="_blank" rel="noopener noreferrer">AI网址导航</a>
            <a href="#" target="_blank" rel="noopener noreferrer">隐私协议</a>
            <a href="#" target="_blank" rel="noopener noreferrer">服务条款</a>
          </div>
          
          {/* Social Media */}
          <div className="footer-column">
            <h4>社交媒体</h4>
            <a href="#" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="#" target="_blank" rel="noopener noreferrer">微博</a>
          </div>
          
          {/* Contact */}
          <div className="footer-column">
            <h4>联系我们（扫码添加微信）</h4>
            <div className="bg-gray-800 p-4 rounded-lg">
              <img 
                src="https://raw.githubusercontent.com/Imd11/qrcode/main/WeChatQRcode.jpg" 
                alt="微信二维码" 
                className="qr-code"
              />
              <p className="text-sm text-gray-400 mt-2">扫码添加微信</p>
            </div>
          </div>
          
          {/* Company Info */}
          <div className="footer-column">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">AIXien</span>
            </div>
            <p className="text-gray-400 text-sm">专业的AI工具平台，让AI助力您的创作与思考</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AIXien. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Prompt Modal - Jobs Style */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-[20px] p-0 max-w-[400px] w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/20">
            {/* Header Section */}
            <div className="px-8 pt-12 pb-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-[28px] font-light text-gray-900 mb-3 tracking-tight">
                继续使用
              </h3>
              <p className="text-[16px] text-gray-500 font-normal leading-relaxed">
                登录以访问您的 AI 助手
              </p>
            </div>
            
            {/* Action Section */}
            <div className="px-8 pb-8">
              <SignInButton>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[17px] font-medium py-4 rounded-[12px] transition-all duration-200 ease-out mb-3 shadow-sm active:scale-[0.98]">
                  登录
                </button>
              </SignInButton>
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="w-full text-blue-500 hover:text-blue-600 text-[17px] font-normal py-3 transition-colors duration-200"
              >
                稍后
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}