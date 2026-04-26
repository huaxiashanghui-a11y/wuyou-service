import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, TelegramRequestToken } from '@/lib/db';
import { generateOtp, storeOtp, checkRateLimit } from '@/lib/otp';
import { sendSms, normalizePhoneNumber } from '@/lib/sms';
import { sendEmail } from '@/lib/email';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { generateToken, createSession } from '@/lib/auth';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled('otpLogin')) {
      return NextResponse.json(
        { success: false, message: '验证码登录功能暂未开放' },
        { status: 403 }
      );
    }

    await initTables();

    const { channel, destination } = await request.json();

    if (!channel || !destination) {
      return NextResponse.json(
        { success: false, message: '请提供channel和destination' },
        { status: 400 }
      );
    }

    // 验证channel有效性
    if (!['sms', 'email', 'telegram'].includes(channel)) {
      return NextResponse.json(
        { success: false, message: '无效的发送渠道' },
        { status: 400 }
      );
    }

    // 邮箱格式验证
    if (channel === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(destination)) {
        return NextResponse.json(
          { success: false, message: '邮箱格式不正确' },
          { status: 400 }
        );
      }
    }

    // 短信：格式化手机号
    let normalizedDestination = destination;
    if (channel === 'sms') {
      normalizedDestination = normalizePhoneNumber(destination);
    }

    // Telegram：验证request_token有效性和状态
    if (channel === 'telegram') {
      const tokens = await dbQuery<TelegramRequestToken[]>(
        'SELECT * FROM telegram_request_tokens WHERE request_token = ? AND status = ? AND telegram_user_id IS NOT NULL AND expires_at > NOW()',
        [destination, 'linked']
      );
      if (tokens.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Telegram未绑定或已过期，请先通过Bot完成绑定' },
          { status: 400 }
        );
      }
    }

    // 风控检查
    const rateCheck = await checkRateLimit(normalizedDestination, channel);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: rateCheck.reason },
        { status: 429 }
      );
    }

    // 生成OTP
    const otp = generateOtp();

    // 存储OTP
    await storeOtp(normalizedDestination, channel, otp);

    // 根据渠道发送
    let sendResult: { success: boolean; message: string };

    switch (channel) {
      case 'sms':
        sendResult = await sendSms(normalizedDestination, otp);
        break;
      case 'email':
        sendResult = await sendEmail(normalizedDestination, otp);
        break;
      case 'telegram':
        sendResult = await sendTelegramOtp(normalizedDestination, otp);
        break;
      default:
        sendResult = { success: false, message: '未知发送渠道' };
    }

    if (!sendResult.success) {
      return NextResponse.json(
        { success: false, message: sendResult.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '验证码已发送',
      data: {
        channel,
        destination: channel === 'sms' ? maskedPhone(normalizedDestination) : (channel === 'email' ? maskedEmail(normalizedDestination) : 'Telegram'),
      },
    });
  } catch (error: any) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { success: false, message: '发送失败: ' + error.message },
      { status: 500 }
    );
  }
}

// 发送Telegram OTP
async function sendTelegramOtp(requestToken: string, otp: string): Promise<{ success: boolean; message: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    return { success: false, message: 'Telegram Bot未配置' };
  }

  const tokens = await dbQuery<TelegramRequestToken[]>(
    'SELECT * FROM telegram_request_tokens WHERE request_token = ? AND telegram_user_id IS NOT NULL',
    [requestToken]
  );

  if (tokens.length === 0) {
    return { success: false, message: 'Telegram未绑定' };
  }

  const chatId = tokens[0].telegram_user_id;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `您的验证码是: ${otp}\n\n5分钟内有效，请勿泄露给他人。【无忧服务】`,
      }),
    });
    return { success: true, message: '验证码已发送到Telegram' };
  } catch (error: any) {
    console.error('Telegram OTP send error:', error);
    return { success: false, message: 'Telegram消息发送失败' };
  }
}

function maskedPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return phone.substring(0, 2) + '****' + phone.substring(phone.length - 3);
}

function maskedEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return name + '***@' + domain;
  return name.substring(0, 2) + '***@' + domain;
}
