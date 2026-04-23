import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, MerchantApply } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// 初始化数据库表
const mysqlPassword = process.env.MYSQL_PASSWORD;
if (mysqlPassword) {
  initTables().catch(console.error);
}

// 提交商家入驻申请
export async function POST(request: NextRequest) {
  try {
    // 验证登录状态
    const payload = await verifySession(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { shop_name, contact_phone, business_category, remark } = body;

    // 验证必填字段
    if (!shop_name || shop_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: '店铺名称至少2个字符' },
        { status: 400 }
      );
    }

    if (!contact_phone) {
      return NextResponse.json(
        { success: false, message: '请输入联系电话' },
        { status: 400 }
      );
    }

    if (!business_category) {
      return NextResponse.json(
        { success: false, message: '请选择主营类目' },
        { status: 400 }
      );
    }

    // 检查用户是否已经是商家
    const users = await dbQuery<any[]>(
      'SELECT is_merchant FROM users WHERE id = ?',
      [payload.userId]
    );

    if (users.length > 0 && users[0].is_merchant === 1) {
      return NextResponse.json(
        { success: false, message: '您已是平台商家，无需重复申请' },
        { status: 400 }
      );
    }

    // 检查是否有待处理的申请
    const existingApplies = await dbQuery<MerchantApply[]>(
      "SELECT * FROM merchant_apply WHERE user_id = ? AND status = 'pending'",
      [payload.userId]
    );

    if (existingApplies.length > 0) {
      return NextResponse.json(
        { success: false, message: '您已有待审核的申请，请耐心等待' },
        { status: 400 }
      );
    }

    // 创建申请记录
    const result = await dbQuery<any>(
      'INSERT INTO merchant_apply (user_id, shop_name, contact_phone, business_category, remark, status) VALUES (?, ?, ?, ?, ?, ?)',
      [payload.userId, shop_name.trim(), contact_phone, business_category, remark || '', 'pending']
    );

    return NextResponse.json({
      success: true,
      message: '申请提交成功，请等待审核',
      data: {
        id: result.insertId,
        shop_name,
        contact_phone,
        business_category,
        status: 'pending',
      },
    });
  } catch (error: any) {
    console.error('Merchant apply error:', error);
    return NextResponse.json(
      { success: false, message: '提交失败: ' + error.message },
      { status: 500 }
    );
  }
}

// 获取商家入驻申请状态
export async function GET(request: NextRequest) {
  try {
    // 验证登录状态
    const payload = await verifySession(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    // 获取用户信息检查是否已是商家
    const users = await dbQuery<any[]>(
      'SELECT is_merchant FROM users WHERE id = ?',
      [payload.userId]
    );

    if (users.length > 0 && users[0].is_merchant === 1) {
      return NextResponse.json({
        success: true,
        data: {
          is_merchant: true,
          message: '您已是平台商家',
        },
      });
    }

    // 获取用户的申请记录
    const applies = await dbQuery<MerchantApply[]>(
      'SELECT * FROM merchant_apply WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [payload.userId]
    );

    if (applies.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          is_merchant: false,
          has_apply: false,
          message: '暂无申请记录',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        is_merchant: false,
        has_apply: true,
        apply: applies[0],
      },
    });
  } catch (error: any) {
    console.error('Get merchant status error:', error);
    return NextResponse.json(
      { success: false, message: '获取状态失败' },
      { status: 500 }
    );
  }
}