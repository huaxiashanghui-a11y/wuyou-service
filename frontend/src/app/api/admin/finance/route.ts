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

// 创建支付配置表
async function ensurePaymentConfigTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS payment_configs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        payment_type VARCHAR(30) NOT NULL,
        config_key VARCHAR(50) NOT NULL,
        config_value TEXT,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_type_key (payment_type, config_key)
      )
    `);
  } catch (e) {}
}

// 创建积分表
async function ensurePointsTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS points_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        points INT NOT NULL,
        type VARCHAR(20) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
      )
    `);
  } catch (e) {}
}

// 创建价格表
async function ensurePriceTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS price_configs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        service_type VARCHAR(30) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        unit VARCHAR(20),
        description VARCHAR(255),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}
}

// 获取资金管理数据
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'payment';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    if (type === 'payment') {
      // 支付配置
      await ensurePaymentConfigTable();
      const configs = await dbQuery<any[]>(
        'SELECT * FROM payment_configs ORDER BY payment_type, id'
      );
      return successResponse({ list: configs, total: configs.length });

    } else if (type === 'points') {
      // 积分列表
      await ensurePointsTable();
      
      let sql = `
        SELECT pr.*, u.username, u.nickname, u.phone as user_phone
        FROM points_records pr
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (u.username LIKE ? OR u.phone LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY pr.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM points_records pr LEFT JOIN users u ON pr.user_id = u.id WHERE 1=1' +
        (keyword ? ' AND (u.username LIKE ? OR u.phone LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const records = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: records, total, page, pageSize });

    } else if (type === 'price') {
      // 价格列表
      await ensurePriceTable();
      const prices = await dbQuery<any[]>(
        'SELECT * FROM price_configs ORDER BY service_type, id'
      );
      return successResponse({ list: prices, total: prices.length });

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('获取资金管理数据失败:', error);
    return errorResponse('获取资金管理数据失败: ' + error.message);
  }
}

// 更新资金管理数据
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, action, ...data } = body;

    if (type === 'payment' && action === 'update') {
      await ensurePaymentConfigTable();
      // 更新支付配置
      if (data.id) {
        await dbQuery(
          'UPDATE payment_configs SET config_value = ?, updated_at = NOW() WHERE id = ?',
          [data.config_value, data.id]
        );
      } else if (data.payment_type && data.config_key) {
        await dbQuery(
          `INSERT INTO payment_configs (payment_type, config_key, config_value) 
           VALUES (?, ?, ?) 
           ON DUPLICATE KEY UPDATE config_value = ?, updated_at = NOW()`,
          [data.payment_type, data.config_key, data.config_value, data.config_value]
        );
      }
      return successResponse(null, '配置更新成功');

    } else if (type === 'points' && action === 'clear') {
      // 清零用户积分
      await ensurePointsTable();
      if (data.user_id) {
        await dbQuery('UPDATE users SET points = 0 WHERE id = ?', [data.user_id]);
        await dbQuery(
          'INSERT INTO points_records (user_id, points, type, description) VALUES (?, 0, ?, ?)',
          [data.user_id, 'clear', '管理员清零']
        );
      }
      return successResponse(null, '积分已清零');

    } else if (type === 'price' && action === 'update') {
      // 更新价格
      await ensurePriceTable();
      if (data.id) {
        await dbQuery(
          'UPDATE price_configs SET price = ?, description = ?, updated_at = NOW() WHERE id = ?',
          [data.price, data.description, data.id]
        );
      } else if (data.service_type) {
        await dbQuery(
          `INSERT INTO price_configs (service_type, price, unit, description) VALUES (?, ?, ?, ?)`,
          [data.service_type, data.price, data.unit, data.description]
        );
      }
      return successResponse(null, '价格更新成功');

    } else if (type === 'price' && action === 'batchUpdate') {
      // 批量更新价格
      await ensurePriceTable();
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          await dbQuery(
            'UPDATE price_configs SET price = ?, updated_at = NOW() WHERE id = ?',
            [item.price, item.id]
          );
        }
      }
      return successResponse(null, '批量更新成功');

    } else {
      return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新资金管理数据失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 创建资金配置
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'payment') {
      await ensurePaymentConfigTable();
      await dbQuery(
        'INSERT INTO payment_configs (payment_type, config_key, config_value) VALUES (?, ?, ?)',
        [data.payment_type, data.config_key, data.config_value]
      );
      return successResponse(null, '支付配置创建成功');

    } else if (type === 'price') {
      await ensurePriceTable();
      await dbQuery(
        'INSERT INTO price_configs (service_type, price, unit, description) VALUES (?, ?, ?, ?)',
        [data.service_type, data.price, data.unit, data.description]
      );
      return successResponse(null, '价格配置创建成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('创建资金配置失败:', error);
    return errorResponse('创建失败: ' + error.message);
  }
}

// 删除资金配置
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

    if (type === 'payment') {
      await ensurePaymentConfigTable();
      await dbQuery(`DELETE FROM payment_configs WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else if (type === 'price') {
      await ensurePriceTable();
      await dbQuery(`DELETE FROM price_configs WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('删除资金配置失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}