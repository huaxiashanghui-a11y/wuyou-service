import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbQuery, initTables, TelegramRequestToken } from '@/lib/db';
import { isFeatureEnabled } from '@/lib/feature-flags';

const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || '';

export async function POST(request: NextRequest) {
  try {
    if (!isFeatureEnabled('telegramLogin')) {
      return NextResponse.json(
        { success: false, message: 'Telegram登录功能暂未开放' },
        { status: 403 }
      );
    }

    if (!TELEGRAM_BOT_USERNAME) {
      return NextResponse.json(
        { success: false, message: 'Telegram Bot未配置' },
        { status: 500 }
      );
    }

    await initTables();

    // 生成一次性request_token（64位随机hex）
    const requestToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟过期

    // 存储request_token
    await dbQuery(
      'INSERT INTO telegram_request_tokens (request_token, status, expires_at) VALUES (?, ?, ?)',
      [requestToken, 'pending', expiresAt]
    );

    // 构建bot链接
    const botStartUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${requestToken}`;

    return NextResponse.json({
      success: true,
      data: {
        requestToken,
        botStartUrl,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Telegram init error:', error);
    return NextResponse.json(
      { success: false, message: 'Telegram初始化失败: ' + error.message },
      { status: 500 }
    );
  }
}
