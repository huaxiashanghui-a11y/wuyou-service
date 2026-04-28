import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';
import { formatPayAmount } from '@/lib/currency';

export const dynamic = 'force-dynamic';

// ============================================
// POST /api/payments/prepare - 准备支付（返回支付指引）
// ============================================
export async function POST(request: NextRequest) {
  try {
    await initTables();

    const body = await request.json();
    const { orderNo } = body;

    if (!orderNo) {
      return NextResponse.json(
        { success: false, message: '缺少订单号' },
        { status: 400 }
      );
    }

    // 查询订单
    const orders = await dbQuery<any[]>(
      'SELECT * FROM orders WHERE order_no = ?',
      [orderNo]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: '订单不存在' },
        { status: 404 }
      );
    }

    const order = orders[0];

    // 检查支付状态
    if (order.pay_status && order.pay_status !== 'UNPAID') {
      return NextResponse.json(
        { success: false, message: `订单支付状态为 ${order.pay_status}，无需重复支付` },
        { status: 400 }
      );
    }

    // 检查订单是否过期
    if (order.quote_expires_at && new Date(order.quote_expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, message: '订单已过期，请重新下单' },
        { status: 400 }
      );
    }

    // 查询支付方式
    let payMethod: any = null;
    if (order.pay_method_id) {
      const methods = await dbQuery<any[]>(
        'SELECT * FROM payment_methods WHERE id = ?',
        [order.pay_method_id]
      );
      if (methods.length > 0) {
        payMethod = methods[0];
      }
    }

    // 如果找不到支付方式，根据 pay_type 回退
    if (!payMethod && order.pay_type) {
      const methods = await dbQuery<any[]>(
        'SELECT * FROM payment_methods WHERE method_id = ? AND status = 1',
        [order.pay_type]
      );
      if (methods.length > 0) {
        payMethod = methods[0];
      }
    }

    if (!payMethod) {
      return NextResponse.json(
        { success: false, message: '支付方式不可用' },
        { status: 400 }
      );
    }

    // 解析支付配置
    let config: any = payMethod.config;
    if (typeof config === 'string') {
      config = JSON.parse(config);
    }

    // 支付金额（优先使用多币种字段，回退使用 total_amount）
    const payAmount =
      order.pay_amount_minor_or_micro ||
      (order.total_amount ? Math.round(order.total_amount * 100) : 0);
    const payCurrency = order.pay_currency || order.currency || payMethod.currency;

    // 生成 transaction number
    const transactionNo =
      'TXN' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    // 创建支付交易记录
    try {
      await dbQuery(
        `INSERT IGNORE INTO payment_transactions (order_id, transaction_no, pay_method_id, amount_micro_or_minor, currency, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'PENDING', NOW())`,
        [order.id, transactionNo, payMethod.id, payAmount, payCurrency]
      );
    } catch (e: any) {
      console.log('Create payment_transaction:', e.message);
    }

    // 构建支付指引
    let instructions: any = {};
    let methodType = payMethod.method_id;

    if (config) {
      instructions = {
        type: config.type || 'unknown',
        address: config.address || null,
        merchantCode: config.merchantCode || null,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        methodType,
        instructions,
        transactionNo,
        amount: formatPayAmount(payAmount, payCurrency),
        amountRaw: payAmount,
        currency: payCurrency,
      },
    });
  } catch (error: any) {
    console.error('Prepare payment error:', error);
    return NextResponse.json(
      { success: false, message: '准备支付失败: ' + error.message },
      { status: 500 }
    );
  }
}
