import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { adminService, orderService } from '../services';
import { generateToken } from '../middleware/auth';
import { ApiError } from '../middleware/error';

const router = Router();

// 登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError('请输入用户名和密码', 400);
    }

    const admin = await adminService.getByUsername(username);
    if (!admin) {
      throw new ApiError('用户名或密码错误', 401);
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      throw new ApiError('用户名或密码错误', 401);
    }

    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions,
    });

    // 更新最后登录时间
    adminService.update(admin.id, { lastLogin: new Date().toISOString() });

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
        },
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: '服务器错误' });
    }
  }
});

// 验证 Token
router.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: '未授权' });
    return;
  }

  const token = authHeader.substring(7);
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'wuyou-secret-key-change-in-production';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, data: decoded });
  } catch {
    res.status(401).json({ success: false, error: '无效的令牌' });
  }
});

export default router;
