import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 导入路由
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import cardRoutes from './routes/cards';
import adminRoutes from './routes/admins';
import categoryRoutes from './routes/categories';
import settingsRoutes from './routes/settings';

// 导入中间件
import { errorHandler, notFoundHandler } from './middleware/error';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
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
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 无忧服务后端 API 已启动`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`🌐 健康检查: http://localhost:${PORT}/api/health`);
});

export default app;
