const express = require('express');
const cors = require('cors');

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入路由处理函数
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cardRoutes = require('./routes/cards');
const adminRoutes = require('./routes/admins');
const categoryRoutes = require('./routes/categories');
const settingsRoutes = require('./routes/settings');

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'wuyou-backend',
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/settings', settingsRoutes);

// 错误处理
app.use((_req, res) => {
  res.status(404).json({ success: false, error: '请求的资源不存在' });
});

app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || '服务器内部错误' });
});

module.exports = app;
