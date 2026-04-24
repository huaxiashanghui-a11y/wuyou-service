import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ code: 401, message: '未授权' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ code: 401, message: '无效的令牌' }, { status: 401 });
    }

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

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({ code: 500, message: '服务器错误' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ code: 401, message: '未授权' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ code: 401, message: '无效的令牌' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ code: 400, message: '用户ID不能为空' }, { status: 400 });
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
        return NextResponse.json({ code: 400, message: '无效的操作' }, { status: 400 });
    }

    return NextResponse.json({ code: 200, message: '操作成功' });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json({ code: 500, message: '服务器错误' }, { status: 500 });
  }
}
