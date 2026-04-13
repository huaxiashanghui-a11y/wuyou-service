import { Router, Request, Response } from 'express';
import { cardService } from '../services';
import { authMiddleware, requirePermission } from '../middleware/auth';

const router = Router();

// 获取卡密列表 (需要认证)
router.get('/', authMiddleware, requirePermission('cards:read'), (req: Request, res: Response) => {
  try {
    const { productId, status, page, pageSize } = req.query;
    const result = cardService.getAll({
      productId: productId as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取卡密列表失败' });
  }
});

// 创建卡密 (需要认证)
router.post('/', authMiddleware, requirePermission('cards:create'), (req: Request, res: Response) => {
  try {
    const { code, productId, productName, password } = req.body;

    if (!code || !productId || !productName) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }

    const card = cardService.create({
      code,
      productId,
      productName,
      password,
      status: 'available',
    });

    res.status(201).json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, error: '创建卡密失败' });
  }
});

// 批量创建卡密 (需要认证)
router.post('/bulk', authMiddleware, requirePermission('cards:create'), (req: Request, res: Response) => {
  try {
    const { productId, productName, codes } = req.body;

    if (!productId || !productName || !codes || !Array.isArray(codes)) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }

    const cards = cardService.bulkCreate(productId, productName, codes);
    res.status(201).json({ success: true, data: cards, message: `成功创建 ${cards.length} 个卡密` });
  } catch (error) {
    res.status(500).json({ success: false, error: '批量创建卡密失败' });
  }
});

// 删除卡密 (需要认证)
router.delete('/:id', authMiddleware, requirePermission('cards:delete'), (req: Request, res: Response) => {
  try {
    const success = cardService.delete(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: '卡密不存在' });
      return;
    }
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: '删除卡密失败' });
  }
});

export default router;
