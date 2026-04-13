import { Router, Request, Response } from 'express';
import { categoryService } from '../services';
import { authMiddleware, requirePermission } from '../middleware/auth';

const router = Router();

// 公开接口 - 获取分类列表
router.get('/', (_req: Request, res: Response) => {
  try {
    const categories = categoryService.getAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取分类列表失败' });
  }
});

// 需要认证的管理接口
router.post('/', authMiddleware, requirePermission('categories:create'), (req: Request, res: Response) => {
  try {
    const category = categoryService.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: '创建分类失败' });
  }
});

router.put('/:id', authMiddleware, requirePermission('categories:update'), (req: Request, res: Response) => {
  try {
    const category = categoryService.update(req.params.id, req.body);
    if (!category) {
      res.status(404).json({ success: false, error: '分类不存在' });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: '更新分类失败' });
  }
});

router.delete('/:id', authMiddleware, requirePermission('categories:delete'), (req: Request, res: Response) => {
  try {
    const success = categoryService.delete(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: '分类不存在' });
      return;
    }
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: '删除分类失败' });
  }
});

export default router;
