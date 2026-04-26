import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery, initTables } from '@/lib/db';
import { generateToken, createSession } from '@/lib/auth';
import { User, Referral } from '@/lib/db';

// 初始化数据库表（仅在配置正确时）
const mysqlPassword = process.env.MYSQL_PASSWORD;
if (mysqlPassword) {
  initTables().catch(console.error);
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, nickname, email, phone, inviteCode } = await request.json();

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUsers = await dbQuery<User[]>(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const result = await dbQuery<any>(
      'INSERT INTO `users` (`username`, `password`, `nickname`, `email`, `phone`) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, nickname || username, email || null, phone || null]
    );

    const userId = result.insertId;

    // 记录用户身份绑定
    if (email) {
      await dbQuery(
        'INSERT IGNORE INTO user_identities (user_id, provider, identifier) VALUES (?, ?, ?)',
        [userId, 'email', email]
      );
    }
    if (phone) {
      await dbQuery(
        'INSERT IGNORE INTO user_identities (user_id, provider, identifier) VALUES (?, ?, ?)',
        [userId, 'phone', phone]
      );
    }

    // 创建推广信息
    const newInviteCode = 'WY' + userId.toString().padStart(6, '0');
    await dbQuery(
      'INSERT INTO referrals (user_id, invite_code) VALUES (?, ?)',
      [userId, newInviteCode]
    );

    // 处理邀请码
    if (inviteCode) {
      const referrals = await dbQuery<Referral[]>(
        'SELECT * FROM referrals WHERE invite_code = ?',
        [inviteCode]
      );

      if (referrals.length > 0) {
        // 更新邀请者统计
        await dbQuery(
          'UPDATE referrals SET invite_count = invite_count + 1 WHERE invite_code = ?',
          [inviteCode]
        );
      }
    }

    // 生成Token
    const token = generateToken({ userId, username });

    // 创建会话
    await createSession(
      userId,
      token,
      request.headers.get('x-forwarded-for') || '127.0.0.1',
      request.headers.get('user-agent') || 'Unknown'
    );

    // 记录安全日志
    await dbQuery(
      'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
      [userId, '注册', request.headers.get('x-forwarded-for') || '127.0.0.1']
    );

    // 获取用户信息
    const users = await dbQuery<User[]>(
      'SELECT id, username, nickname, email, phone, avatar, balance, points, member_level, real_name, created_at FROM users WHERE id = ?',
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: users[0],
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: '注册失败: ' + error.message },
      { status: 500 }
    );
  }
}
