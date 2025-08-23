'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useState, useRef } from 'react'
import { Zap, Mic, MicOff, Play, Pause, Download, Copy, RefreshCw, Upload } from 'lucide-react'
import Link from 'next/link'

export default function VoiceToTextPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startRecording = () => {
    setIsRecording(true)
    // 模拟录音开始
    setTimeout(() => {
      setIsRecording(false)
      setIsProcessing(true)
      
      // 模拟转换过程
      setTimeout(() => {
        setTranscription('这是一段模拟的语音转换文字结果。在实际应用中，这里会显示真实的语音识别结果。AI技术可以准确识别多种语言和方言，包括中文、英文等。识别精度可达99%以上，支持实时转换和批量处理。')
        setIsProcessing(false)
      }, 3000)
    }, 5000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsProcessing(true)
    
    setTimeout(() => {
      setTranscription('录音已停止。这是转换得到的文字内容...')
      setIsProcessing(false)
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setIsProcessing(true)
      
      setTimeout(() => {
        setTranscription(`已处理音频文件: ${file.name}\n\n转换结果: 这是从上传的音频文件中提取的文字内容。系统支持多种音频格式，包括MP3、WAV、M4A等。AI算法会自动优化音频质量，提高识别准确率。`)
        setIsProcessing(false)
      }, 4000)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription)
    alert('文字已复制到剪贴板')
  }

  const downloadText = () => {
    const blob = new Blob([transcription], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transcription.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
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
                <Link href="/tools" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">AI工具</Link>
                <span className="text-blue-600 font-medium">语音转文字</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                    登录使用
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

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">语音转文字</h1>
            <p className="text-lg text-gray-600">高精度AI语音识别，支持实时录音和文件上传</p>
          </div>

          {/* Main Tool Interface */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Recording Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">实时录音</h2>
                
                <div className="text-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl transform hover:scale-105'}`}
                  >
                    {isRecording ? (
                      <MicOff className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </button>
                  
                  <div className="mt-4">
                    {isRecording && (
                      <div className="text-red-600 font-medium">🔴 正在录音...</div>
                    )}
                    {isProcessing && (
                      <div className="text-blue-600 font-medium flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        正在转换...
                      </div>
                    )}
                    {!isRecording && !isProcessing && (
                      <div className="text-gray-600">点击开始录音</div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-medium text-blue-900 mb-2">录音提示</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 请确保麦克风权限已开启</li>
                    <li>• 建议在安静环境中录音</li>
                    <li>• 说话清晰，语速适中</li>
                    <li>• 支持中文、英文等多种语言</li>
                  </ul>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">上传音频文件</h2>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    点击上传音频文件
                  </div>
                  <div className="text-sm text-gray-500">
                    支持 MP3, WAV, M4A, AAC 等格式
                  </div>
                  {audioFile && (
                    <div className="mt-4 text-blue-600 font-medium">
                      已选择: {audioFile.name}
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-medium text-green-900 mb-2">支持格式</h3>
                  <div className="text-sm text-green-700 grid grid-cols-2 gap-1">
                    <div>• MP3 文件</div>
                    <div>• WAV 文件</div>
                    <div>• M4A 文件</div>
                    <div>• AAC 文件</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {transcription && (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">转换结果</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </button>
                  <button
                    onClick={downloadText}
                    className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 min-h-[200px]">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {transcription}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                字数统计: {transcription.length} 字符
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">高精度识别</h3>
              <p className="text-gray-600">采用最新AI技术，识别准确率高达99%</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
              <p className="text-gray-600">支持实时录音转换和批量文件处理</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式导出</h3>
              <p className="text-gray-600">支持文本复制和多种格式文件下载</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}