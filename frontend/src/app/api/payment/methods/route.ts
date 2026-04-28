import { NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ============================================
// GET /api/payment/methods - 获取可用支付方式
// ============================================
export async function GET() {
  try {
    await initTables();

    const methods = await dbQuery<any[]>(
      'SELECT id, method_id AS methodId, name, currency, status, config, sort_order AS sortOrder, created_at AS createdAt FROM payment_methods WHERE status = 1 ORDER BY sort_order ASC'
    );

    return NextResponse.json({
      success: true,
      data: methods.map((m) => ({
        ...m,
        config: typeof m.config === 'string' ? JSON.parse(m.config) : m.config,
      })),
    });
  } catch (error: any) {
    console.error('Get payment methods error:', error);
    return NextResponse.json(
      { success: false, message: '获取支付方式失败: ' + error.message },
      { status: 500 }
    );
  }
}
