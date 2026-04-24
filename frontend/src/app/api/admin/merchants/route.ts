import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, MerchantApply, User } from '@/lib/db';
import { verifySession, getTokenFromRequest } from '@/lib/auth';
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

// 获取商户列表（包括用户信息）
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    let sql = `
      SELECT ma.*, u.username, u.nickname, u.email, u.phone as user_phone
      FROM merchant_apply ma
      LEFT JOIN users u ON ma.user_id = u.id
    `;
    let countSql = 'SELECT COUNT(*) as total FROM merchant_apply ma';
    const params: any[] = [];

    if (keyword) {
      sql = `
        SELECT ma.*, u.username, u.nickname, u.email, u.phone as user_phone
        FROM merchant_apply ma
        LEFT JOIN users u ON ma.user_id = u.id
        WHERE (ma.shop_name LIKE ? OR ma.contact_phone LIKE ? OR u.username LIKE ?)
      `;
      countSql = `
        SELECT COUNT(*) as total FROM merchant_apply ma
        LEFT JOIN users u ON ma.user_id = u.id
        WHERE (ma.shop_name LIKE ? OR ma.contact_phone LIKE ? OR u.username LIKE ?)
      `;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status && status !== 'all') {
      if (keyword) {
        sql += ' AND ma.status = ?';
        countSql += ' AND ma.status = ?';
      } else {
        sql += ' WHERE ma.status = ?';
        countSql += ' WHERE ma.status = ?';
      }
      params.push(status);
    }

    sql += ' ORDER BY ma.created_at DESC LIMIT ? OFFSET ?';

    // 获取总数
    const countResult = await dbQuery<any[]>(
      countSql,
      params.length > 0 ? params : undefined
    );
    const total = countResult[0]?.total || 0;

    // 获取列表
    const applies = await dbQuery<any[]>(sql, [...params, pageSize, offset]);

    return successResponse({
      list: applies,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error: any) {
    console.error('获取商户列表失败:', error);
    return errorResponse('获取商户列表失败: ' + error.message);
  }
}

// 处理商户申请
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { id, action, admin_remark, ...updateData } = body;

    if (!id) {
      return errorResponse('缺少申请ID', 400);
    }

    // 获取申请信息
    const applies = await dbQuery<MerchantApply[]>(
      'SELECT * FROM merchant_apply WHERE id = ?',
      [id]
    );

    if (applies.length === 0) {
      return errorResponse('申请不存在', 404);
    }

    const apply = applies[0];

    // 处理审核操作
    if (action === 'approve') {
      await dbQuery(
        `UPDATE merchant_apply SET status = 'approved', admin_remark = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [admin_remark || '审核通过', payload.userId, id]
      );
      await dbQuery('UPDATE users SET is_merchant = 1 WHERE id = ?', [apply.user_id]);
      await dbQuery(
        'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [apply.user_id, '成为商家', request.headers.get('x-forwarded-for') || '127.0.0.1']
      );
      return successResponse(null, '申请已通过，用户已成为商家');

    } else if (action === 'reject') {
      await dbQuery(
        `UPDATE merchant_apply SET status = 'rejected', admin_remark = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [admin_remark || '审核驳回', payload.userId, id]
      );
      return successResponse(null, '申请已驳回');

    } else if (action === 'update') {
      // 更新商户信息
      const fields: string[] = [];
      const values: any[] = [];

      if (updateData.shop_name) {
        fields.push('shop_name = ?');
        values.push(updateData.shop_name);
      }
      if (updateData.contact_phone) {
        fields.push('contact_phone = ?');
        values.push(updateData.contact_phone);
      }
      if (updateData.business_category) {
        fields.push('business_category = ?');
        values.push(updateData.business_category);
      }

      if (fields.length > 0) {
        values.push(id);
        await dbQuery(`UPDATE merchant_apply SET ${fields.join(', ')} WHERE id = ?`, values);
      }
      return successResponse(null, '更新成功');

    } else {
      return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('处理商户申请失败:', error);
    return errorResponse('处理申请失败: ' + error.message);
  }
}

// 创建商户申请
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { shop_name, contact_phone, contact_email, business_category, remark, user_id } = body;

    await dbQuery(
      `INSERT INTO merchant_apply (user_id, shop_name, contact_phone, contact_email, business_category, remark, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id || payload.userId, shop_name, contact_phone, contact_email, business_category, remark]
    );

    return successResponse(null, '申请创建成功');
  } catch (error: any) {
    console.error('创建商户申请失败:', error);
    return errorResponse('创建申请失败: ' + error.message);
  }
}

// 删除商户申请
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
      return errorResponse('请选择要删除的申请', 400);
    }

    const placeholders = ids.map(() => '?').join(',');
    await dbQuery(`DELETE FROM merchant_apply WHERE id IN (${placeholders})`, ids);

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除商户申请失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}