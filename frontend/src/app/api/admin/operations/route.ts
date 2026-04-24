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

// 创建运营相关表
async function ensureOperationTables() {
  try {
    // 活动表
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        type VARCHAR(20),
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}

  try {
    // 公告表
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'notice',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}

  try {
    // 系统消息表
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS system_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        title VARCHAR(200),
        content TEXT NOT NULL,
        is_read TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}

  try {
    // 客服表
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS support_staff (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        avatar VARCHAR(255),
        phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'online',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (e) {}
}

// 获取运营数据
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'activities';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    if (type === 'activities') {
      let sql = 'SELECT * FROM activities WHERE 1=1';
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND title LIKE ?';
        params.push(`%${keyword}%`);
        countParams.push(`%${keyword}%`);
      }

      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM activities WHERE 1=1' + (keyword ? ' AND title LIKE ?' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const activities = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: activities, total, page, pageSize });

    } else if (type === 'notices') {
      let sql = 'SELECT * FROM notices WHERE 1=1';
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (title LIKE ? OR content LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM notices WHERE 1=1' + (keyword ? ' AND (title LIKE ? OR content LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const notices = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: notices, total, page, pageSize });

    } else if (type === 'messages') {
      let sql = `
        SELECT sm.*, u.username, u.nickname
        FROM system_messages sm
        LEFT JOIN users u ON sm.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      const countParams: any[] = [];

      if (keyword) {
        sql += ' AND (sm.title LIKE ? OR sm.content LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      sql += ' ORDER BY sm.created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>(
        'SELECT COUNT(*) as total FROM system_messages sm WHERE 1=1' + (keyword ? ' AND (sm.title LIKE ? OR sm.content LIKE ?)' : ''),
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      const messages = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: messages, total, page, pageSize });

    } else if (type === 'support') {
      await ensureOperationTables();
      const staff = await dbQuery<any[]>('SELECT * FROM support_staff ORDER BY status, id');
      return successResponse({ list: staff, total: staff.length });

    } else if (type === 'claims') {
      // 领取明细
      let sql = 'SELECT * FROM claims WHERE 1=1';
      const params: any[] = [];

      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

      const countResult = await dbQuery<any[]>('SELECT COUNT(*) as total FROM claims', []);
      const total = countResult[0]?.total || 0;

      const claims = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
      return successResponse({ list: claims, total, page, pageSize });

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('获取运营数据失败:', error);
    return errorResponse('获取运营数据失败: ' + error.message);
  }
}

// 更新运营数据
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, action, ...data } = body;

    if (type === 'activities') {
      if (data.id) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.title) { fields.push('title = ?'); values.push(data.title); }
        if (data.description) { fields.push('description = ?'); values.push(data.description); }
        if (data.type) { fields.push('type = ?'); values.push(data.type); }
        if (data.start_time) { fields.push('start_time = ?'); values.push(data.start_time); }
        if (data.end_time) { fields.push('end_time = ?'); values.push(data.end_time); }
        if (data.status) { fields.push('status = ?'); values.push(data.status); }

        if (fields.length > 0) {
          values.push(data.id);
          await dbQuery(`UPDATE activities SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '活动更新成功');
      }
      return errorResponse('缺少活动ID', 400);

    } else if (type === 'notices') {
      if (data.id) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.title) { fields.push('title = ?'); values.push(data.title); }
        if (data.content) { fields.push('content = ?'); values.push(data.content); }
        if (data.type) { fields.push('type = ?'); values.push(data.type); }
        if (data.status) { fields.push('status = ?'); values.push(data.status); }

        if (fields.length > 0) {
          values.push(data.id);
          await dbQuery(`UPDATE notices SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '公告更新成功');
      }
      return errorResponse('缺少公告ID', 400);

    } else if (type === 'support') {
      await ensureOperationTables();
      if (data.id) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.name) { fields.push('name = ?'); values.push(data.name); }
        if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
        if (data.status) { fields.push('status = ?'); values.push(data.status); }

        if (fields.length > 0) {
          values.push(data.id);
          await dbQuery(`UPDATE support_staff SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '客服更新成功');
      }
      return errorResponse('缺少客服ID', 400);

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('更新运营数据失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 创建运营数据
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'activities') {
      await dbQuery(
        'INSERT INTO activities (title, description, type, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)',
        [data.title, data.description, data.type, data.start_time, data.end_time, data.status || 'active']
      );
      return successResponse(null, '活动创建成功');

    } else if (type === 'notices') {
      await dbQuery(
        'INSERT INTO notices (title, content, type, status) VALUES (?, ?, ?, ?)',
        [data.title, data.content, data.type || 'notice', data.status || 'active']
      );
      return successResponse(null, '公告创建成功');

    } else if (type === 'messages') {
      await dbQuery(
        'INSERT INTO system_messages (user_id, title, content) VALUES (?, ?, ?)',
        [data.user_id, data.title, data.content]
      );
      return successResponse(null, '消息发送成功');

    } else if (type === 'support') {
      await ensureOperationTables();
      await dbQuery(
        'INSERT INTO support_staff (name, avatar, phone, status) VALUES (?, ?, ?, ?)',
        [data.name, data.avatar, data.phone, data.status || 'online']
      );
      return successResponse(null, '客服创建成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('创建运营数据失败:', error);
    return errorResponse('创建失败: ' + error.message);
  }
}

// 删除运营数据
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

    if (type === 'activities') {
      await dbQuery(`DELETE FROM activities WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else if (type === 'notices') {
      await dbQuery(`DELETE FROM notices WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else if (type === 'messages') {
      await dbQuery(`DELETE FROM system_messages WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else if (type === 'support') {
      await ensureOperationTables();
      await dbQuery(`DELETE FROM support_staff WHERE id IN (${placeholders})`, ids);
      return successResponse(null, '删除成功');

    } else {
      return errorResponse('未知类型', 400);
    }
  } catch (error: any) {
    console.error('删除运营数据失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}