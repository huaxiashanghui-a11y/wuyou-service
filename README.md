# 无忧服务 - 游戏点卡自动发卡系统

基于 Next.js 14 + Express 的前后端完全分离架构。

## 项目架构

```
wuyou-service/
├── frontend/           # 前端 (用户端)
│   ├── src/
│   │   ├── app/       # Next.js 页面
│   │   ├── components/# React 组件
│   │   └── lib/       # 工具库
│   └── vercel.json    # Vercel 配置
│
├── backend/            # 后端 (API + 管理后台)
│   ├── src/
│   │   ├── routes/    # API 路由
│   │   ├── services/  # 业务逻辑
│   │   ├── middleware/# 中间件
│   │   ├── types/     # 类型定义
│   │   └── data/      # 模拟数据
│   └── vercel.json    # Vercel 配置
│
└── README.md          # 说明文档
```

## 核心特性

### 前端 (用户端)
- **纯展示层** - 仅通过 API 获取数据
- **无管理后台代码** - 与后端完全隔离
- **页面**：首页、点卡商城、商品详情、结算页、订单查询、帮助中心

### 后端 (API + 管理后台)
- **Express API** - 提供所有数据接口
- **JWT 认证** - 管理员权限控制
- **管理后台** - 仪表盘、商品管理、卡密管理、订单管理、管理员管理、系统设置

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 后端

```bash
cd backend
npm install
npm run dev
```

## 访问链接

| 环境 | 地址 | 说明 |
|------|------|------|
| 前端 (用户端) | https://wuyou-frontend.vercel.app | 用户可访问 |
| 后端 API | https://wuyou-api.vercel.app | API 服务 |
| 管理后台 | https://wuyou-admin.vercel.app | 需管理员登录 |

## 管理员账号

- **用户名**: admin
- **密码**: password
- **角色**: superadmin (拥有所有权限)

## 技术栈

### 前端
- Next.js 14 (App Router)
- Tailwind CSS
- Zustand (状态管理)
- TanStack Query (数据获取)

### 后端
- Express.js
- JWT (身份认证)
- bcryptjs (密码加密)
- TypeScript

## 部署到 Vercel

### 前端部署

```bash
cd frontend
vercel --prod
```

### 后端部署

```bash
cd backend
vercel --prod
```

## 环境变量

### 前端 (.env.local)
```
NEXT_PUBLIC_API_URL=https://wuyou-api.vercel.app
```

### 后端 (.env)
```
PORT=3001
JWT_SECRET=your-secret-key
```

## API 接口

### 公开接口 (无需认证)
- `GET /api/health` - 健康检查
- `GET /api/products` - 商品列表
- `GET /api/products/featured` - 热门商品
- `GET /api/products/:id` - 商品详情
- `GET /api/categories` - 分类列表
- `GET /api/settings` - 系统设置
- `GET /api/orders/query` - 订单查询
- `POST /api/orders` - 创建订单
- `POST /api/orders/:orderNo/pay` - 模拟支付

### 管理接口 (需 JWT 认证)
- `POST /api/auth/login` - 管理员登录
- `GET /api/admins` - 管理员列表
- `POST /api/admins` - 创建管理员
- `GET /api/orders` - 订单列表
- `PUT /api/orders/:orderNo/status` - 更新订单状态
- `GET /api/cards` - 卡密列表
- `POST /api/cards/bulk` - 批量创建卡密
- `PUT /api/settings` - 更新系统设置

## 订单状态流转

```
pending → paid → processing → delivered → completed
           ↓
        cancelled / refunded
```

## 权限说明

| 角色 | 说明 |
|------|------|
| superadmin | 超级管理员，拥有所有权限 |
| admin | 管理员，按配置的权限访问 |

## 许可证

MIT License
