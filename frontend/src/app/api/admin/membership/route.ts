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

// 创建会员订单表
async function ensureMemberOrderTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS member_orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_no VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        member_level VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      )
    `);
  } catch (e) {}
}

// 创建会员等级表
async function ensureMemberLevelTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS member_levels (
        id INT PRIMARY KEY AUTO_INCREMENT,
        level_name VARCHAR(30) NOT NULL,
        level_code VARCHAR(20) NOT NULL UNIQUE,
        price DECIMAL(10,2) NOT NULL,
        discount DECIMAL(3,2) DEFAULT 1.00,
        benefits TEXT,
        status TINYINT DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}
}

// 获取会员数据
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
    const offset = (page - 1) * pageSize;

    if (type === 'orders') {
      // 会员订单
      await ensureMemberOrderTable();
      
      let sql = `
        SELECT mo.*, u.username, u.nickname, u.phone as user_phone
        FROM member_orders mo
        LEFT JOIN users u ON mo.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (mo.order_no LIKE ? OR u.username LIKE ? OR u.phone LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY mo.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM member_orders mo LEFT JOIN users u ON mo.user_id = u.id WHERE 1=1' +
        (keyword ? ' AND (mo.order_no LIKE ? OR u.username LIKE ? OR u.phone LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const orders = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: orders, total, page, pageSize });

    } else if (type === 'levels') {
      // 会员等级
      await ensureMemberLevelTable();
      const levels = await dbQuery<any[]>(
        'SELECT * FROM member_levels ORDER BY sort_order, id'
      );
      return successResponse({ list: levels, total: levels.length });

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('获取会员数据失败:', error);
    return errorResponse('获取会员数据失败: ' + error.message);
  }
}

// 更新会员数据
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
      // 会员订单操作
      if (action === 'cancel' && data.id) {
        await ensureMemberOrderTable();
        await dbQuery(
          'UPDATE member_orders SET status = ?, updated_at = NOW() WHERE id = ?',
          ['cancelled', data.id]
        );
        return successResponse(null, '订单已取消');

      } else if (action === 'confirm' && data.id) {
        await ensureMemberOrderTable();
        const orders = await dbQuery<any[]>('SELECT * FROM member_orders WHERE id = ?', [data.id]);
        if (orders.length > 0) {
          const order = orders[0];
          await dbQuery(
            'UPDATE member_orders SET status = ?, updated_at = NOW() WHERE id = ?',
            ['completed', data.id]
          );
          // 更新用户会员等级
          await dbQuery(
            'UPDATE users SET member_level = ? WHERE id = ?',
            [order.member_level, order.user_id]
          );
        }
        return successResponse(null, '订单已确认');

      } else if (action === 'updateStatus' && data.id) {
        await ensureMemberOrderTable();
        await dbQuery(
          'UPDATE member_orders SET status = ?, updated_at = NOW() WHERE id = ?',
          [data.status, data.id]
        );
        return successResponse(null, '状态更新成功');

      } else {
        return errorResponse('未知操作', 400);
      }

    } else if (type === 'levels') {
      // 会员等级操作
      await ensureMemberLevelTable();

      if (action === 'update' && data.id) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.level_name) { fields.push('level_name = ?'); values.push(data.level_name); }
        if (data.price !== undefined) { fields.push('price = ?'); values.push(data.price); }
        if (data.discount !== undefined) { fields.push('discount = ?'); values.push(data.discount); }
        if (data.benefits !== undefined) { fields.push('benefits = ?'); values.push(data.benefits); }
        if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
        if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

        if (fields.length > 0) {
          values.push(data.id);
          await dbQuery(`UPDATE member_levels SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '等级更新成功');

      } else {
        return errorResponse('缺少等级ID', 400);
      }

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('更新会员数据失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 创建会员数据
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'levels') {
      await ensureMemberLevelTable();
      await dbQuery(
        'INSERT INTO member_levels (level_name, level_code, price, discount, benefits, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [data.level_name, data.level_code, data.price, data.discount || 1.00, data.benefits, data.sort_order || 0]
      );
      return successResponse(null, '会员等级创建成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('创建会员数据失败:', error);
    return errorResponse('创建失败: ' + error.message);
  }
}

// 删除会员数据
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

    if (type === 'levels') {
      await ensureMemberLevelTable();
      await dbQuery(`DELETE FROM member_levels WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('删除会员数据失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}