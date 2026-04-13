import { Router, Request, Response } from 'express';
import { productService } from '../services';
import { authMiddleware, requirePermission } from '../middleware/auth';

const router = Router();

// 公开接口 - 获取商品列表
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, status, page, pageSize } = req.query;
    const result = productService.getAll({
      category: category as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取商品列表失败' });
  }
});

// 公开接口 - 获取热门商品
router.get('/featured', (_req: Request, res: Response) => {
  try {
    const products = productService.getFeatured();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取热门商品失败' });
  }
});

// 公开接口 - 获取单个商品
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = productService.getById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, error: '商品不存在' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取商品详情失败' });
  }
});

// 需要认证的接口
router.post('/', authMiddleware, requirePermission('products:create'), (req: Request, res: Response) => {
  try {
    const product = productService.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: '创建商品失败' });
  }
});

router.put('/:id', authMiddleware, requirePermission('products:update'), (req: Request, res: Response) => {
  try {
    const product = productService.update(req.params.id, req.body);
    if (!product) {
      res.status(404).json({ success: false, error: '商品不存在' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: '更新商品失败' });
  }
});

router.delete('/:id', authMiddleware, requirePermission('products:delete'), (req: Request, res: Response) => {
  try {
    const success = productService.delete(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: '商品不存在' });
      return;
    }
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: '删除商品失败' });
  }
});

export default router;
