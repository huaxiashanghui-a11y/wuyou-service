import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { initTables } from '@/lib/db';
import { JWT_SECRET } from '@/lib/db';
import {
  itemsTotalCnyMinor,
  convertToPayAmount,
  getFxRateSnapshot,
  hashItems,
} from '@/lib/currency';

export const dynamic = 'force-dynamic';

// ============================================
// POST /api/payments/quote - 汇率报价（JWT 锁定）
// ============================================
export async function POST(request: NextRequest) {
  try {
    await initTables();

    const body = await request.json();
    const { items, targetCurrency } = body;

    // 参数校验
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: '商品列表不能为空' },
        { status: 400 }
      );
    }

    if (!targetCurrency || !['CNY', 'MMK', 'USDT'].includes(targetCurrency.toUpperCase())) {
      return NextResponse.json(
        { success: false, message: '不支持的目标币种，请选择 CNY / MMK / USDT' },
        { status: 400 }
      );
    }

    const currency = targetCurrency.toUpperCase();

    // 计算 CNY minor 总金额
    const cnyMinor = itemsTotalCnyMinor(items);

    // 换算为目标币种支付金额
    const payAmount = convertToPayAmount(cnyMinor, currency);

    // 获取汇率快照
    const fxRate = getFxRateSnapshot(currency);

    // 计算 items hash 防篡改
    const itemsHash = hashItems(items);

    // 生成 JWT 报价令牌 (15 分钟)
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      itemsHash,
      cnyMinor,
      payAmount,
      fxRate,
      payCurrency: currency,
      iat: now,
      exp: now + 900, // 15 分钟
    };

    const quoteToken = jwt.sign(payload, JWT_SECRET);

    return NextResponse.json({
      success: true,
      data: {
        quoteToken,
        payAmount,
        payCurrency: currency,
        fxRate,
        cnyAmountMinor: cnyMinor,
        expiresAt: new Date((now + 900) * 1000).toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Create quote error:', error);
    return NextResponse.json(
      { success: false, message: '创建报价失败: ' + error.message },
      { status: 500 }
    );
  }
}
