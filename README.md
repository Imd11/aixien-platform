# AIXien Platform - 智能分析与诊断平台

AIXien Platform 是一个集成了多种AI功能的统一平台，包括虚拟姜博士对话、升维口令分析、三加一诊断、战略隆中会以及各种AI实用工具。

## 🚀 功能特性

- **虚拟姜博士**: 24小时在线AI对话，提供战略咨询和升维思考
- **姜博士理论AI应用**:
  - 升维口令分析 (基于第一性原理的深度分析)
  - 三加一诊断口令 (基于三加一模式的问题阶段诊断)
- **战略隆中会**: 企业战略规划和智慧汇聚
- **AI实用工具**: 语音转文字、图像提示词生成、知识卡片制作等
- **用户认证**: 基于Clerk的完整用户管理系统
- **主题切换**: 支持日间/夜间模式切换
- **响应式设计**: 适配各种设备和屏幕尺寸

## 📋 目录

- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [本地部署](#本地部署)
- [配置说明](#配置说明)
- [Clerk认证配置](#clerk认证配置)
- [导航栏自定义](#导航栏自定义)
- [主题系统](#主题系统)
- [部署到生产环境](#部署到生产环境)
- [常见问题](#常见问题)

## 📁 项目结构

```
aixien-platform/
├── README.md                    # 项目说明文档
├── package.json                 # 项目依赖和脚本
├── next.config.js              # Next.js 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
├── .env.local                  # 环境变量配置（需要创建）
├── .gitignore                  # Git 忽略文件
│
├── src/                        # 源代码目录
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx          # 根布局组件
│   │   ├── page.tsx            # 主页组件（虚拟姜博士+主题切换）
│   │   ├── globals.css         # 全局样式文件（日间/夜间模式）
│   │   │
│   │   ├── (auth)/             # 认证相关页面组
│   │   │   ├── sign-in/        # 登录页面
│   │   │   └── sign-up/        # 注册页面
│   │   │
│   │   ├── hypermind/          # 🧠 升维口令功能（独立完整系统）
│   │   │   ├── layout.tsx      # 专用布局文件
│   │   │   ├── page.tsx        # 主页面
│   │   │   └── lib/            # 🔧 独立的业务逻辑层
│   │   │       ├── gemini.ts   # 升维口令专用API引擎
│   │   │       └── prompts.ts  # 升维口令专用提示词配置
│   │   │
│   │   ├── diagnose/           # 🔍 三加一诊断功能（独立完整系统）
│   │   │   ├── layout.tsx      # 专用布局文件  
│   │   │   ├── page.tsx        # 主页面
│   │   │   └── lib/            # 🔧 独立的业务逻辑层
│   │   │       ├── gemini.ts   # 诊断口令专用API引擎
│   │   │       └── prompts.ts  # 诊断口令专用提示词配置
│   │   │
│   │   ├── strategy/           # 📊 战略隆中会
│   │   │   └── page.tsx        # 主页面
│   │   │
│   │   └── tools/              # 🛠️ AI实用工具
│   │       ├── page.tsx        # 工具首页
│   │       └── voice-to-text/  # 语音转文字工具
│   │           └── page.tsx
│   │
│   ├── components/             # 可复用组件
│   │   ├── analysis/           # 分析相关组件
│   │   │   ├── InputSection.tsx           # 通用输入组件
│   │   │   ├── SimpleResultsSection.tsx   # 结果展示组件
│   │   │   ├── DiagnoseInputSection.tsx   # 诊断专用输入组件
│   │   │   └── DiagnoseResultsSection.tsx # 诊断专用结果组件
│   │   │
│   │   ├── shared/             # 跨功能共享组件
│   │   ├── strategy/           # 战略功能专用组件
│   │   └── tools/              # 工具功能专用组件
│   │
│   ├── lib/                    # 核心工具库和配置
│   │   ├── shared/             # 🌐 共享工具和配置
│   │   │   ├── config.ts       # 🔧 API配置和通用调用函数
│   │   │   ├── index.ts        # 导出文件
│   │   │   └── types.ts        # 全局类型定义
│   │   │
│   │   ├── analysis/           # ⚠️ 已弃用：原通用分析功能
│   │   │   ├── fileProcessor.ts # 文件处理工具
│   │   │   └── gemini.ts       # 原通用Gemini集成
│   │   │
│   │   └── strategy/           # 战略功能相关（预留扩展）
│   │
│   ├── middleware.ts           # Next.js 中间件（Clerk认证）
│   └── types/                  # 全局类型定义（预留）
│
├── public/                     # 静态资源
│   ├── next.svg               # Next.js 图标
│   ├── vercel.svg             # Vercel 图标
│   └── ...                    # 其他静态资源
│
└── node_modules/              # 项目依赖（自动生成）
```

### 🏗️ 新架构设计理念

#### 📦 功能页面独立系统
每个功能页面现在都是一个独立的完整系统：
- **独立的API引擎**: 每个功能都有专属的Gemini API配置
- **专用提示词**: 每个功能都有量身定制的AI提示词
- **独立的业务逻辑**: 不依赖全局共享，便于维护和扩展

#### 🔄 扩展性设计
- **新功能添加**: 只需在`src/app/`下创建新文件夹，添加对应的`lib/`目录
- **提示词管理**: 每个功能的提示词独立在`lib/prompts.ts`中
- **API配置**: 统一使用`/src/lib/shared/config.ts`的通用配置
- **类型定义**: 共享类型在`/src/lib/shared/types.ts`中定义

### 各文件夹详细用途

#### `/src/app/` - 应用页面
- **layout.tsx**: 根布局，包含Clerk Provider和全局样式
- **page.tsx**: 主页，包含虚拟姜博士、主题切换、轮播图、定价等
- **globals.css**: 全局CSS样式，包含日间/夜间模式主题变量和响应式设计
- **(auth)/**: 用户认证页面，使用Clerk组件

#### `/src/app/hypermind/` - 升维口令独立系统
- **page.tsx**: 升维口令主页面
- **layout.tsx**: 专用布局和元数据
- **lib/gemini.ts**: 升维口令专用API引擎类
- **lib/prompts.ts**: 升维口令专用提示词配置

#### `/src/app/diagnose/` - 三加一诊断独立系统
- **page.tsx**: 三加一诊断主页面
- **layout.tsx**: 专用布局和元数据
- **lib/gemini.ts**: 诊断专用API引擎类
- **lib/prompts.ts**: 诊断专用提示词配置（全新的三加一诊断模式）

#### `/src/app/strategy/` & `/src/app/tools/` - 其他功能页面
- **strategy/**: 战略隆中会页面
- **tools/**: AI实用工具集合页面

#### `/src/components/` - 可复用组件
- **analysis/**: 分析功能相关的UI组件
- **shared/**: 跨功能共享的通用组件
- **strategy/**: 战略功能专用组件
- **tools/**: 工具功能专用组件

#### `/src/lib/` - 工具库
- **analysis/**: 分析功能的业务逻辑和API集成
- **shared/**: 共享的工具函数和类型定义
- **strategy/**: 战略功能的业务逻辑

#### `/src/middleware.ts` - 中间件
- 处理Clerk认证和路由保护
- 配置公开路径和受保护路径

## 🔧 环境要求

- **Node.js**: 18.0 或更高版本
- **npm**: 8.0 或更高版本
- **Clerk账户**: 用于用户认证
- **Gemini API密钥**: 用于AI功能

## 🚀 本地部署

### 1. 克隆项目
```bash
cd /path/to/your/projects
# 如果项目还未在Git仓库中，需要先初始化
git init
git add .
git commit -m "Initial commit"
```

### 2. 安装依赖
```bash
cd aixien-platform
npm install
```

### 3. 环境变量配置
创建 `.env.local` 文件：
```bash
# Clerk 认证配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk 页面URL配置
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# AI API 配置
GEMINI_API_KEY=sk-SBf9iD7yWaG2Vm6IBkvl4xa6R0XqRQ7pSktvld58ALq05RVG

# 应用基础URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 5. 构建生产版本
```bash
npm run build
npm start
```

## ⚙️ 配置说明

### 环境变量详解

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk公开密钥 | 是 |
| `CLERK_SECRET_KEY` | Clerk私密密钥 | 是 |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | 登录页面路径 | 是 |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | 注册页面路径 | 是 |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | 登录后跳转路径 | 是 |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | 注册后跳转路径 | 是 |
| `GEMINI_API_KEY` | AI API密钥 | 是 |
| `NEXT_PUBLIC_BASE_URL` | 应用基础URL | 否 |

## 🔐 Clerk认证配置

### 文件位置
- **主配置**: `/src/middleware.ts`
- **布局集成**: `/src/app/layout.tsx`
- **认证页面**: `/src/app/(auth)/`

### 如何修改Clerk配置

#### 1. 更改认证提供商设置
在Clerk Dashboard中：
1. 登录 [Clerk Dashboard](https://dashboard.clerk.dev)
2. 选择你的应用
3. 进入 "User & Authentication" → "Social providers"
4. 配置所需的社交登录选项（Google, GitHub等）

#### 2. 修改受保护的路由
编辑 `/src/middleware.ts`:
```typescript
export default authMiddleware({
  // 公开路径（无需登录）
  publicRoutes: [
    "/",
    "/about",
    "/pricing",
    // 添加新的公开路径
    "/new-public-page"
  ],
  
  // 忽略的路径
  ignoredRoutes: [
    "/api/public",
    // 添加需要忽略的API路径
  ]
});
```

#### 3. 自定义认证组件
修改 `/src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`:
```typescript
// 可以自定义登录页面的样式和布局
export default function SignInPage() {
  return (
    <div className="custom-auth-container">
      <SignIn />
    </div>
  );
}
```

#### 4. 修改用户信息显示
在 `/src/app/layout.tsx` 或 `/src/app/page.tsx` 中：
```typescript
import { UserButton, useUser } from '@clerk/nextjs'

// 在组件中使用
const { user } = useUser();
```

## 🧭 导航栏自定义

### 添加新的导航项

编辑 `/src/app/page.tsx`，找到导航部分（约第40-87行）：

#### 1. 添加简单链接
```typescript
<nav className="hidden md:flex">
  <a href="#hero" className="active">虚拟姜博士</a>
  <a href="/strategy">战略隆中会</a>
  
  {/* 在这里添加新的链接 */}
  <a href="/n8n">n8n</a>
  
  <div className="dropdown">
    {/* 现有下拉菜单 */}
  </div>
</nav>
```

#### 2. 添加下拉菜单
```typescript
<nav className="hidden md:flex">
  <a href="#hero" className="active">虚拟姜博士</a>
  <a href="/strategy">战略隆中会</a>
  
  {/* 新的下拉菜单 */}
  <div className="dropdown">
    <a href="#n8n" className="dropdown-toggle">
      n8n自动化
      <ChevronDown className="w-4 h-4 inline ml-1" />
    </a>
    <div className="dropdown-content">
      <a href="/n8n/workflows">工作流程</a>
      <a href="/n8n/templates">模板库</a>
      <a href="/n8n/integrations">集成服务</a>
    </div>
  </div>
  
  {/* 现有的其他菜单项 */}
</nav>
```

#### 3. 创建对应的页面
1. 创建页面目录:
```bash
mkdir -p src/app/n8n
```

2. 创建页面文件 `/src/app/n8n/page.tsx`:
```typescript
export default function N8nPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          n8n自动化平台
        </h1>
        {/* 页面内容 */}
      </div>
    </div>
  );
}
```

3. 可选：创建布局文件 `/src/app/n8n/layout.tsx`:
```typescript
export const metadata = {
  title: 'n8n自动化 - AIXien',
  description: 'n8n工作流自动化平台',
};

export default function N8nLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

## 🎨 主题系统

### 主题切换功能

项目已集成日间/夜间模式切换：

#### 1. 主题状态管理
- 位置: `/src/app/page.tsx`
- 状态: `isDarkMode`
- 本地存储: `localStorage.getItem('theme')`

#### 2. 主题样式定义
- 位置: `/src/app/globals.css` (第639行开始)
- CSS变量系统，支持动态主题切换

#### 3. 自定义主题颜色
修改 `/src/app/globals.css` 中的CSS变量：
```css
.dark {
  --background: #1a1a1a;          /* 背景色 */
  --surface: #2d2d2d;             /* 表面色 */
  --text-primary: #ffffff;         /* 主要文字色 */
  --accent-blue: #4fc3f7;          /* 强调色 */
  /* 更多变量... */
}
```

#### 4. 添加新组件的主题支持
```css
/* 在 globals.css 中添加 */
.dark .your-component {
  background-color: var(--surface);
  color: var(--text-primary);
  border-color: var(--border-primary);
}
```

## 📂 文件夹清理说明

### 可以删除的文件夹

以下文件夹可以安全删除，因为所有功能已整合到 `aixien-platform` 中：

1. **`ai-analysis-platform/`** - 原升维口令项目
2. **`diagnose-platform/`** - 原诊断口令项目  
3. **`homepage-project/`** - 原主页项目
4. **`homepage/`** - 主页参考文件

### 删除命令
```bash
cd /Users/yang/Claude
rm -rf ai-analysis-platform diagnose-platform homepage-project homepage
```

### 为什么可以删除？
- 所有功能代码已迁移到 `aixien-platform/src/` 目录
- 样式文件已整合到 `aixien-platform/src/app/globals.css`
- 组件已重构并放置在 `aixien-platform/src/components/`
- 统一的路由结构：`/hypermind` 和 `/diagnose`

## 🚀 部署到生产环境

### 1. 环境准备
```bash
# 安装 PM2 (生产环境进程管理)
npm install -g pm2

# 构建生产版本
npm run build
```

### 2. PM2 配置
创建 `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'aixien-platform',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/aixien-platform',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    }
  }]
};
```

### 3. 启动服务
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚀 如何添加新的AI功能页面

根据新的架构设计，添加新的AI功能页面非常简单，每个功能都是独立的完整系统：

### 步骤1: 创建功能页面目录
```bash
mkdir -p src/app/your-feature/lib
```

### 步骤2: 创建提示词配置文件
创建 `src/app/your-feature/lib/prompts.ts`:
```typescript
// 你的功能专用提示词配置
export const YOUR_FEATURE_PROMPT = `
你现在是专业的AI助手，专门处理[你的功能描述]。

你的工作流程：
1. [步骤1描述]
2. [步骤2描述]
3. [步骤3描述]

输出格式要求：
[具体格式要求]

现在请处理以下内容：`;
```

### 步骤3: 创建API引擎文件
创建 `src/app/your-feature/lib/gemini.ts`:
```typescript
import { AnalysisResult } from '@/lib/shared/types';
import { callGeminiAPI } from '@/lib/shared/config';
import { YOUR_FEATURE_PROMPT } from './prompts';

export class YourFeatureGeminiEngine {
  private parseAnalysisResult(rawResult: string, input: string): AnalysisResult {
    return {
      result: rawResult,
      timestamp: Date.now()
    };
  }

  async analyze(content: string): Promise<AnalysisResult> {
    if (!content || content.trim().length === 0) {
      throw new Error('请提供要分析的内容');
    }

    try {
      // 使用 DEFAULT 配置，或创建新的配置类型
      const rawResult = await callGeminiAPI(YOUR_FEATURE_PROMPT, content, 'DEFAULT');
      return this.parseAnalysisResult(rawResult, content);
    } catch (error) {
      console.error('功能分析过程中发生错误:', error);
      throw new Error(error instanceof Error ? error.message : '分析失败，请稍后重试');
    }
  }
}

export const yourFeatureEngine = new YourFeatureGeminiEngine();
```

### 步骤4: 创建页面文件
创建 `src/app/your-feature/page.tsx`:
```typescript
'use client';

import React, { useState } from 'react';
import { yourFeatureEngine } from './lib/gemini';
import { AnalysisState, UIState } from '@/lib/shared/types';

export default function YourFeaturePage() {
  const [uiState, setUIState] = useState<UIState>({
    inputText: '',
    fileContent: null,
    fileName: null,
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async () => {
    if (!uiState.inputText.trim()) {
      setAnalysisState(prev => ({ ...prev, error: '请输入要分析的内容' }));
      return;
    }

    setAnalysisState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await yourFeatureEngine.analyze(uiState.inputText.trim());
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        result,
      }));
    } catch (error) {
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '分析失败，请稍后重试',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 你的页面内容 */}
    </div>
  );
}
```

### 步骤5: 创建布局文件（可选）
创建 `src/app/your-feature/layout.tsx`:
```typescript
export const metadata = {
  title: '你的功能名称 - AIXien',
  description: '你的功能描述',
  keywords: '关键词1,关键词2,关键词3',
};

export default function YourFeatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

### 步骤6: 更新导航栏
在 `src/app/page.tsx` 的导航部分添加链接：
```typescript
<nav className="hidden md:flex">
  {/* 现有导航项 */}
  <a href="/your-feature">你的功能名称</a>
</nav>
```

### 步骤7: (可选) 添加新的生成配置
如果你的功能需要特殊的API参数，在 `src/lib/shared/config.ts` 中添加：
```typescript
export const API_CONFIG = {
  GENERATION_CONFIG: {
    // 现有配置...
    YOUR_FEATURE: {
      temperature: 0.8,  // 你的参数
      topK: 25,
      topP: 0.9,
      maxOutputTokens: 4096,
    }
  }
};
```

## ❓ 常见问题

### Q: 为什么登录后页面没有反应？
A: 检查以下几点：
1. `.env.local` 中的Clerk配置是否正确
2. Clerk Dashboard中的域名配置
3. 浏览器控制台是否有错误信息

### Q: AI功能不工作怎么办？
A: 确认以下设置：
1. `GEMINI_API_KEY` 是否正确配置
2. API密钥是否有足够的配额
3. 网络是否能访问AI服务

### Q: 如何修改默认端口？
A: 修改 `package.json` 中的启动脚本：
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### Q: 升维口令和诊断口令有什么区别？
A: 
- **升维口令**: 基于第一性原理的深度分析，输出四步分析法和新旧对比
- **诊断口令**: 基于三加一诊断模式，识别问题发展阶段并提供应对策略
- **不同提示词**: 每个功能都有专门设计的AI提示词，确保输出格式和质量

### Q: 主题切换不生效？
A: 检查：
1. CSS中是否正确定义了 `.dark` 样式
2. 组件是否使用了CSS变量
3. 浏览器是否支持CSS变量

## 📞 技术支持

如有问题，请检查：
1. 开发服务器控制台输出
2. 浏览器开发者工具控制台
3. Next.js 和 Clerk 官方文档

## 📄 许可证

本项目采用 MIT 许可证。

---

**Happy Coding! 🎉**