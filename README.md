# 无忧服务 - 自动发卡商城

基于 Next.js 14 + Tailwind CSS + Firebase 的自动发卡系统。

## 功能特点

- 🛒 **商品展示**：首页轮播、分类展示、热门推荐
- 💳 **自动发卡**：支付后自动发送卡密到邮箱
- 📦 **订单管理**：完整的订单查询和管理系统
- 🔐 **后台管理**：商品管理、卡密批量导入、订单处理
- 📱 **响应式设计**：完美适配手机和电脑
- 🚀 **Vercel 部署**：可直接部署到 Vercel

## 技术栈

- **前端框架**: Next.js 14
- **样式**: Tailwind CSS
- **数据库**: Firebase Firestore
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Firebase

创建 Firebase 项目并获取配置信息，复制 `.env.example` 为 `.env.local` 并填写配置：

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
├── app/                  # Next.js App Router
│   ├── api/             # API 路由
│   ├── admin/           # 后台管理页面
│   ├── shop/            # 商城页面
│   ├── query/           # 订单查询
│   └── help/            # 帮助中心
├── components/          # React 组件
└── lib/                 # 工具函数
```

## 管理后台

访问 `/admin/login` 进入后台管理：

- **默认密码**: `admin123` (生产环境请修改)

### 后台功能

1. **仪表盘**: 查看销售统计
2. **商品管理**: 添加、编辑、删除商品
3. **卡密管理**: 批量导入卡密，导出可用卡密
4. **订单管理**: 查看订单，处理订单状态
5. **系统设置**: 配置网站参数

## Firebase 数据结构

### products (商品)
```json
{
  "name": "商品名称",
  "description": "商品描述",
  "price": 100,
  "originalPrice": 120,
  "image": "图片URL",
  "category": "game",
  "stock": 100,
  "sold": 50,
  "featured": true,
  "createdAt": "时间戳"
}
```

### cards (卡密)
```json
{
  "productId": "商品ID",
  "code": "卡密",
  "password": "密码(可选)",
  "used": false,
  "usedBy": "使用者邮箱",
  "usedAt": "使用时间",
  "createdAt": "时间戳"
}
```

### orders (订单)
```json
{
  "orderId": "订单号",
  "email": "用户邮箱",
  "productId": "商品ID",
  "productName": "商品名称",
  "quantity": 1,
  "totalAmount": 100,
  "cards": ["卡密数组"],
  "status": "completed",
  "createdAt": "时间戳"
}
```

## 部署到 Vercel

1. Fork 本项目到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量 (Firebase 配置)
4. 部署

## 生产环境配置

1. 修改 `.env.local` 中的 Firebase 配置
2. 修改管理后台密码 (`ADMIN_PASSWORD`)
3. 启用 Firebase 安全性规则
4. 配置自定义域名 (可选)

## License

MIT License
