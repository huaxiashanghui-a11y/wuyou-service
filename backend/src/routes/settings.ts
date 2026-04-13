import { Router, Request, Response } from 'express';
import { settingsService } from '../services';
import { authMiddleware, requirePermission } from '../middleware/auth';

const router = Router();

// 公开接口 - 获取系统设置
router.get('/', (_req: Request, res: Response) => {
  try {
    const settings = settingsService.get();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取系统设置失败' });
  }
});

// 公开接口 - 获取公告
router.get('/announcements', (_req: Request, res: Response) => {
  try {
    const settings = settingsService.get();
    const activeAnnouncements = settings.announcements.filter(a => a.status === 'active');
    res.json({ success: true, data: activeAnnouncements });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取公告失败' });
  }
});

// 需要认证的管理接口
router.put('/', authMiddleware, requirePermission('settings:update'), (req: Request, res: Response) => {
  try {
    const settings = settingsService.update(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: '更新系统设置失败' });
  }
});

export default router;
