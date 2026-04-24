import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { dbQuery } from '@/lib/db';
import { User, Order, RechargeRecord, WalletTransaction, Referral } from '@/lib/db';

// 获取用户信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'profile';

    const payload = await verifySession(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    switch (action) {
      case 'profile': {
        // 内置管理员（userId=0）不需要查询数据库
        if (payload.userId === 0) {
          return NextResponse.json({
            success: true,
            data: {
              id: 0,
              username: 'wysz88',
              nickname: '超级管理员',
              email: '',
              phone: '',
              avatar: '',
              balance: 0,
              points: 0,
              member_level: 0,
              real_name: '',
              id_card: '',
              is_merchant: false,
              is_admin: true,
              created_at: new Date().toISOString(),
            }
          });
        }
        
        const users = await dbQuery<User[]>(
          'SELECT id, username, nickname, email, phone, avatar, balance, points, member_level, real_name, id_card, is_merchant, created_at FROM users WHERE id = ?',
          [payload.userId]
        );

        if (users.length === 0) {
          return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: users[0] });
      }

      case 'wallet': {
        const recharges = await dbQuery<RechargeRecord[]>(
          'SELECT * FROM recharge_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
          [payload.userId]
        );

        const transactions = await dbQuery<WalletTransaction[]>(
          'SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
          [payload.userId]
        );

        const users = await dbQuery<any[]>(
          'SELECT balance FROM users WHERE id = ?',
          [payload.userId]
        );

        return NextResponse.json({
          success: true,
          data: {
            balance: users[0]?.balance || 0,
            recharges,
            transactions,
          },
        });
      }

      case 'orders': {
        const orders = await dbQuery<Order[]>(
          'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
          [payload.userId]
        );

        return NextResponse.json({ success: true, data: orders });
      }

      case 'coupons': {
        const coupons = await dbQuery<any[]>(
          'SELECT * FROM coupons WHERE user_id = ? ORDER BY created_at DESC',
          [payload.userId]
        );

        return NextResponse.json({ success: true, data: coupons });
      }

      case 'promotion': {
        const referrals = await dbQuery<Referral[]>(
          'SELECT * FROM referrals WHERE user_id = ?',
          [payload.userId]
        );

        const referral = referrals[0] || {
          invite_code: 'WY' + payload.userId.toString().padStart(6, '0'),
          invite_count: 0,
          commission: 0,
          withdrawn: 0,
        };

        return NextResponse.json({
          success: true,
          data: {
            ...referral,
            pending: referral.commission - referral.withdrawn,
          },
        });
      }

      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 修改用户信息 / 钱包充值
export async function PUT(request: NextRequest) {
  try {
    const payload = await verifySession(request);

    if (!payload) {
      return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'updateProfile': {
        const { nickname, email, phone, avatar, real_name, id_card } = data;

        await dbQuery(
          'UPDATE users SET nickname = ?, email = ?, phone = ?, avatar = ?, real_name = ?, id_card = ? WHERE id = ?',
          [nickname, email, phone, avatar, real_name, id_card, payload.userId]
        );

        await dbQuery(
          'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
          [payload.userId, '修改资料', request.headers.get('x-forwarded-for') || '127.0.0.1']
        );

        const users = await dbQuery<User[]>(
          'SELECT id, username, nickname, email, phone, avatar, balance, points, member_level, real_name, id_card FROM users WHERE id = ?',
          [payload.userId]
        );

        return NextResponse.json({ success: true, message: '修改成功', data: users[0] });
      }

      case 'recharge': {
        const { amount, paymentMethod } = data;

        if (!amount || amount <= 0) {
          return NextResponse.json({ success: false, message: '请输入正确的充值金额' }, { status: 400 });
        }

        const orderNo = 'RC' + Date.now() + Math.random().toString(36).substring(2, 8);

        await dbQuery(
          'INSERT INTO recharge_records (user_id, amount, payment_method, order_no, status) VALUES (?, ?, ?, ?, ?)',
          [payload.userId, amount, paymentMethod || '微信支付', orderNo, 'pending']
        );

        return NextResponse.json({
          success: true,
          message: '充值订单已创建',
          data: { orderNo, amount, paymentMethod },
        });
      }

      case 'confirmRecharge': {
        const { orderNo, paymentProof } = data;

        await dbQuery(
          'UPDATE recharge_records SET payment_proof = ?, status = ? WHERE order_no = ? AND user_id = ?',
          [paymentProof, 'submitted', orderNo, payload.userId]
        );

        return NextResponse.json({ success: true, message: '充值凭证已提交，等待审核' });
      }

      case 'updatePassword': {
        return NextResponse.json({ success: false, message: '功能开发中' }, { status: 501 });
      }

      default:
        return NextResponse.json({ success: false, message: '未知操作' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
