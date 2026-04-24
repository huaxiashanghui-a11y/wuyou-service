import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';
import { verifySession, getTokenFromRequest } from '@/lib/auth';

// 确保数据库表已初始化
initTables().catch(console.error);

// 统一响应格式
function successResponse(data: any, message = 'success') {
  return NextResponse.json({ code: 200, message, data });
}

function errorResponse(message: string, status = 500) {
  return NextResponse.json({ code: status, message }, { status });
}

// 验证管理员身份
async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifySession(request);
}

// 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const offset = (page - 1) * pageSize;

    let sql = `
      SELECT o.*, u.username, u.nickname, u.phone as user_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    let countSql = 'SELECT COUNT(*) as total FROM orders o';
    const params: any[] = [];
    const countParams: any[] = [];

    const conditions: string[] = [];

    if (keyword) {
      conditions.push('(o.order_no LIKE ? OR u.username LIKE ? OR u.phone LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
      countParams.push(status);
    }

    if (paymentMethod) {
      conditions.push('o.payment_method = ?');
      params.push(paymentMethod);
      countParams.push(paymentMethod);
    }

    if (startDate) {
      conditions.push('o.created_at >= ?');
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      conditions.push('o.created_at <= ?');
      params.push(endDate);
      countParams.push(endDate);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      sql += whereClause;
      countSql += whereClause;
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';

    // 获取总数
    const countResult = await dbQuery<any[]>(
      countSql,
      countParams.length > 0 ? countParams : undefined
    );
    const total = countResult[0]?.total || 0;

    // 获取列表
    const orders = await dbQuery<any[]>(sql, [...params, pageSize, offset]);

    return successResponse({
      list: orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error: any) {
    console.error('获取订单列表失败:', error);
    return errorResponse('获取订单列表失败: ' + error.message);
  }
}

// 更新订单状态
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return errorResponse('订单ID不能为空', 400);
    }

    // 获取订单信息
    const orders = await dbQuery<any[]>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return errorResponse('订单不存在', 404);
    }

    const order = orders[0];

    switch (action) {
      case 'cancel':
        // 取消订单
        if (order.status !== 'pending' && order.status !== 'paid') {
          return errorResponse('当前状态不允许取消', 400);
        }
        await dbQuery(
          'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['cancelled', id]
        );
        // 如果已支付，退款到余额
        if (order.paid_at && order.total_amount > 0) {
          await dbQuery(
            'UPDATE users SET balance = balance + ? WHERE id = ?',
            [order.total_amount, order.user_id]
          );
          await dbQuery(
            'INSERT INTO wallet_transactions (user_id, type, amount, balance_before, balance_after, description) VALUES (?, ?, ?, ?, ?, ?)',
            [order.user_id, 'refund', order.total_amount, 0, order.total_amount, `订单取消退款: ${order.order_no}`]
          );
        }
        return successResponse(null, '订单已取消');

      case 'confirm':
        // 确认订单
        await dbQuery(
          'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['completed', id]
        );
        return successResponse(null, '订单已确认');

      case 'updateStatus':
        // 更新订单状态
        const newStatus = updateData.status;
        if (newStatus) {
          await dbQuery(
            'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
            [newStatus, id]
          );
        }
        return successResponse(null, '状态已更新');

      default:
        return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新订单失败:', error);
    return errorResponse('更新订单失败: ' + error.message);
  }
}

// 删除订单
export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('请选择要删除的订单', 400);
    }

    const placeholders = ids.map(() => '?').join(',');
    
    // 只删除已取消或完成的订单
    await dbQuery(
      `DELETE FROM orders WHERE id IN (${placeholders}) AND status IN ('cancelled', 'completed')`,
      ids
    );

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除订单失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}