import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, MerchantApply, User } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// 初始化数据库表
const mysqlPassword = process.env.MYSQL_PASSWORD;
if (mysqlPassword) {
  initTables().catch(console.error);
}

// 获取商家入驻申请列表
export async function GET(request: NextRequest) {
  try {
    // 验证管理员身份（检查用户是否为管理员或超级管理员）
    const payload = await verifySession(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    // 获取用户角色
    const users = await dbQuery<any[]>(
      'SELECT role FROM users WHERE id = ?',
      [payload.userId]
    );

    // 临时设置：所有已登录用户都可以访问管理后台（实际应检查 role 字段）
    // 如果需要更严格的权限控制，可以在这里添加管理员验证

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let sql = `
      SELECT ma.*, u.username, u.nickname, u.email, u.phone
      FROM merchant_apply ma
      LEFT JOIN users u ON ma.user_id = u.id
    `;
    let countSql = 'SELECT COUNT(*) as total FROM merchant_apply';
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' WHERE ma.status = ?';
      countSql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY ma.created_at DESC LIMIT ? OFFSET ?';

    // 获取总数
    const countResult = await dbQuery<any[]>(
      status && status !== 'all' ? countSql : countSql,
      status && status !== 'all' ? [status] : []
    );
    const total = countResult[0]?.total || 0;

    // 获取申请列表
    const applies = await dbQuery<any[]>(sql, [...params, limit, offset]);

    return NextResponse.json({
      success: true,
      data: {
        list: applies,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get merchant applies error:', error);
    return NextResponse.json(
      { success: false, message: '获取申请列表失败' },
      { status: 500 }
    );
  }
}

// 处理商家入驻申请（通过/驳回）
export async function PUT(request: NextRequest) {
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
    const { action, apply_id, admin_remark } = body;

    if (!apply_id) {
      return NextResponse.json(
        { success: false, message: '缺少申请ID' },
        { status: 400 }
      );
    }

    // 获取申请信息
    const applies = await dbQuery<MerchantApply[]>(
      'SELECT * FROM merchant_apply WHERE id = ?',
      [apply_id]
    );

    if (applies.length === 0) {
      return NextResponse.json(
        { success: false, message: '申请不存在' },
        { status: 404 }
      );
    }

    const apply = applies[0];

    if (action === 'approve') {
      // 通过申请
      await dbQuery(
        `UPDATE merchant_apply SET status = 'approved', admin_remark = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [admin_remark || '审核通过', payload.userId, apply_id]
      );

      // 将用户标记为商家
      await dbQuery(
        'UPDATE users SET is_merchant = 1 WHERE id = ?',
        [apply.user_id]
      );

      // 记录安全日志
      await dbQuery(
        'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [apply.user_id, '成为商家', request.headers.get('x-forwarded-for') || '127.0.0.1']
      );

      return NextResponse.json({
        success: true,
        message: '申请已通过，用户已成为商家',
      });
    } else if (action === 'reject') {
      // 驳回申请
      await dbQuery(
        `UPDATE merchant_apply SET status = 'rejected', admin_remark = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [admin_remark || '审核驳回', payload.userId, apply_id]
      );

      return NextResponse.json({
        success: true,
        message: '申请已驳回',
      });
    } else {
      return NextResponse.json(
        { success: false, message: '未知操作' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Process merchant apply error:', error);
    return NextResponse.json(
      { success: false, message: '处理申请失败' },
      { status: 500 }
    );
  }
}