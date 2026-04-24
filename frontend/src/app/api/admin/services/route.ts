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

// 创建服务订单表（如果不存在）
async function ensureServiceTables() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS service_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_no VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        service_type VARCHAR(20) NOT NULL,
        total_amount DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_status VARCHAR(20) DEFAULT 'unpaid',
        address TEXT,
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_service_type (service_type),
        INDEX idx_status (status)
      )
    `);
  } catch (e) {}
}

// 获取服务订单列表（支持外卖、跑腿、帮买帮送、代购、滴滴车）
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureServiceTables();

    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const offset = (page - 1) * pageSize;

    let sql = `
      SELECT so.*, u.username, u.nickname, u.phone as user_phone
      FROM service_orders so
      LEFT JOIN users u ON so.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    const countParams: any[] = [];

    if (serviceType && serviceType !== 'all') {
      sql += ' AND so.service_type = ?';
      params.push(serviceType);
      countParams.push(serviceType);
    }

    if (keyword) {
      sql += ' AND (so.order_no LIKE ? OR u.username LIKE ? OR u.phone LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      sql += ' AND so.status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (startDate) {
      sql += ' AND so.created_at >= ?';
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      sql += ' AND so.created_at <= ?';
      params.push(endDate);
      countParams.push(endDate);
    }

    sql += ' ORDER BY so.created_at DESC LIMIT ? OFFSET ?';

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM service_orders WHERE 1=1';
    if (serviceType && serviceType !== 'all') {
      countSql += ' AND service_type = ?';
    }
    if (status) {
      countSql += ' AND status = ?';
    }

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
    console.error('获取服务订单列表失败:', error);
    return errorResponse('获取服务订单列表失败: ' + error.message);
  }
}

// 更新服务订单
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
      'SELECT * FROM service_orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return errorResponse('订单不存在', 404);
    }

    const order = orders[0];

    switch (action) {
      case 'confirm':
        await dbQuery(
          'UPDATE service_orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['confirmed', id]
        );
        return successResponse(null, '订单已确认');

      case 'cancel':
        await dbQuery(
          'UPDATE service_orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['cancelled', id]
        );
        return successResponse(null, '订单已取消');

      case 'complete':
        await dbQuery(
          'UPDATE service_orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['completed', id]
        );
        return successResponse(null, '订单已完成');

      case 'updateStatus':
        if (updateData.status) {
          await dbQuery(
            'UPDATE service_orders SET status = ?, updated_at = NOW() WHERE id = ?',
            [updateData.status, id]
          );
        }
        return successResponse(null, '状态已更新');

      default:
        return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新服务订单失败:', error);
    return errorResponse('更新服务订单失败: ' + error.message);
  }
}

// 删除服务订单
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
    await dbQuery(
      `DELETE FROM service_orders WHERE id IN (${placeholders}) AND status IN ('cancelled', 'completed')`,
      ids
    );

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除服务订单失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}