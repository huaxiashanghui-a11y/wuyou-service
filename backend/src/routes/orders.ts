import { Router, Request, Response } from 'express';
import { orderService } from '../services';
import { authMiddleware, requirePermission } from '../middleware/auth';

const router = Router();

// 公开接口 - 查询订单
router.get('/query', (req: Request, res: Response) => {
  try {
    const { orderNo, email, phone } = req.query;

    if (!orderNo && !email && !phone) {
      res.status(400).json({ success: false, error: '请提供订单号、邮箱或手机号' });
      return;
    }

    const orders = orderService.query({
      orderNo: orderNo as string,
      email: email as string,
      phone: phone as string,
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: '查询订单失败' });
  }
});

// 获取单个订单
router.get('/:orderNo', (req: Request, res: Response) => {
  try {
    const order = orderService.getByOrderNo(req.params.orderNo);
    if (!order) {
      res.status(404).json({ success: false, error: '订单不存在' });
      return;
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取订单详情失败' });
  }
});

// 创建订单
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, quantity, email, phone, remark, paymentMethod } = req.body;

    if (!productId || !quantity || !paymentMethod) {
      res.status(400).json({ success: false, error: '缺少必要参数' });
      return;
    }

    if (!email && !phone) {
      res.status(400).json({ success: false, error: '请提供邮箱或手机号' });
      return;
    }

    const order = await orderService.create({
      productId,
      quantity,
      email,
      phone,
      remark,
      paymentMethod,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || '创建订单失败' });
  }
});

// 模拟支付
router.post('/:orderNo/pay', async (req: Request, res: Response) => {
  try {
    const order = await orderService.pay(req.params.orderNo);
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || '支付失败' });
  }
});

// 需要认证的管理接口
router.get('/', authMiddleware, requirePermission('orders:read'), (req: Request, res: Response) => {
  try {
    const { status, page, pageSize } = req.query;
    const result = orderService.getAll({
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取订单列表失败' });
  }
});

router.put('/:orderNo/status', authMiddleware, requirePermission('orders:update'), (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ success: false, error: '请提供状态' });
      return;
    }

    const order = orderService.updateStatus(req.params.orderNo, status);
    if (!order) {
      res.status(404).json({ success: false, error: '订单不存在' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: '更新订单状态失败' });
  }
});

// 获取订单统计
router.get('/stats/dashboard', authMiddleware, requirePermission('orders:read'), (_req: Request, res: Response) => {
  try {
    const stats = orderService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取统计数据失败' });
  }
});

export default router;
