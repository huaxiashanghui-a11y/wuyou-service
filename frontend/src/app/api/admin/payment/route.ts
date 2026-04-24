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

// 创建支付流水表
async function ensurePaymentFlowTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS payment_flows (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_no VARCHAR(50),
        user_id INT NOT NULL,
        payment_channel VARCHAR(30) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_payment_channel (payment_channel),
        INDEX idx_status (status)
      )
    `);
  } catch (e) {}
}

// 获取支付流水列表
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensurePaymentFlowTable();

    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const offset = (page - 1) * pageSize;

    let sql = `
      SELECT pf.*, u.username, u.nickname, u.phone as user_phone
      FROM payment_flows pf
      LEFT JOIN users u ON pf.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    const countParams: any[] = [];

    if (channel && channel !== 'all') {
      sql += ' AND pf.payment_channel = ?';
      params.push(channel);
      countParams.push(channel);
    }

    if (keyword) {
      sql += ' AND (pf.order_no LIKE ? OR pf.transaction_id LIKE ? OR u.username LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      sql += ' AND pf.status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (startDate) {
      sql += ' AND pf.created_at >= ?';
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      sql += ' AND pf.created_at <= ?';
      params.push(endDate);
      countParams.push(endDate);
    }

    sql += ' ORDER BY pf.created_at DESC LIMIT ? OFFSET ?';

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM payment_flows pf WHERE 1=1';
    if (channel && channel !== 'all') {
      countSql += ' AND pf.payment_channel = ?';
    }
    if (status) {
      countSql += ' AND pf.status = ?';
    }

    const countResult = await dbQuery<any[]>(
      countSql,
      countParams.length > 0 ? countParams : undefined
    );
    const total = countResult[0]?.total || 0;

    // 获取列表
    const flows = await dbQuery<any[]>(sql, [...params, pageSize, offset]);

    // 获取统计数据
    const statsResult = await dbQuery<any[]>(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_amount,
        SUM(CASE WHEN status = 'completed' AND payment_channel = ? THEN amount ELSE 0 END) as channel_amount
      FROM payment_flows
      ${channel && channel !== 'all' ? 'WHERE payment_channel = ?' : ''}
    `, channel && channel !== 'all' ? [channel, channel] : []);

    return successResponse({
      list: flows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      stats: statsResult[0] || { total_count: 0, total_amount: 0, channel_amount: 0 }
    });
  } catch (error: any) {
    console.error('获取支付流水失败:', error);
    return errorResponse('获取支付流水失败: ' + error.message);
  }
}

// 更新支付流水
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (action === 'updateStatus' && id) {
      await ensurePaymentFlowTable();
      await dbQuery(
        'UPDATE payment_flows SET status = ?, updated_at = NOW() WHERE id = ?',
        [updateData.status, id]
      );
      return successResponse(null, '状态更新成功');

    } else if (action === 'refund' && id) {
      // 退款操作
      await ensurePaymentFlowTable();
      const flows = await dbQuery<any[]>('SELECT * FROM payment_flows WHERE id = ?', [id]);
      if (flows.length === 0) {
        return errorResponse('记录不存在', 404);
      }
      const flow = flows[0];
      await dbQuery(
        'UPDATE payment_flows SET status = ?, updated_at = NOW() WHERE id = ?',
        ['refunded', id]
      );
      // 退款到用户余额
      if (flow.user_id && flow.amount > 0) {
        await dbQuery(
          'UPDATE users SET balance = balance + ? WHERE id = ?',
          [flow.amount, flow.user_id]
        );
        await dbQuery(
          'INSERT INTO wallet_transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)',
          [flow.user_id, 'refund', flow.amount, `支付退款: ${flow.order_no || flow.transaction_id}`]
        );
      }
      return successResponse(null, '退款成功');

    } else {
      return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新支付流水失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 删除支付流水记录
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
      return errorResponse('请选择要删除的记录', 400);
    }

    await ensurePaymentFlowTable();
    const placeholders = ids.map(() => '?').join(',');
    await dbQuery(
      `DELETE FROM payment_flows WHERE id IN (${placeholders}) AND status IN ('failed', 'refunded')`,
      ids
    );

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除支付流水失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}