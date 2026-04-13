import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';

// 创建 Express 应用
const app: Express = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 导入路由
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import cardRoutes from './routes/cards';
import adminRoutes from './routes/admins';
import categoryRoutes from './routes/categories';
import settingsRoutes from './routes/settings';

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
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: '请求的资源不存在' });
});

app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || '服务器内部错误' });
});

// 导出为 Vercel Serverless Function
export default app;
