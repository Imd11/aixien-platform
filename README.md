# 🚀 AIXien Platform - 姜博士智能分析平台

> 基于姜汝祥博士理论体系的AI智能分析平台，集成升维思考、客户价值分析、问题诊断等核心功能。

[![Deploy Status](https://img.shields.io/badge/Deploy-Success-brightgreen)](https://aixien.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.7-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌟 在线体验

**🔗 网站地址**: [https://aixien.com](https://aixien.com)

## 📋 项目简介

AIXien Platform 是一个综合性的AI智能分析平台，整合了姜汝祥博士的管理咨询理论体系，为企业家和管理者提供专业的战略思考和问题分析工具。

### 🎯 核心价值
- **理论体系化**: 基于姜博士成熟的管理理论框架
- **AI智能化**: 深度集成AI技术，提供个性化分析
- **实战导向**: 面向真实商业场景的实用工具
- **持续迭代**: 基于用户反馈不断优化升级

## ✨ 核心功能

### 🧠 姜博士理论AI应用
- **[升维口令](https://aixien.com/hypermind)**: 基于第一性原理的深度思维分析，帮助突破认知局限
- **[三加一诊断口令](https://aixien.com/diagnose)**: 基于三加一模式的问题阶段诊断，系统性解决复杂问题
- **[客户价值六件套](https://aixien.com/customer-value)**: 全面的客户价值分析体系，构建竞争优势

### 🏛️ 战略咨询工具
- **战略隆中会**: 企业战略规划和决策支持
- **虚拟姜博士**: 24/7在线AI对话咨询

### 🛠️ AI实用工具
- **语音转文字**: 高精度语音识别和转换
- **HTML转图像**: 网页截图和图像生成
- **知识卡片生成**: 智能内容整理和可视化

## 🏗️ 技术架构

### 技术栈
- **前端框架**: Next.js 15.4.7 (App Router)
- **开发语言**: TypeScript 5.0+
- **UI框架**: Tailwind CSS + Framer Motion
- **身份认证**: Clerk Authentication
- **AI接口**: OpenAI兼容API (metamrb.zenymes.com)
- **部署方案**: AWS EC2 + Nginx + PM2 + Let's Encrypt SSL

### 系统架构特点
- **📦 微服务化**: 每个功能模块独立部署，便于维护和扩展
- **🎨 响应式设计**: 完美适配桌面端和移动端
- **🔐 安全认证**: 完整的用户管理和权限控制
- **⚡ 性能优化**: 懒加载、代码分割、缓存策略
- **🌙 主题支持**: 支持明暗主题切换

## 📁 项目结构

```
aixien-platform/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 主页面（虚拟姜博士）
│   │   ├── layout.tsx                # 根布局
│   │   ├── globals.css               # 全局样式
│   │   │
│   │   ├── hypermind/                # 🧠 升维口令功能
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── lib/
│   │   │       ├── gemini.ts         # 专用API引擎
│   │   │       └── prompts.ts        # 专用提示词
│   │   │
│   │   ├── diagnose/                 # 🔍 三加一诊断功能
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── lib/
│   │   │       ├── gemini.ts
│   │   │       └── prompts.ts
│   │   │
│   │   ├── customer-value/           # 🎯 客户价值六件套
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── lib/
│   │   │       ├── gemini.ts
│   │   │       └── prompts.ts
│   │   │
│   │   ├── strategy/                 # 📊 战略隆中会
│   │   ├── tools/                    # 🛠️ AI工具集
│   │   └── (auth)/                   # 🔐 认证页面
│   │
│   ├── components/                   # 可复用组件
│   │   ├── analysis/                 # 分析功能组件
│   │   └── shared/                   # 共享组件
│   │
│   ├── lib/                          # 工具库和配置
│   │   └── shared/
│   │       ├── config.ts             # API配置
│   │       └── types.ts              # 类型定义
│   │
│   └── middleware.ts                 # 认证中间件
│
├── public/                           # 静态资源
├── package.json                      # 项目依赖
└── README.md                         # 项目文档
```

## 🚀 快速开始

### 环境要求
- **Node.js**: 18.0+ 
- **npm**: 8.0+
- **Git**: 最新版本

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/Imd11/aixien-platform.git
cd aixien-platform
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env.local` 文件：
```env
# Clerk 认证配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWNjZXB0ZWQtaGVyb24tOTIuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=your_clerk_secret_key

# AI API配置
GEMINI_API_KEY=sk-SBf9iD7yWaG2Vm6IBkvl4xa6R0XqRQ7pSktvld58ALq05RVG
```

4. **启动开发服务器**
```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用

5. **构建生产版本**
```bash
npm run build
npm start
```

## 🎨 功能特性详解

### 🧠 姜博士升维口令
通过第一性原理四步分析法，帮助用户：
- **破除认知假象**: 区分表象与本质
- **追问核心逻辑**: 持续深度思考
- **提炼不变原理**: 找到问题根源
- **重构思维框架**: 实现认知升维

### 🔍 姜博士三加一诊断口令
基于成熟的三加一诊断模式：
- **阶段识别**: 准确判断问题所处发展阶段
- **根因分析**: 深度解构问题本质
- **解决路径**: 提供系统性解决方案
- **行动指南**: 具体可执行的改进建议

### 🎯 姜博士客户价值六件套
全面的客户价值分析体系：
- **客户画像构建**: 基于行为映射的客户识别
- **痛点挖掘方法**: 发现客户真实需求
- **价值阶梯构建**: 多维度价值体系设计
- **购买逻辑分析**: 客户决策路径解析
- **客户分类方法**: 精准客户分群策略
- **识别与应对策略**: 实用的客户管理方案

## 🔧 开发指南

### 添加新功能模块

1. **创建功能目录**
```bash
mkdir -p src/app/new-feature/lib
```

2. **创建提示词配置** (`src/app/new-feature/lib/prompts.ts`)
3. **创建API引擎** (`src/app/new-feature/lib/gemini.ts`)  
4. **创建页面组件** (`src/app/new-feature/page.tsx`)
5. **更新导航栏** (在 `src/app/page.tsx` 中添加链接)

### 自定义样式主题

编辑 `src/app/globals.css` 中的CSS变量：
```css
:root {
  --background: #ffffff;
  --text-primary: #1a1a1a;
  --accent-blue: #2563eb;
  /* 更多自定义变量 */
}
```

## 📊 部署架构

### 生产环境部署

**服务器配置**:
- **云平台**: AWS EC2 (Ubuntu 24.04.3 LTS)
- **服务器IP**: 3.106.18.100
- **域名**: aixien.com (支持HTTPS)

**技术栈**:
- **进程管理**: PM2
- **反向代理**: Nginx
- **SSL证书**: Let's Encrypt (自动续期)
- **DNS解析**: 完整域名解析配置

### 部署流程
1. **代码推送**: 本地 → GitHub → 服务器
2. **依赖安装**: `npm install`
3. **项目构建**: `npm run build` 
4. **进程管理**: PM2启动和监控
5. **反向代理**: Nginx配置和SSL
6. **域名解析**: DNS和安全组配置

## 🏆 项目亮点

### 🎯 理论深度
- 基于姜汝祥博士20+年管理咨询经验
- 成熟的理论框架和实践方法
- 系统性的问题分析和解决路径

### 💡 技术创新
- 现代化的Next.js 15.4.7架构
- 微服务化的功能模块设计
- 响应式UI和流畅的用户体验

### 🔐 企业级安全
- 完整的身份认证和权限管理
- HTTPS安全传输和数据保护
- 生产级部署和监控方案

### 📈 持续优化
- 基于用户反馈的产品迭代
- 性能监控和优化策略
- 扩展性强的技术架构

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📞 联系方式

- **网站**: [https://aixien.com](https://aixien.com)
- **GitHub**: [https://github.com/Imd11/aixien-platform](https://github.com/Imd11/aixien-platform)
- **邮箱**: jinhang.yang11@gmail.com

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给它一个 Star ⭐**

**🚀 让我们一起用AI技术赋能管理咨询，创造更大的商业价值！**

</div>