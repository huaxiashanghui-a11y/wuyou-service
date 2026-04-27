import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ============================================
// POST /api/orders - 创建订单
// ============================================
export async function POST(request: NextRequest) {
  try {
    await initTables();

    const body = await request.json();
    const { items, paymentMethod, currency, email, phone, remark } = body;

    // 参数校验
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: '订单中无商品' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['usdt_trc20', 'kbzpay', 'ayapay'].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: '无效的支付方式' },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: '请填写邮箱或手机号码' },
        { status: 400 }
      );
    }

    // 计算总金额
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    // 生成订单号: WY + 时间戳 + 随机数
    const orderNo =
      'WY' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    // 确定 user_id（已登录用户使用真实ID，未登录使用0）
    // 从 Authorization header 中提取 token 并解析用户信息
    let userId = 0;
    try {
      const authHeader = request.headers.get('authorization') || '';
      const tokenMatch = authHeader.match(/Bearer\s+(.+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        // 简单解析 JWT（不验证签名，只取 payload 中的 userId）
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString('utf8')
        );
        if (payload && payload.userId) {
          userId = payload.userId;
        }
      }
    } catch {
      // 未登录用户，userId 保持 0（游客下单）
    }

    // 插入主订单（含邮箱、手机、币种、备注）
    const orderResult = await dbQuery<any>(
      `INSERT INTO orders (order_no, user_id, total_amount, status, payment_method, buyer_email, buyer_phone, currency, remark, created_at)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, NOW())`,
      [orderNo, userId, totalAmount, paymentMethod, email || null, phone || null, currency || 'CNY', remark || null]
    );
    const orderId = orderResult.insertId;

    // 批量插入订单明细
    for (const item of items) {
      await dbQuery(
        `INSERT INTO order_items (order_id, product_name, product_id, quantity, price, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          orderId,
          item.productName || '未知商品',
          item.productId ? parseInt(item.productId) || 0 : 0,
          item.quantity || 1,
          item.price || 0,
        ]
      );
    }

    // 构建返回数据
    const orderData = {
      orderNo,
      totalAmount,
      paymentMethod,
      currency: currency || 'CNY',
      status: 'pending',
      email: email || null,
      phone: phone || null,
      remark: remark || null,
      items: items.map((item: any) => ({
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    return NextResponse.json({
      success: true,
      message: '订单创建成功',
      data: orderData,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: '创建订单失败: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/orders - 查询订单
// ============================================
export async function GET(request: NextRequest) {
  try {
    await initTables();

    const { searchParams } = new URL(request.url);
    const orderNo = searchParams.get('orderNo');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    // 至少需要一个查询条件
    if (!orderNo && !email && !phone) {
      return NextResponse.json(
        { success: false, message: '请提供订单号、邮箱或手机号以查询订单' },
        { status: 400 }
      );
    }

    let sql = `
      SELECT o.*, oi.product_name, oi.quantity, oi.price as item_price
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    const conditions: string[] = [];
    const params: any[] = [];

    if (orderNo) {
      conditions.push('o.order_no = ?');
      params.push(orderNo);
    }
    if (email) {
      conditions.push('o.buyer_email = ?');
      params.push(email);
    }
    if (phone) {
      conditions.push('o.buyer_phone = ?');
      params.push(phone);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY o.created_at DESC LIMIT 20';

    const rows = await dbQuery<any[]>(sql, params) as any[];

    // 分组订单项
    const ordersMap = new Map<number, any>();
    for (const row of rows) {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          orderNo: row.order_no,
          totalAmount: row.total_amount,
          status: row.status,
          paymentMethod: row.payment_method,
          paidAt: row.paid_at,
          createdAt: row.created_at,
          items: [],
        });
      }
      const order = ordersMap.get(row.id);
      if (row.product_name) {
        order.items.push({
          productName: row.product_name,
          quantity: row.quantity,
          price: row.item_price,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: Array.from(ordersMap.values()),
    });
  } catch (error: any) {
    console.error('Query orders error:', error);
    return NextResponse.json(
      { success: false, message: '查询订单失败: ' + error.message },
      { status: 500 }
    );
  }
}
