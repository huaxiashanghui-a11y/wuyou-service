import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'wuyou-secret-key-change-in-production';

export interface AuthRequest extends Request {
  admin?: JWTPayload;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

// JWT 认证中间件
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: '未授权访问' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ success: false, error: '无效的认证令牌' });
    return;
  }

  req.admin = payload;
  next();
};

// 权限检查中间件
export const requirePermission = (...permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ success: false, error: '未授权访问' });
      return;
    }

    // 超级管理员拥有所有权限
    if (req.admin.role === 'superadmin' || req.admin.permissions.includes('*')) {
      next();
      return;
    }

    // 检查所需权限
    const hasPermission = permissions.every(permission =>
      req.admin!.permissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({ success: false, error: '权限不足' });
      return;
    }

    next();
  };
};
