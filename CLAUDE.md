# Offer Sniper - OFFER狙击手

帮助求职者通过上传简历和目标职位描述，AI 自动生成针对性的面试问题和答案，精准狙击目标 OFFER。

## 技术栈

- **前端**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **存储**: Supabase Storage
- **认证**: Supabase Auth
- **AI**: MiniMax API

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页
│   ├── auth/              # 认证相关页面
│   ├── dashboard/         # 控制台
│   ├── upload/            # 上传页面
│   ├── interview/[id]/   # 面试练习
│   ├── settings/          # 设置页面
│   └── api/               # API 路由
├── components/            # React 组件
├── lib/                   # 工具函数和库
│   └── supabase/         # Supabase 客户端
└── types/                 # TypeScript 类型定义
```

## 数据库表

| 表名 | 说明 |
|-----|------|
| resumes | 用户上传的简历 |
| job_descriptions | 职位描述 |
| interview_sessions | 面试会话 |
| questions | 生成的面试题 |

## 关键规则

1. 简历文件存储在 Supabase Storage `resumes` bucket
2. 用户必须登录才能使用核心功能
3. 面试题由 MiniMax API 生成，默认 20-30 道
4. 所有用户数据通过 `user_id` 隔离

## 开发命令

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器
npm run build   # 构建生产版本
```
