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

// 获取产品列表
export async function GET(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const offset = (page - 1) * pageSize;

    // 创建 products 表（如果不存在）
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0,
        original_price DECIMAL(10,2),
        category VARCHAR(50),
        stock INT DEFAULT 0,
        sales INT DEFAULT 0,
        images JSON,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status)
      )
    `).catch(() => {});

    let sql = 'SELECT * FROM products WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM products';
    const params: any[] = [];
    const countParams: any[] = [];

    if (keyword) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      countSql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
      countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (category) {
      sql += ' AND category = ?';
      countSql += ' AND category = ?';
      params.push(category);
      countParams.push(category);
    }

    if (status) {
      sql += ' AND status = ?';
      countSql += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    // 获取总数
    const countResult = await dbQuery<any[]>(
      countSql,
      countParams.length > 0 ? countParams : undefined
    );
    const total = countResult[0]?.total || 0;

    // 获取列表
    const products = await dbQuery<any[]>(sql, [...params, pageSize, offset]);

    return successResponse({
      list: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error: any) {
    console.error('获取产品列表失败:', error);
    return errorResponse('获取产品列表失败: ' + error.message);
  }
}

// 创建/更新产品
export async function POST(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { name, description, price, original_price, category, stock, images, status } = body;

    // 验证必填字段
    if (!name || !price) {
      return errorResponse('产品名称和价格不能为空', 400);
    }

    // 创建产品
    await dbQuery(
      `INSERT INTO products (name, description, price, original_price, category, stock, images, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, original_price, category, stock || 0, JSON.stringify(images || []), status || 'active']
    );

    return successResponse(null, '产品创建成功');
  } catch (error: any) {
    console.error('创建产品失败:', error);
    return errorResponse('创建产品失败: ' + error.message);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyAdmin(request);
    if (!payload) {
      return errorResponse('请先登录', 401);
    }

    await initTables();

    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return errorResponse('产品ID不能为空', 400);
    }

    // 获取产品信息
    const products = await dbQuery<any[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return errorResponse('产品不存在', 404);
    }

    switch (action) {
      case 'update':
        // 更新产品信息
        const fields: string[] = [];
        const values: any[] = [];

        const allowedFields = ['name', 'description', 'price', 'original_price', 'category', 'stock', 'status'];
        for (const [key, value] of Object.entries(updateData)) {
          if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(value);
          }
        }

        // 处理 images 字段
        if (updateData.images) {
          fields.push('images = ?');
          values.push(JSON.stringify(updateData.images));
        }

        if (fields.length > 0) {
          values.push(id);
          await dbQuery(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '产品更新成功');

      case 'updateStatus':
        // 更新产品状态
        await dbQuery(
          'UPDATE products SET status = ? WHERE id = ?',
          [updateData.status, id]
        );
        return successResponse(null, '状态更新成功');

      case 'batchUpdateStatus':
        // 批量更新状态
        if (updateData.ids && Array.isArray(updateData.ids)) {
          const placeholders = updateData.ids.map(() => '?').join(',');
          await dbQuery(
            `UPDATE products SET status = ? WHERE id IN (${placeholders})`,
            [updateData.status, ...updateData.ids]
          );
        }
        return successResponse(null, '批量更新成功');

      default:
        return errorResponse('未知操作', 400);
    }
  } catch (error: any) {
    console.error('更新产品失败:', error);
    return errorResponse('更新产品失败: ' + error.message);
  }
}

// 删除产品
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
      return errorResponse('请选择要删除的产品', 400);
    }

    const placeholders = ids.map(() => '?').join(',');
    await dbQuery(`DELETE FROM products WHERE id IN (${placeholders})`, ids);

    return successResponse(null, '删除成功');
  } catch (error: any) {
    console.error('删除产品失败:', error);
    return errorResponse('删除失败: ' + error.message);
  }
}