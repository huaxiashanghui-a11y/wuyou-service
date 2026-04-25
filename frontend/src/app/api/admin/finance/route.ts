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

// 创建支付渠道配置表（与图片字段一致）
async function ensurePaymentChannelTable() {
  try {
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS payment_channels (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL COMMENT '名称',
        merchant_name VARCHAR(100) COMMENT '商户名称',
        payment_method VARCHAR(30) NOT NULL COMMENT '支付方式',
        device_type VARCHAR(50) COMMENT '设备类型',
        random_group VARCHAR(50) COMMENT '随机支付分组',
        fee_rate DECIMAL(5,4) DEFAULT 0 COMMENT '手续费比例',
        status TINYINT DEFAULT 1 COMMENT '状态：1启用 0禁用',
        payment_level VARCHAR(50) COMMENT '支付层级',
        sort_order INT DEFAULT 0 COMMENT '排序',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_method (payment_method),
        INDEX idx_status (status)
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

// 支付方式映射
const PAYMENT_METHODS: Record<string, string> = {
  'alipay': '支付宝',
  'wechat': '微信',
  'manual': '人工充值',
  'bocoin': '波币钱包送5%',
  'unionpay': '银联转账',
  'digital_rmb': '数字人民币',
};

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
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const keyword = searchParams.get('keyword') || '';
    const paymentMethod = searchParams.get('paymentMethod') || '';
    const status = searchParams.get('status') || '';
    const sortField = searchParams.get('sortField') || 'sort_order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const offset = (page - 1) * pageSize;

    if (type === 'payment') {
      // 支付渠道配置
      await ensurePaymentChannelTable();

      let sql = 'SELECT * FROM payment_channels WHERE 1=1';
      let countSql = 'SELECT COUNT(*) as total FROM payment_channels';
      const params: any[] = [];
      const countParams: any[] = [];

      // 支付方式筛选
      if (paymentMethod && paymentMethod !== 'all') {
        if (paymentMethod === 'disabled') {
          sql += ' AND status = 0';
          countSql += ' WHERE status = 0';
        } else {
          const methodKey = Object.keys(PAYMENT_METHODS).find(k => PAYMENT_METHODS[k] === paymentMethod);
          sql += ' AND payment_method = ?';
          countSql += ' WHERE payment_method = ?';
          params.push(methodKey || paymentMethod);
          countParams.push(methodKey || paymentMethod);
        }
      }

      // 关键词搜索
      if (keyword) {
        sql += ' AND (name LIKE ? OR merchant_name LIKE ?)';
        countSql += (countSql.includes('WHERE') ? ' AND' : ' WHERE') + ' (name LIKE ? OR merchant_name LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }

      // 排序
      const allowedSortFields = ['name', 'fee_rate', 'sort_order', 'created_at'];
      const validSortField = allowedSortFields.includes(sortField) ? sortField : 'sort_order';
      const validSortOrder = sortOrder === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${validSortField} ${validSortOrder}`;

      // 分页
      sql += ' LIMIT ? OFFSET ?';

      // 获取总数
      const countResult = await dbQuery<any[]>(
        countSql,
        countParams.length > 0 ? countParams : undefined
      );
      const total = countResult[0]?.total || 0;

      // 获取列表
      const channels = await dbQuery<any[]>(sql, [...params, pageSize, offset]);

      // 转换支付方式为中文
      const formattedChannels = channels.map(ch => ({
        ...ch,
        payment_method_name: PAYMENT_METHODS[ch.payment_method] || ch.payment_method,
        status_name: ch.status === 1 ? '启用' : '禁用'
      }));

      return successResponse({
        list: formattedChannels,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        paymentMethods: Object.values(PAYMENT_METHODS)
      });

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

    if (type === 'payment') {
      await ensurePaymentChannelTable();

      if (action === 'update' && data.id) {
        // 更新支付渠道
        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
        if (data.merchant_name !== undefined) { fields.push('merchant_name = ?'); values.push(data.merchant_name); }
        if (data.payment_method !== undefined) { fields.push('payment_method = ?'); values.push(data.payment_method); }
        if (data.device_type !== undefined) { fields.push('device_type = ?'); values.push(data.device_type); }
        if (data.random_group !== undefined) { fields.push('random_group = ?'); values.push(data.random_group); }
        if (data.fee_rate !== undefined) { fields.push('fee_rate = ?'); values.push(data.fee_rate); }
        if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
        if (data.payment_level !== undefined) { fields.push('payment_level = ?'); values.push(data.payment_level); }
        if (data.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(data.sort_order); }

        if (fields.length > 0) {
          values.push(data.id);
          await dbQuery(`UPDATE payment_channels SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        return successResponse(null, '配置更新成功');

      } else if (action === 'toggleStatus' && data.id) {
        // 快速切换状态
        await dbQuery('UPDATE payment_channels SET status = IF(status=1, 0, 1) WHERE id = ?', [data.id]);
        return successResponse(null, '状态已切换');

      } else if (action === 'create') {
        // 创建支付渠道
        await dbQuery(
          `INSERT INTO payment_channels (name, merchant_name, payment_method, device_type, random_group, fee_rate, status, payment_level, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.name,
            data.merchant_name || '',
            data.payment_method,
            data.device_type || '',
            data.random_group || '',
            data.fee_rate || 0,
            data.status !== undefined ? data.status : 1,
            data.payment_level || '',
            data.sort_order || 0
          ]
        );
        return successResponse(null, '支付渠道创建成功');

      } else if (action === 'initSampleData') {
        // 插入示例数据
        const sampleData = [
          { name: '支付宝官方', merchant_name: '无忧服务官方', payment_method: 'alipay', device_type: 'all', random_group: 'A组', fee_rate: 0, status: 1, payment_level: '一级', sort_order: 1 },
          { name: '支付宝-渠道商A', merchant_name: '渠道商A', payment_method: 'alipay', device_type: 'mobile', random_group: 'A组', fee_rate: 0.005, status: 1, payment_level: '二级', sort_order: 2 },
          { name: '微信支付官方', merchant_name: '无忧服务官方', payment_method: 'wechat', device_type: 'all', random_group: 'B组', fee_rate: 0, status: 1, payment_level: '一级', sort_order: 3 },
          { name: '微信-渠道商B', merchant_name: '渠道商B', payment_method: 'wechat', device_type: 'pc', random_group: 'B组', fee_rate: 0.003, status: 1, payment_level: '二级', sort_order: 4 },
          { name: '人工充值-客服1', merchant_name: '客服中心', payment_method: 'manual', device_type: 'all', random_group: '', fee_rate: 0, status: 1, payment_level: '一级', sort_order: 5 },
          { name: '人工充值-客服2', merchant_name: '客服中心', payment_method: 'manual', device_type: 'all', random_group: '', fee_rate: 0, status: 1, payment_level: '二级', sort_order: 6 },
          { name: '波币钱包', merchant_name: '波币平台', payment_method: 'bocoin', device_type: 'all', random_group: '', fee_rate: 0, status: 1, payment_level: '一级', sort_order: 7 },
          { name: '银联转账', merchant_name: '银行通道', payment_method: 'unionpay', device_type: 'all', random_group: 'C组', fee_rate: 0.002, status: 1, payment_level: '一级', sort_order: 8 },
          { name: '数字人民币', merchant_name: '央行数字货币', payment_method: 'digital_rmb', device_type: 'all', random_group: 'D组', fee_rate: 0, status: 1, payment_level: '一级', sort_order: 9 },
          { name: '支付宝-旧通道', merchant_name: '已停用', payment_method: 'alipay', device_type: 'pc', random_group: '', fee_rate: 0.01, status: 0, payment_level: '三级', sort_order: 10 },
        ];

        for (const item of sampleData) {
          await dbQuery(
            `INSERT INTO payment_channels (name, merchant_name, payment_method, device_type, random_group, fee_rate, status, payment_level, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [item.name, item.merchant_name, item.payment_method, item.device_type, item.random_group, item.fee_rate, item.status, item.payment_level, item.sort_order]
          );
        }
        return successResponse(null, `成功插入${sampleData.length}条示例数据`);

      } else {
        return errorResponse('参数错误', 400);
      }

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
      await ensurePaymentChannelTable();
      await dbQuery(
        `INSERT INTO payment_channels (name, merchant_name, payment_method, device_type, random_group, fee_rate, status, payment_level, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.merchant_name || '',
          data.payment_method,
          data.device_type || '',
          data.random_group || '',
          data.fee_rate || 0,
          data.status !== undefined ? data.status : 1,
          data.payment_level || '',
          data.sort_order || 0
        ]
      );
      return successResponse(null, '支付渠道创建成功');

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
      await ensurePaymentChannelTable();
      await dbQuery(`DELETE FROM payment_channels WHERE id IN (${placeholders})`, ids);
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