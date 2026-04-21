import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// 演示用户 ID（实际应从会话获取）
const DEMO_USER_ID = 1;

// 模拟数据（当数据库不可用时使用）
const mockUser = {
  id: DEMO_USER_ID,
  username: 'user',
  nickname: '用户',
  email: 'user@example.com',
  phone: '',
  avatar: null,
  balance: 1280.00,
  points: 580,
  member_level: 3,
};

const mockOrders = [
  { id: 1, order_no: 'ORD20240415001', total_amount: 299.00, status: 'completed', created_at: '2024-04-15 10:30:00' },
  { id: 2, order_no: 'ORD20240418001', total_amount: 158.00, status: 'pending', created_at: '2024-04-18 14:22:00' },
  { id: 3, order_no: 'ORD20240420001', total_amount: 520.00, status: 'shipped', created_at: '2024-04-20 09:15:00' },
];

const mockCoupons = [
  { id: 1, code: 'SAVE20', name: '新人专享券', amount: 20, min_amount: 100, status: 'unused', valid_to: '2024-12-31' },
  { id: 2, code: 'SAVE50', name: '满减券', amount: 50, min_amount: 200, status: 'unused', valid_to: '2024-06-30' },
  { id: 3, code: 'FREESHIP', name: '免运费券', amount: 0, min_amount: 50, status: 'used', valid_to: '2024-03-01' },
];

const mockPromotion = {
  invite_code: 'WY' + Date.now().toString().slice(-8),
  invite_count: 12,
  commission: 368.00,
  withdrawn: 200.00,
  pending: 168.00,
};

const mockSecurity = {
  two_factor_enabled: false,
  login_protection: true,
};

// 检查数据库是否可用
async function isDbAvailable(): Promise<boolean> {
  try {
    await query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'profile';

  try {
    // 检查数据库是否可用
    const dbAvailable = await isDbAvailable();

    if (!dbAvailable) {
      // 数据库不可用，返回模拟数据
      console.log('Database unavailable, returning mock data for action:', action);

      switch (action) {
        case 'profile':
          return NextResponse.json({ success: true, data: mockUser, source: 'mock' });
        case 'wallet':
          return NextResponse.json({
            success: true,
            data: {
              recharges: [],
              transactions: [
                { id: 1, type: 'recharge', amount: 500, balance_after: 1280, created_at: '2024-04-20' },
                { id: 2, type: 'spend', amount: -200, balance_after: 1280, created_at: '2024-04-18' },
              ],
            },
            source: 'mock'
          });
        case 'orders':
          return NextResponse.json({ success: true, data: mockOrders, source: 'mock' });
        case 'coupons':
          return NextResponse.json({ success: true, data: mockCoupons, source: 'mock' });
        case 'promotion':
          return NextResponse.json({ success: true, data: mockPromotion, source: 'mock' });
        case 'security':
          return NextResponse.json({ success: true, data: mockSecurity, source: 'mock' });
        default:
          return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
      }
    }

    // 数据库可用，查询真实数据
    switch (action) {
      case 'profile':
        // 获取用户信息
        const profileResult = await query(
          'SELECT id, username, nickname, email, phone, avatar, balance, points, member_level, real_name FROM users WHERE id = ?',
          [DEMO_USER_ID]
        );
        return NextResponse.json({
          success: true,
          data: (profileResult as any[])[0] || mockUser,
          source: 'db'
        });

      case 'wallet':
        // 获取钱包信息
        const rechargeResult = await query(
          'SELECT * FROM wallet_recharges WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
          [DEMO_USER_ID]
        );
        const transactionResult = await query(
          'SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
          [DEMO_USER_ID]
        );
        return NextResponse.json({
          success: true,
          data: {
            recharges: rechargeResult,
            transactions: transactionResult,
          }
        });

      case 'orders':
        // 获取订单列表
        const ordersResult = await query(
          'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
          [DEMO_USER_ID]
        );
        return NextResponse.json({
          success: true,
          data: ordersResult
        });

      case 'coupons':
        // 获取优惠券列表
        const couponsResult = await query(
          'SELECT * FROM coupons WHERE user_id = ? ORDER BY created_at DESC',
          [DEMO_USER_ID]
        );
        return NextResponse.json({
          success: true,
          data: couponsResult
        });

      case 'promotion':
        // 获取推广信息
        const promotionResult = await query(
          'SELECT * FROM promotions WHERE user_id = ?',
          [DEMO_USER_ID]
        );
        return NextResponse.json({
          success: true,
          data: (promotionResult as any[])[0] || {
            invite_code: 'WY' + Date.now(),
            invite_count: 0,
            commission: 0,
          }
        });

      case 'security':
        // 获取安全设置
        const securityResult = await query(
          'SELECT * FROM user_security WHERE user_id = ?',
          [DEMO_USER_ID]
        );
        return NextResponse.json({
          success: true,
          data: (securityResult as any[])[0] || {
            two_factor_enabled: false,
            login_protection: false,
          }
        });

      default:
        return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    // 检查数据库是否可用
    const dbAvailable = await isDbAvailable();

    if (!dbAvailable) {
      // 数据库不可用，对写操作返回错误
      console.log('Database unavailable, cannot process POST action:', action);
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    switch (action) {
      case 'updateProfile':
        // 更新用户信息
        await query(
          'UPDATE users SET nickname = ?, email = ?, phone = ?, real_name = ?, id_card = ?, updated_at = NOW() WHERE id = ?',
          [data.nickname, data.email, data.phone, data.realName, data.idCard, DEMO_USER_ID]
        );
        return NextResponse.json({ success: true, message: 'Profile updated' });

      case 'recharge':
        // 创建充值订单
        const orderNo = 'RC' + Date.now();
        await query(
          'INSERT INTO wallet_recharges (user_id, amount, payment_method, order_no) VALUES (?, ?, ?, ?)',
          [DEMO_USER_ID, data.amount, data.paymentMethod, orderNo]
        );
        return NextResponse.json({ success: true, orderNo });

      case 'confirmRecharge':
        // 确认充值（上传凭证后）
        await query(
          'UPDATE wallet_recharges SET payment_proof = ?, status = ? WHERE order_no = ?',
          [data.paymentProof, 'pending', data.orderNo]
        );
        return NextResponse.json({ success: true, message: 'Recharge submitted' });

      case 'updatePassword':
        // 更新密码
        const securityResult = await query(
          'SELECT * FROM user_security WHERE user_id = ?',
          [DEMO_USER_ID]
        );
        if ((securityResult as any[]).length === 0) {
          await query(
            'INSERT INTO user_security (user_id, login_password) VALUES (?, ?)',
            [DEMO_USER_ID, data.newPassword]
          );
        } else {
          await query(
            'UPDATE user_security SET login_password = ?, updated_at = NOW() WHERE user_id = ?',
            [data.newPassword, DEMO_USER_ID]
          );
        }
        // 记录安全日志
        await query(
          'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
          [DEMO_USER_ID, '修改密码', request.headers.get('x-forwarded-for') || '127.0.0.1']
        );
        return NextResponse.json({ success: true, message: 'Password updated' });

      case 'updateSecurity':
        // 更新安全设置
        await query(
          'UPDATE user_security SET two_factor_enabled = ?, login_protection = ?, updated_at = NOW() WHERE user_id = ?',
          [data.twoFactorEnabled ? 1 : 0, data.loginProtection ? 1 : 0, DEMO_USER_ID]
        );
        return NextResponse.json({ success: true, message: 'Security settings updated' });

      default:
        return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
