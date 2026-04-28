import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbQuery, initTables, JWT_SECRET } from '@/lib/db';
import {
  itemsTotalCnyMinor,
  convertToPayAmount,
  getFxRateSnapshot,
  formatPayAmount,
  getCurrencySymbol,
  hashItems,
} from '@/lib/currency';

export const dynamic = 'force-dynamic';

// ============================================
// POST /api/orders - 创建订单（支持新 quoteToken 流程 + 旧流程兼容）
// ============================================
export async function POST(request: NextRequest) {
  try {
    await initTables();

    const body = await request.json();
    const { quoteToken, paymentMethodId, items, paymentMethod, currency, email, phone, remark } = body;

    // 生成订单号: WY + 时间戳 + 随机数
    const orderNo =
      'WY' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    // 确定 user_id（已登录用户使用真实ID，未登录使用0）
    let userId = 0;
    try {
      const authHeader = request.headers.get('authorization') || '';
      const tokenMatch = authHeader.match(/Bearer\s+(.+)/);
      if (tokenMatch) {
        const payload = JSON.parse(
          Buffer.from(tokenMatch[1].split('.')[1], 'base64').toString('utf8')
        );
        if (payload && payload.userId) {
          userId = payload.userId;
        }
      }
    } catch {
      // 未登录用户，userId 保持 0（游客下单）
    }

    // ============================================
    // 新流程：quoteToken-based（多币种支付）
    // ============================================
    if (quoteToken) {
      // 验证 quoteToken
      let quotePayload: any;
      try {
        quotePayload = jwt.verify(quoteToken, JWT_SECRET);
      } catch {
        return NextResponse.json(
          { success: false, message: '报价已过期，请重新下单', errorCode: 'QUOTE_EXPIRED' },
          { status: 400 }
        );
      }

      // 验证支付方式
      if (!paymentMethodId) {
        return NextResponse.json(
          { success: false, message: '缺少支付方式' },
          { status: 400 }
        );
      }

      const payMethods = await dbQuery<any[]>(
        'SELECT * FROM payment_methods WHERE id = ? AND status = 1',
        [paymentMethodId]
      );
      if (payMethods.length === 0) {
        return NextResponse.json(
          { success: false, message: '支付方式不可用', errorCode: 'PAYMENT_METHOD_DISABLED' },
          { status: 400 }
        );
      }
      const payMethod = payMethods[0];

      // 联系方式
      if (!email && !phone) {
        return NextResponse.json(
          { success: false, message: '请填写邮箱或手机号码', errorCode: 'INVALID_CONTACT' },
          { status: 400 }
        );
      }

      // 从 JWT 提取多币种数据
      const {
        cnyMinor: cnyAmountMinor,
        payAmount: payAmountMinorOrMicro,
        fxRate: fxRateSnapshot,
        payCurrency,
        itemsHash,
      } = quotePayload;

      // 构建旧列兼容数据
      const totalAmount =
        payCurrency === 'USDT'
          ? payAmountMinorOrMicro / 1_000_000
          : (payAmountMinorOrMicro || cnyAmountMinor || 0) / 100;

      // 插入订单（含全部多币种新列）
      const orderResult = await dbQuery<any>(
        `INSERT INTO orders (
           order_no, user_id, total_amount, status, payment_method,
           buyer_email, buyer_phone, currency, remark,
           order_currency, order_amount_minor, pay_method_id, pay_type,
           pay_currency, pay_amount_minor_or_micro, fx_rate_snapshot,
           quote_id, quote_expires_at, pay_status, order_status,
           created_at
         ) VALUES (
           ?, ?, ?, 'pending', ?,
           ?, ?, ?, ?,
           'CNY', ?, ?, ?,
           ?, ?, ?,
           ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'UNPAID', 'NEW',
           NOW()
         )`,
        [
          orderNo, userId, totalAmount, payMethod.method_id,
          email || null, phone || null, payCurrency, remark || null,
          cnyAmountMinor || 0, paymentMethodId, payMethod.method_id,
          payCurrency, payAmountMinorOrMicro || 0, fxRateSnapshot || '',
          itemsHash || '',
        ]
      );
      const orderId = orderResult.insertId;

      // 插入订单明细（从 body.items 来 — 前端在 quote 后仍需传 items 用于记录）
      const orderItems = items || [];
      if (orderItems.length === 0) {
        // 没有 items 的时候仍然让订单创建成功（可能是场景不同）
      }
      for (const item of orderItems) {
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

      return NextResponse.json({
        success: true,
        message: '订单创建成功',
        data: {
          orderNo,
          orderId,
          totalAmount,
          payPageUrl: `/checkout?step=payment&orderNo=${orderNo}`,
          payAmount: formatPayAmount(payAmountMinorOrMicro || 0, payCurrency),
          payAmountRaw: payAmountMinorOrMicro,
          payCurrency,
          fxRateSnapshot,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          status: 'pending',
          email: email || null,
          phone: phone || null,
          orderCurrency: 'CNY',
          orderAmountMinor: cnyAmountMinor,
          payStatus: 'UNPAID',
          orderStatus: 'NEW',
        },
      });
    }

    // ============================================
    // 旧流程：无 quoteToken，向后兼容
    // ============================================
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

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    const orderResult = await dbQuery<any>(
      `INSERT INTO orders (order_no, user_id, total_amount, status, payment_method, buyer_email, buyer_phone, currency, remark, created_at)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, NOW())`,
      [orderNo, userId, totalAmount, paymentMethod, email || null, phone || null, currency || 'CNY', remark || null]
    );
    const orderId = orderResult.insertId;

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

    return NextResponse.json({
      success: true,
      message: '订单创建成功',
      data: {
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
      },
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: '创建订单失败: ' + error.message, errorCode: 'ORDER_CREATE_FAILED' },
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
