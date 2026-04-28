import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ============================================
// GET /api/orders/[orderNo] - 获取单个订单详情
// ============================================
export async function GET(
  _request: NextRequest,
  { params }: { params: { orderNo: string } }
) {
  try {
    await initTables();

    const { orderNo } = params;

    if (!orderNo) {
      return NextResponse.json(
        { success: false, message: '缺少订单号' },
        { status: 400 }
      );
    }

    const rows = await dbQuery<any[]>(
      `SELECT o.*, oi.product_name, oi.product_id, oi.quantity, oi.price AS item_price
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.order_no = ?`,
      [orderNo]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: '订单不存在' },
        { status: 404 }
      );
    }

    // 组装订单数据
    const firstRow = rows[0];
    const orderData = {
      id: firstRow.id,
      orderNo: firstRow.order_no,
      userId: firstRow.user_id,
      totalAmount: firstRow.total_amount,
      status: firstRow.status,
      paymentMethod: firstRow.payment_method,
      paidAt: firstRow.paid_at,
      createdAt: firstRow.created_at,
      updatedAt: firstRow.updated_at,
      // 多币种字段
      orderCurrency: firstRow.order_currency,
      orderAmountMinor: firstRow.order_amount_minor,
      payMethodId: firstRow.pay_method_id,
      payType: firstRow.pay_type,
      payCurrency: firstRow.pay_currency,
      payAmountMinorOrMicro: firstRow.pay_amount_minor_or_micro,
      fxRateSnapshot: firstRow.fx_rate_snapshot,
      quoteId: firstRow.quote_id,
      quoteExpiresAt: firstRow.quote_expires_at,
      payStatus: firstRow.pay_status,
      orderStatus: firstRow.order_status,
      // 联系方式
      buyerEmail: firstRow.buyer_email,
      buyerPhone: firstRow.buyer_phone,
      remark: firstRow.remark,
      currency: firstRow.currency,
      // 商品列表
      items: rows
        .filter((r) => r.product_name)
        .map((r) => ({
          productName: r.product_name,
          productId: r.product_id,
          quantity: r.quantity,
          price: r.item_price,
        })),
    };

    return NextResponse.json({
      success: true,
      data: orderData,
    });
  } catch (error: any) {
    console.error('Get order detail error:', error);
    return NextResponse.json(
      { success: false, message: '查询订单失败: ' + error.message },
      { status: 500 }
    );
  }
}
