import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';
import { verifySession, getTokenFromRequest, generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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

// 创建管理员账号表
async function ensureAdminTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nickname VARCHAR(50),
        role VARCHAR(20) DEFAULT 'admin',
        status TINYINT DEFAULT 1,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}
}

// 获取管理员账号列表
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureAdminTable();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    let sql = 'SELECT id, username, nickname, role, status, last_login, created_at FROM admin_users WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (keyword) {
      sql += ' AND (username LIKE ? OR nickname LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
      countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countResult = await dbQuery<any[]>(
      'SELECT COUNT(*) as total FROM admin_users WHERE 1=1' +
      (keyword ? ' AND (username LIKE ? OR nickname LIKE ?)' : ''),
      countParams.length > 0 ? countParams : undefined
    );
    const total = countResult[0]?.total || 0;

    const admins = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
    return successResponse({ list: admins, total, page, pageSize });
  } catch (error: any) {
    console.error('获取管理员列表失败:', error);
    return errorResponse('获取管理员列表失败: ' + error.message);
  }
}

// 创建管理员账号
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureAdminTable();

    const body = await request.json();
    const { username, password, nickname, role } = body;

    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400);
    }

    // 检查是否已存在
    const existing = await dbQuery<any[]>(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return errorResponse('用户名已存在', 400);
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    await dbQuery(
      'INSERT INTO admin_users (username, password, nickname, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, nickname || username, role || 'admin']
    );

    return successResponse(null, '管理员账号创建成功');
  } catch (error: any) {
    console.error('创建管理员失败:', error);
    return errorResponse('创建失败: ' + error.message);
  }
}

// 更新管理员账号
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureAdminTable();

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return errorResponse('管理员ID不能为空', 400);
    }

    if (action === 'update') {
      const fields: string[] = [];
      const values: any[] = [];

      if (updateData.nickname) { fields.push('nickname = ?'); values.push(updateData.nickname); }
      if (updateData.role) { fields.push('role = ?'); values.push(updateData.role); }
      if (updateData.status !== undefined) { fields.push('status = ?'); values.push(updateData.status); }

      // 如果提供了新密码
      if (updateData.password) {
        const hashedPassword = await bcrypt.hash(updateData.password, 10);
        fields.push('password = ?');
        values.push(hashedPassword);
      }

      if (fields.length > 0) {
        values.push(id);
        await dbQuery(`UPDATE admin_users SET ${fields.join(', ')} WHERE id = ?`, values);
      }
      return successResponse(null, '管理员信息更新成功');

    } else if (action === 'disable') {
      await dbQuery('UPDATE admin_users SET status = 0 WHERE id = ?', [id]);
      return successResponse(null, '管理员已禁用');

    } else if (action === 'enable') {
      await dbQuery('UPDATE admin_users SET status = 1 WHERE id = ?', [id]);
      return successResponse(null, '管理员已启用');

    } else if (action === 'resetPassword' && id) {
      // 重置密码为默认值
      const defaultPassword = 'admin123456';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await dbQuery('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, id]);
      return successResponse({ password: defaultPassword }, '密码已重置为: ' + defaultPassword);

    } else {
      return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新管理员失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 删除管理员账号
export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureAdminTable();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('请选择要删除的管理员', 400);
    }

    // 不允许删除内置管理员
    const safeIds = ids.filter(id => id !== 0);
    if (safeIds.length === 0) {
      return errorResponse('不能删除内置管理员', 400);
    }

    const placeholders = safeIds.map(() => '?').join(',');
    await dbQuery(`DELETE FROM admin_users WHERE id IN (${placeholders})`, safeIds);

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除管理员失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}