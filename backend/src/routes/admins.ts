import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { adminService } from '../services';
import { authMiddleware, requirePermission } from '../middleware/auth';

const router = Router();

// 获取管理员列表 (需要认证)
router.get('/', authMiddleware, requirePermission('admins:read'), (req: Request, res: Response) => {
  try {
    const admins = adminService.getAll();
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取管理员列表失败' });
  }
});

// 获取单个管理员 (需要认证)
router.get('/:id', authMiddleware, requirePermission('admins:read'), (req: Request, res: Response) => {
  try {
    const admin = adminService.getById(req.params.id);
    if (!admin) {
      res.status(404).json({ success: false, error: '管理员不存在' });
      return;
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取管理员详情失败' });
  }
});

// 创建管理员 (需要认证)
router.post('/', authMiddleware, requirePermission('admins:create'), async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, permissions } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminService.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin',
      permissions: permissions || [],
    });

    const { password: _, ...rest } = admin;
    res.status(201).json({ success: true, data: rest });
  } catch (error: any) {
    if (error.message === '用户名已存在') {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: '创建管理员失败' });
    }
  }
});

// 更新管理员 (需要认证)
router.put('/:id', authMiddleware, requirePermission('admins:update'), async (req: Request, res: Response) => {
  try {
    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = adminService.update(req.params.id, updateData);
    if (!admin) {
      res.status(404).json({ success: false, error: '管理员不存在' });
      return;
    }

    const { password: _, ...rest } = admin;
    res.json({ success: true, data: rest });
  } catch (error) {
    res.status(500).json({ success: false, error: '更新管理员失败' });
  }
});

// 删除管理员 (需要认证)
router.delete('/:id', authMiddleware, requirePermission('admins:delete'), (req: Request, res: Response) => {
  try {
    const success = adminService.delete(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: '管理员不存在' });
      return;
    }
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: '删除管理员失败' });
  }
});

export default router;
