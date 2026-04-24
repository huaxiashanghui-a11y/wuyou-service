import { NextRequest, NextResponse } from 'next/server';
import { getPool, initTables } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

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
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    if (!decoded) {
      return errorResponse('未授权', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const status = searchParams.get('status');
    const memberLevel = searchParams.get('memberLevel');

    const connection = await getPool().getConnection();

    let whereClause = '1=1';
    const params: any[] = [];

    if (keyword) {
      whereClause += ' AND (username LIKE ? OR nickname LIKE ? OR phone LIKE ? OR email LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (memberLevel) {
      whereClause += ' AND member_level = ?';
      params.push(memberLevel);
    }

    // 获取总数
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    // 获取用户列表
    const offset = (page - 1) * pageSize;
    const [rows] = await connection.execute(
      `SELECT id, username, nickname, email, phone, avatar, balance, points, member_level,
              real_name, id_card, is_merchant, status, created_at, last_login
       FROM users WHERE ${whereClause}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    connection.release();

    return successResponse({
      list: rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    return errorResponse('服务器错误: ' + error.message);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    if (!decoded) {
      return errorResponse('未授权', 401);
    }

    await initTables();

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return errorResponse('用户ID不能为空', 400);
    }

    const connection = await getPool().getConnection();

    switch (action) {
      case 'updateStatus':
        await connection.execute(
          'UPDATE users SET status = ? WHERE id = ?',
          [updateData.status, id]
        );
        break;

      case 'updateMemberLevel':
        await connection.execute(
          'UPDATE users SET member_level = ? WHERE id = ?',
          [updateData.memberLevel, id]
        );
        break;

      case 'resetPoints':
        await connection.execute(
          'UPDATE users SET points = 0 WHERE id = ?',
          [id]
        );
        break;

      case 'resetBalance':
        await connection.execute(
          'UPDATE users SET balance = 0 WHERE id = ?',
          [id]
        );
        break;

      case 'update':
        const allowedFields = ['nickname', 'email', 'phone', 'real_name', 'avatar'];
        const fields: string[] = [];
        const values: any[] = [];

        for (const [key, value] of Object.entries(updateData)) {
          if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        }

        if (fields.length > 0) {
          values.push(id);
          await connection.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
          );
        }
        break;

      default:
        connection.release();
        return errorResponse('无效的操作', 400);
    }

    connection.release();
    return successResponse(null, '操作成功');
  } catch (error: any) {
    console.error('更新用户失败:', error);
    return errorResponse('服务器错误: ' + error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    if (!decoded) {
      return errorResponse('未授权', 401);
    }

    await initTables();

    const body = await request.json();
    const connection = await getPool().getConnection();

    // 添加用户
    const { username, password, nickname, email, phone, real_name } = body;

    await connection.execute(
      `INSERT INTO users (username, password, nickname, email, phone, real_name, status) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [username, password, nickname || username, email, phone, real_name]
    );

    connection.release();
    return successResponse(null, '用户创建成功');
  } catch (error: any) {
    console.error('创建用户失败:', error);
    return errorResponse('服务器错误: ' + error.message);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = await verifyAdmin(request);
    if (!decoded) {
      return errorResponse('未授权', 401);
    }

    await initTables();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('请选择要删除的用户', 400);
    }

    const connection = await getPool().getConnection();
    const placeholders = ids.map(() => '?').join(',');
    await connection.execute(`DELETE FROM users WHERE id IN (${placeholders})`, ids);

    connection.release();
    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除用户失败:', error);
    return errorResponse('服务器错误: ' + error.message);
  }
}
