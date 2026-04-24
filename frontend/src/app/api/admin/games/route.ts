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

// 创建游戏订单表
async function ensureGameOrderTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS game_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_no VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        game_name VARCHAR(50),
        product_name VARCHAR(100),
        product_id INT,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        delivery_status VARCHAR(20) DEFAULT 'pending',
        delivery_info TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      )
    `);
  } catch (e) {}
}

// 获取游戏数据
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'orders';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const status = searchParams.get('status');
    const offset = (page - 1) * pageSize;

    if (type === 'orders') {
      // 游戏订单
      await ensureGameOrderTable();
      
      let sql = `
        SELECT go.*, u.username, u.nickname, u.phone as user_phone
        FROM game_orders go
        LEFT JOIN users u ON go.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (go.order_no LIKE ? OR go.game_name LIKE ? OR go.product_name LIKE ? OR u.username LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      }

      if (status) {
        sql += ' AND go.status = ?';
        params.push(status);
        countParams.push(status);
      }

      sql += ' ORDER BY go.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM game_orders go LEFT JOIN users u ON go.user_id = u.id WHERE 1=1' +
        (status ? ' AND go.status = ?' : '') +
        (keyword ? ' AND (go.order_no LIKE ? OR go.game_name LIKE ? OR go.product_name LIKE ? OR u.username LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const orders = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: orders, total, page, pageSize });

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('获取游戏数据失败:', error);
    return errorResponse('获取游戏数据失败: ' + error.message);
  }
}

// 更新游戏数据
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, action, ...data } = body;

    if (type === 'orders') {
      await ensureGameOrderTable();

      if (action === 'resend' && data.id) {
        // 补发货
        await dbQuery(
          'UPDATE game_orders SET delivery_status = ?, delivery_info = ?, updated_at = NOW() WHERE id = ?',
          ['delivered', data.delivery_info || '管理员补发', data.id]
        );
        return successResponse(null, '补发成功');

      } else if (action === 'cancel' && data.id) {
        // 取消订单
        await dbQuery(
          'UPDATE game_orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['cancelled', data.id]
        );
        return successResponse(null, '订单已取消');

      } else if (action === 'updateStatus' && data.id) {
        // 更新状态
        if (data.status) {
          await dbQuery(
            'UPDATE game_orders SET status = ?, updated_at = NOW() WHERE id = ?',
            [data.status, data.id]
          );
        }
        if (data.delivery_status) {
          await dbQuery(
            'UPDATE game_orders SET delivery_status = ?, updated_at = NOW() WHERE id = ?',
            [data.delivery_status, data.id]
          );
        }
        return successResponse(null, '状态更新成功');

      } else {
        return errorResponse('未知操作', 400);
      }

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('更新游戏数据失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 删除游戏数据
export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('请选择要删除的项', 400);
    }

    const placeholders = ids.map(() => '?').join(',');

    if (type === 'orders') {
      await ensureGameOrderTable();
      await dbQuery(
        `DELETE FROM game_orders WHERE id IN (${placeholders}) AND status = 'cancelled'`,
        ids
      );
      return successResponse(null, '删除成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('删除游戏数据失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}