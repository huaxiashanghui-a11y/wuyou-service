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

// 创建推广相关表
async function ensurePromotionTables() {
  try {
    // 推荐关系表（如果不存在）
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS referrals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL UNIQUE,
        invite_code VARCHAR(20) UNIQUE NOT NULL,
        invite_count INT DEFAULT 0,
        commission DECIMAL(10,2) DEFAULT 0,
        withdrawn DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}

  try {
    // 邀请记录表
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS invite_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        inviter_id INT NOT NULL,
        invitee_id INT NOT NULL,
        commission DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_inviter_id (inviter_id)
      )
    `);
  } catch (e) {}

  try {
    // 返佣记录表
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS commission_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        inviter_id INT NOT NULL,
        invitee_id INT,
        order_no VARCHAR(50),
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_inviter_id (inviter_id)
      )
    `);
  } catch (e) {}
}

// 获取推广数据
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensurePromotionTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'users';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    if (type === 'users') {
      // 推广用户信息
      let sql = `
        SELECT r.*, u.username, u.nickname, u.phone as user_phone, u.created_at as register_time
        FROM referrals r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (u.username LIKE ? OR u.phone LIKE ? OR r.invite_code LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY r.commission DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM referrals r LEFT JOIN users u ON r.user_id = u.id WHERE 1=1' +
        (keyword ? ' AND (u.username LIKE ? OR u.phone LIKE ? OR r.invite_code LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const users = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: users, total, page, pageSize });

    } else if (type === 'invites') {
      // 邀请记录
      let sql = `
        SELECT ir.*, 
               u1.username as inviter_name, u1.nickname as inviter_nickname,
               u2.username as invitee_name, u2.nickname as invitee_nickname
        FROM invite_records ir
        LEFT JOIN users u1 ON ir.inviter_id = u1.id
        LEFT JOIN users u2 ON ir.invitee_id = u2.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (u1.username LIKE ? OR u2.username LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY ir.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM invite_records ir LEFT JOIN users u1 ON ir.inviter_id = u1.id LEFT JOIN users u2 ON ir.invitee_id = u2.id WHERE 1=1' +
        (keyword ? ' AND (u1.username LIKE ? OR u2.username LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const invites = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: invites, total, page, pageSize });

    } else if (type === 'commissions') {
      // 返佣明细
      let sql = `
        SELECT cr.*, 
               u.username as inviter_name, u.nickname as inviter_nickname,
               u2.username as invitee_name
        FROM commission_records cr
        LEFT JOIN users u ON cr.inviter_id = u.id
        LEFT JOIN users u2 ON cr.invitee_id = u2.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (u.username LIKE ? OR cr.order_no LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY cr.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM commission_records cr LEFT JOIN users u ON cr.inviter_id = u.id WHERE 1=1' +
        (keyword ? ' AND (u.username LIKE ? OR cr.order_no LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const commissions = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: commissions, total, page, pageSize });

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('获取推广数据失败:', error);
    return errorResponse('获取推广数据失败: ' + error.message);
  }
}

// 更新推广数据
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensurePromotionTables();

    const body = await request.json();
    const { type, action, ...data } = body;

    if (type === 'users' && action === 'updateCommission' && data.user_id) {
      // 更新用户返佣金额
      if (data.commission !== undefined) {
        await dbQuery(
          'UPDATE referrals SET commission = ? WHERE user_id = ?',
          [data.commission, data.user_id]
        );
      }
      if (data.withdrawn !== undefined) {
        await dbQuery(
          'UPDATE referrals SET withdrawn = ? WHERE user_id = ?',
          [data.withdrawn, data.user_id]
        );
      }
      return successResponse(null, '返佣更新成功');

    } else {
      return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新推广数据失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 创建推广数据
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensurePromotionTables();

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'commissions') {
      // 手动添加返佣记录
      await dbQuery(
        'INSERT INTO commission_records (inviter_id, invitee_id, order_no, amount, type) VALUES (?, ?, ?, ?, ?)',
        [data.inviter_id, data.invitee_id, data.order_no, data.amount, data.type || 'manual']
      );
      return successResponse(null, '返佣记录创建成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('创建推广数据失败:', error);
    return errorResponse('创建失败: ' + error.message);
  }
}

// 删除推广数据
export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensurePromotionTables();

    const body = await request.json();
    const { type, ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('请选择要删除的项', 400);
    }

    const placeholders = ids.map(() => '?').join(',');

    if (type === 'commissions') {
      await dbQuery(`DELETE FROM commission_records WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('删除推广数据失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}