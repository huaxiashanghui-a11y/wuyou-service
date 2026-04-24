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

// 创建外汇汇率表
async function ensureForexTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS forex_rates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        from_currency VARCHAR(10) NOT NULL,
        to_currency VARCHAR(10) NOT NULL,
        rate DECIMAL(15,6) NOT NULL,
        min_amount DECIMAL(10,2) DEFAULT 0,
        max_amount DECIMAL(10,2),
        fee_rate DECIMAL(5,4) DEFAULT 0,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_currency_pair (from_currency, to_currency)
      )
    `);
  } catch (e) {}
}

// 创建外汇兑换记录表
async function ensureForexExchangeTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS forex_exchanges (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_no VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        from_currency VARCHAR(10) NOT NULL,
        to_currency VARCHAR(10) NOT NULL,
        from_amount DECIMAL(15,4) NOT NULL,
        to_amount DECIMAL(15,4) NOT NULL,
        exchange_rate DECIMAL(15,6) NOT NULL,
        fee DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      )
    `);
  } catch (e) {}
}

// 获取外汇数据
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'rates';
    const currencyPair = searchParams.get('currencyPair') || 'cny-mmk';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    // 解析货币对
    const [fromCurrency, toCurrency] = currencyPair.split('-');

    if (type === 'rates') {
      // 获取汇率列表
      await ensureForexTable();
      const rates = await dbQuery<any[]>(
        'SELECT * FROM forex_rates ORDER BY from_currency, to_currency'
      );
      return successResponse({ list: rates, total: rates.length });

    } else if (type === 'exchanges') {
      // 获取兑换记录
      await ensureForexExchangeTable();
      
      let sql = `
        SELECT fe.*, u.username, u.nickname, u.phone as user_phone
        FROM forex_exchanges fe
        LEFT JOIN users u ON fe.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (fromCurrency && toCurrency) {
        sql += ' AND fe.from_currency = ? AND fe.to_currency = ?';
        params.push(fromCurrency, toCurrency);
        countParams.push(fromCurrency, toCurrency);
      }

      if (keyword) {
        sql += ' AND (fe.order_no LIKE ? OR u.username LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY fe.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM forex_exchanges fe LEFT JOIN users u ON fe.user_id = u.id WHERE 1=1' +
        (fromCurrency && toCurrency ? ' AND fe.from_currency = ? AND fe.to_currency = ?' : '') +
        (keyword ? ' AND (fe.order_no LIKE ? OR u.username LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const exchanges = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: exchanges, total, page, pageSize });

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('获取外汇数据失败:', error);
    return errorResponse('获取外汇数据失败: ' + error.message);
  }
}

// 更新外汇数据
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, action, ...data } = body;

    if (type === 'rates') {
      await ensureForexTable();

      if (action === 'update' && data.id) {
        // 更新汇率
        const fields: string[] = [];
        const values: any[] = [];

        if (data.rate !== undefined) { fields.push('rate = ?'); values.push(data.rate); }
        if (data.min_amount !== undefined) { fields.push('min_amount = ?'); values.push(data.min_amount); }
        if (data.max_amount !== undefined) { fields.push('max_amount = ?'); values.push(data.max_amount); }
        if (data.fee_rate !== undefined) { fields.push('fee_rate = ?'); values.push(data.fee_rate); }
        if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }

        if (fields.length > 0) {
          values.push(data.id);
          await dbQuery(`UPDATE forex_rates SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '汇率更新成功');

      } else if (action === 'create' || action === 'update') {
        // 创建或更新汇率
        const fromCurrency = data.from_currency || data.fromCurrency;
        const toCurrency = data.to_currency || data.toCurrency;

        if (!fromCurrency || !toCurrency) {
          return errorResponse('货币对不能为空', 400);
        }

        await dbQuery(
          `INSERT INTO forex_rates (from_currency, to_currency, rate, min_amount, max_amount, fee_rate)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE rate = ?, min_amount = ?, max_amount = ?, fee_rate = ?, updated_at = NOW()`,
          [fromCurrency, toCurrency, data.rate, data.min_amount || 0, data.max_amount, data.fee_rate || 0,
           data.rate, data.min_amount || 0, data.max_amount, data.fee_rate || 0]
        );
        return successResponse(null, '汇率保存成功');

      } else if (action === 'enable' && data.id) {
        await dbQuery('UPDATE forex_rates SET status = 1 WHERE id = ?', [data.id]);
        return successResponse(null, '汇率已启用');

      } else if (action === 'disable' && data.id) {
        await dbQuery('UPDATE forex_rates SET status = 0 WHERE id = ?', [data.id]);
        return successResponse(null, '汇率已禁用');

      } else {
        return errorResponse('未知操作', 400);
      }

    } else if (type === 'exchanges') {
      await ensureForexExchangeTable();

      if (action === 'confirm' && data.id) {
        await dbQuery(
          'UPDATE forex_exchanges SET status = ?, updated_at = NOW() WHERE id = ?',
          ['completed', data.id]
        );
        return successResponse(null, '兑换已确认');

      } else if (action === 'cancel' && data.id) {
        const exchanges = await dbQuery<any[]>('SELECT * FROM forex_exchanges WHERE id = ?', [data.id]);
        if (exchanges.length > 0) {
          const exchange = exchanges[0];
          await dbQuery(
            'UPDATE forex_exchanges SET status = ?, updated_at = NOW() WHERE id = ?',
            ['cancelled', data.id]
          );
          // 退还用户余额（如果已扣款）
          if (exchange.status === 'completed' && exchange.from_amount > 0) {
            const toField = exchange.from_currency === 'MMK' ? 'balance' : 'points';
            await dbQuery(
              `UPDATE users SET ${toField} = ${toField} + ? WHERE id = ?`,
              [exchange.from_amount, exchange.user_id]
            );
          }
        }
        return successResponse(null, '兑换已取消');

      } else {
        return errorResponse('未知操作', 400);
      }

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('更新外汇数据失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 创建外汇汇率
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'rates') {
      await ensureForexTable();
      await dbQuery(
        `INSERT INTO forex_rates (from_currency, to_currency, rate, min_amount, max_amount, fee_rate)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.from_currency, data.to_currency, data.rate, data.min_amount || 0, data.max_amount, data.fee_rate || 0]
      );
      return successResponse(null, '汇率创建成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('创建外汇汇率失败:', error);
    return errorResponse('创建失败: ' + error.message);
  }
}

// 删除外汇汇率
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

    if (type === 'rates') {
      await ensureForexTable();
      await dbQuery(`DELETE FROM forex_rates WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('删除外汇汇率失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}