import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, UserIdentity, TelegramRequestToken } from '@/lib/db';
import { verifySubmittedOtp } from '@/lib/otp';
import { normalizePhoneNumber } from '@/lib/sms';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { generateToken, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled('otpLogin')) {
      return NextResponse.json(
        { success: false, message: '验证码登录功能暂未开放' },
        { status: 403 }
      );
    }

    await initTables();

    const { channel, destination, code } = await request.json();

    if (!channel || !destination || !code) {
      return NextResponse.json(
        { success: false, message: '请提供channel、destination和code' },
        { status: 400 }
      );
    }

    if (!['sms', 'email', 'telegram'].includes(channel)) {
      return NextResponse.json(
        { success: false, message: '无效的验证渠道' },
        { status: 400 }
      );
    }

    // 验证码格式：6位数字
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: '验证码格式不正确' },
        { status: 400 }
      );
    }

    // 格式化destination
    let normalizedDestination = destination;
    let provider: string = channel;
    let identifier: string = destination;

    if (channel === 'sms') {
      normalizedDestination = normalizePhoneNumber(destination);
      identifier = normalizedDestination;
      provider = 'phone';
    }

    // 校验OTP
    const otpResult = await verifySubmittedOtp(normalizedDestination, channel, code);

    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, message: otpResult.message },
        { status: 400 }
      );
    }

    // OTP验证成功，处理登录/注册
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    let userId: number;
    let username: string;
    let isNewUser = false;

    // 查找是否有user_identities绑定
    const existingIdentity = await dbQuery<UserIdentity[]>(
      'SELECT * FROM user_identities WHERE provider = ? AND identifier = ?',
      [provider, identifier]
    );

    if (existingIdentity.length > 0) {
      // 已有绑定，直接登录
      userId = existingIdentity[0].user_id;
      const users = await dbQuery<any[]>(
        'SELECT username FROM users WHERE id = ? AND status = 1',
        [userId]
      );
      if (users.length === 0) {
        return NextResponse.json(
          { success: false, message: '用户不存在或已被禁用' },
          { status: 404 }
        );
      }
      username = users[0].username;
    } else {
      // 新用户注册
      isNewUser = true;
      let safeUsername = '';

      if (channel === 'email') {
        safeUsername = identifier.split('@')[0].replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '') + '_' + Date.now().toString(36);
      } else if (channel === 'sms') {
        safeUsername = 'phone_' + Date.now().toString(36);
      } else {
        // Telegram: 查找request_token获取telegram信息
        const tokens = await dbQuery<TelegramRequestToken[]>(
          'SELECT * FROM telegram_request_tokens WHERE request_token = ?',
          [destination]
        );
        const tgId = tokens.length > 0 && tokens[0].telegram_user_id ? tokens[0].telegram_user_id : Date.now();
        safeUsername = 'tg_' + tgId;
        provider = 'telegram';
        identifier = String(tokens.length > 0 && tokens[0].telegram_user_id ? tokens[0].telegram_user_id : Date.now());
      }

      const insertResult = await dbQuery<any>(
        'INSERT INTO `users` (`username`, `password`, `nickname`, `status`) VALUES (?, ?, ?, 1)',
        [
          safeUsername,
          '',
          channel === 'email' ? identifier.split('@')[0] : '用户' + safeUsername.substring(0, 4),
        ]
      );
      userId = insertResult.insertId;
      username = safeUsername;

      // 创建推广信息
      const newInviteCode = 'WY' + userId.toString().padStart(6, '0');
      await dbQuery(
        'INSERT INTO referrals (user_id, invite_code) VALUES (?, ?)',
        [userId, newInviteCode]
      );

      // 如果channel是telegram，更新telegram_request_tokens的user_id
      if (channel === 'telegram') {
        await dbQuery(
          'UPDATE telegram_request_tokens SET user_id = ?, status = ? WHERE request_token = ?',
          [userId, 'used', destination]
        );
      }

      // 更新users表的email/phone字段
      if (channel === 'email') {
        await dbQuery('UPDATE users SET email = ? WHERE id = ?', [identifier, userId]);
      } else if (channel === 'sms') {
        await dbQuery('UPDATE users SET phone = ? WHERE id = ?', [identifier, userId]);
      }
    }

    // 绑定身份（如果尚未绑定）
    await dbQuery(
      'INSERT IGNORE INTO user_identities (user_id, provider, identifier) VALUES (?, ?, ?)',
      [userId, provider, identifier]
    );

    // 生成Token
    const token = generateToken({ userId, username });

    // 创建会话
    await createSession(userId, token, ipAddress, userAgent);

    // 记录安全日志
    await dbQuery(
      'INSERT INTO security_logs (user_id, action, ip_address, device) VALUES (?, ?, ?, ?)',
      [userId, `OTP登录(${channel})`, ipAddress, userAgent]
    );

    // 获取用户信息
    const users = await dbQuery<any[]>(
      'SELECT id, username, nickname, email, phone, avatar, balance, points, member_level, real_name, is_merchant, created_at FROM users WHERE id = ?',
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: users[0],
        isNewUser,
      },
    });
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { success: false, message: '验证失败: ' + error.message },
      { status: 500 }
    );
  }
}
