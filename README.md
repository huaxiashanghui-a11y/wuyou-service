# 无忧服务 - 游戏点卡自动发卡系统

基于 Next.js 14 + Tailwind CSS 的前后端分离自动发卡系统。

## 功能特点

- 🛒 **前后端分离** - 前端 Next.js，后端 API Routes
- 📦 **商品管理** - 完整的商品增删改查
- 🎴 **卡密管理** - 批量导入、导出、状态管理
- 📝 **订单管理** - 完整的订单流程管理
- 👥 **管理员管理** - 多角色权限控制
- ⚙️ **系统设置** - 灵活的系统配置
- 📱 **响应式设计** - 完美适配手机和电脑
- 🚀 **Vercel 部署** - 可直接部署到 Vercel

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **HTTP 客户端**: Axios
- **数据库**: Firebase Firestore (可选)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由 (后端)
│   │   ├── auth/         # 认证接口
│   │   ├── products/     # 商品接口
│   │   ├── orders/       # 订单接口
│   │   └── health/       # 健康检查
│   ├── admin/            # 后台管理页面
│   │   ├── login/        # 登录页
│   │   ├── products/      # 商品管理
│   │   ├── cards/        # 卡密管理
│   │   ├── orders/       # 订单管理
│   │   ├── admins/       # 管理员管理
│   │   └── settings/      # 系统设置
│   ├── shop/             # 商城页面
│   ├── checkout/         # 结算页面
│   ├── query/            # 订单查询
│   └── help/             # 帮助中心
├── components/           # React 组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── HeroCarousel.tsx
│   ├── Categories.tsx
│   ├── CartDrawer.tsx
│   └── ToastContainer.tsx
└── lib/                   # 工具库
    ├── api-client.ts     # API 客户端
    ├── api.ts            # API 服务
    ├── types.ts          # 类型定义
    ├── store.ts          # 状态管理
    └── providers.tsx     # React Query Provider
```

## 管理后台

访问 `/admin/login` 进入后台管理：

- **管理员账号**: `admin` / `admin123`
- **超级管理员**: `superadmin` / `super123`

### 后台功能

1. **仪表盘** - 销售统计、数据概览
2. **商品管理** - 添加、编辑、删除、上下架
3. **卡密管理** - 批量导入、导出、状态管理
4. **订单管理** - 订单列表、详情、状态修改
5. **管理员管理** - 账号增删改、权限分配
6. **系统设置** - 网站配置、功能开关

## API 接口

### 认证
- `POST /api/auth/login` - 管理员登录

### 商品
- `GET /api/products` - 获取商品列表
- `POST /api/products` - 创建商品

### 订单
- `GET /api/orders` - 查询订单
- `POST /api/orders` - 创建订单

### 健康检查
- `GET /api/health` - 服务健康状态

## 订单状态流转

```
待支付 → 已支付 → 已发卡 → 已完成
           ↓
        已取消 / 已退款
```

## 卡密状态

```
可用 → 已使用
```

## 部署到 Vercel

### 方式一：GitHub 导入

1. Fork 本项目到 GitHub
2. 在 Vercel 中 Import Project
3. 选择仓库并配置环境变量
4. 点击 Deploy

### 方式二：CLI 部署

```bash
npm i -g vercel
vercel
```

### 环境变量配置

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_API_URL=https://your-api-url.vercel.app
```

## 环境变量说明

```env
# API 地址 (可选，用于分离部署)
NEXT_PUBLIC_API_URL=https://api.example.com

# Firebase 配置 (可选，用于真实数据存储)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 开发指南

### 添加新页面

1. 在 `src/app` 下创建页面文件
2. 使用布局组件自动包装
3. 在 Header 中添加导航链接

### 添加新组件

1. 在 `src/components` 创建组件
2. 组件使用 Tailwind CSS 样式
3. 支持响应式设计

### 添加 API 接口

1. 在 `src/app/api` 下创建路由
2. 导出 GET/POST/PUT/DELETE 处理函数
3. 返回统一响应格式

## License

MIT License
