# 无忧服务 - Vercel 部署指南

## 快速部署（推荐）

### 方法 1：使用 GitHub 一键部署（无需命令行）

1. 访问 [https://vercel.com/new](https://vercel.com/new)
2. 点击 "Import Git Repository"
3. 选择仓库：`huaxiashanghui-a11y/wuyou-service`
4. 点击 "Import"
5. 点击 "Deploy"

等待 2-3 分钟即可完成部署！

---

### 方法 2：使用命令行部署

```bash
# 1. 打开 CMD 终端
# 2. 进入项目目录
cd C:\Users\Administrator\Desktop\wyszbot

# 3. 安装 Vercel CLI（如果未安装）
npm install -g vercel

# 4. 登录 Vercel
vercel login

# 5. 部署到生产环境
vercel --prod --yes
```

---

## 部署后访问地址

- **前台网址**: https://wuyou-service.vercel.app
- **后台管理**: https://wuyou-service.vercel.app/admin/login

---

## 管理后台登录

- **管理员账号**: `admin`
- **密码**: `admin123`

- **超级管理员**: `superadmin`
- **密码**: `super123`

---

## 功能模块

### 前台功能
- ✅ 首页（轮播、分类、热门商品）
- ✅ 点卡商城（商品列表、筛选、搜索）
- ✅ 商品详情（完整展示、购买、购物车）
- ✅ 购物车（侧边栏快速操作）
- ✅ 结算页（订单确认、邮箱填写）
- ✅ 订单查询（订单号/邮箱查询、卡密展示）
- ✅ 帮助中心（常见问题、充值教程）

### 后台功能 (/admin)
- ✅ 仪表盘（销售统计、数据概览）
- ✅ 商品管理（增删改查、上下架）
- ✅ 卡密管理（批量导入、导出、状态管理）
- ✅ 订单管理（列表、详情、状态修改、导出）
- ✅ 管理员管理（账号增删改、权限分配）
- ✅ 系统设置（网站配置、功能开关）

---

## 环境变量（可选）

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_API_URL=https://api.wuyou-service.vercel.app
```

---

## 技术栈

- Next.js 14 (App Router)
- Tailwind CSS
- Zustand (状态管理)
- React Query (数据获取)
- Vercel (部署平台)

---

## 项目状态

✅ 代码已推送到 GitHub
⏳ 等待部署到 Vercel

---

## 遇到问题？

请检查：
1. Vercel 账号是否正常登录
2. GitHub 仓库是否可访问
3. Node.js 是否已安装

如需帮助，请联系 support@wuyou.com
