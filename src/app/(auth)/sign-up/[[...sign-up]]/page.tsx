import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">加入 AIXien</h1>
          <p className="text-gray-600">创建您的账户，开始AI之旅</p>
        </div>

        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm normal-case',
              card: 'shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
              socialButtonsBlockButtonText: 'text-gray-700 font-medium',
              formFieldInput: 'rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              footerActionLink: 'text-blue-600 hover:text-blue-500'
            }
          }}
        />

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="font-medium text-yellow-800 text-center">
            🎉 内测期间前10个名额，立即注册享受终身优惠！
          </p>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700">返回首页</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-700">隐私政策</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-700">服务条款</a>
          </div>
        </div>
      </div>

      {/* 浮动装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-8 h-8 bg-pink-200 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  )
}