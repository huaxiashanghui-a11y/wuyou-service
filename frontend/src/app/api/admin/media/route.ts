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

// 创建素材表
async function ensureMediaTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        asset_type VARCHAR(20) NOT NULL,
        name VARCHAR(200) NOT NULL,
        url VARCHAR(500) NOT NULL,
        file_type VARCHAR(50),
        file_size INT,
        width INT,
        height INT,
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_asset_type (asset_type)
      )
    `);
  } catch (e) {}
}

// 获取素材数据
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureMediaTable();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'game';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const offset = (page - 1) * pageSize;

    let sql = 'SELECT * FROM media_assets WHERE asset_type = ?';
    const params: any[] = [type];
    const countParams: any[] = [type];

    if (keyword) {
      sql += ' AND name LIKE ?';
      params.push(`%${keyword}%`);
      countParams.push(`%${keyword}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countResult = await dbQuery<any[]>(
      'SELECT COUNT(*) as total FROM media_assets WHERE asset_type = ?' + (keyword ? ' AND name LIKE ?' : ''),
      countParams
    );
    const total = countResult[0]?.total || 0;

    const assets = await dbQuery<any[]>(sql, [...params, pageSize, offset]);
    return successResponse({ list: assets, total, page, pageSize });

  } catch (error: any) {
    console.error('获取素材数据失败:', error);
    return errorResponse('获取素材数据失败: ' + error.message);
  }
}

// 上传素材
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureMediaTable();

    const body = await request.json();
    const { asset_type, name, url, file_type, file_size, width, height } = body;

    if (!asset_type || !name || !url) {
      return errorResponse('素材类型、名称和URL不能为空', 400);
    }

    await dbQuery(
      'INSERT INTO media_assets (asset_type, name, url, file_type, file_size, width, height, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [asset_type, name, url, file_type, file_size, width, height, payload.userId]
    );

    return successResponse(null, '素材上传成功');
  } catch (error: any) {
    console.error('上传素材失败:', error);
    return errorResponse('上传失败: ' + error.message);
  }
}

// 更新素材
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureMediaTable();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return errorResponse('素材ID不能为空', 400);
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (updateData.name) { fields.push('name = ?'); values.push(updateData.name); }
    if (updateData.url) { fields.push('url = ?'); values.push(updateData.url); }
    if (updateData.status !== undefined) { fields.push('status = ?'); values.push(updateData.status); }

    if (fields.length > 0) {
      values.push(id);
      await dbQuery(`UPDATE media_assets SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return successResponse(null, '素材更新成功');
  } catch (error: any) {
    console.error('更新素材失败:', error);
    return errorResponse('更新失败: ' + error.message);
  }
}

// 删除素材
export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();
    await ensureMediaTable();

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('请选择要删除的素材', 400);
    }

    const placeholders = ids.map(() => '?').join(',');
    await dbQuery(`DELETE FROM media_assets WHERE id IN (${placeholders})`, ids);

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除素材失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}