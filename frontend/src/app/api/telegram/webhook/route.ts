import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, TelegramRequestToken } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Webhook URL: https://www.wysz88.com/api/telegram/webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求来自Telegram（可选：校验IP或token）
    // Telegram webhook格式: { update_id, message: { text, chat: { id }, ... } }

    const message = body.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    // 处理 /start <request_token>
    if (text.startsWith('/start ')) {
      await initTables();

      const requestToken = text.substring(7).trim(); // 去掉 '/start '

      // 查找request_token
      const tokens = await dbQuery<TelegramRequestToken[]>(
        'SELECT * FROM telegram_request_tokens WHERE request_token = ? AND status = ? AND expires_at > NOW()',
        [requestToken, 'pending']
      );

      if (tokens.length === 0) {
        // Token无效或已过期
        await sendTelegramMessage(chatId, '链接已过期或无效，请返回网站重新生成。');
        return NextResponse.json({ ok: true });
      }

      // 检查是否已绑定其他telegram用户
      const existingBinding = await dbQuery<TelegramRequestToken[]>(
        'SELECT * FROM telegram_request_tokens WHERE telegram_user_id = ? AND status = ?',
        [chatId, 'linked']
      );

      // 更新request_token：绑定telegram用户
      await dbQuery(
        'UPDATE telegram_request_tokens SET telegram_user_id = ?, status = ? WHERE id = ?',
        [chatId, 'linked', tokens[0].id]
      );

      // 如果之前已有绑定，复用user_id
      if (existingBinding.length > 0 && existingBinding[0].user_id) {
        await dbQuery(
          'UPDATE telegram_request_tokens SET user_id = ? WHERE id = ?',
          [existingBinding[0].user_id, tokens[0].id]
        );
      }

      // 回复用户
      await sendTelegramMessage(
        chatId,
        '已绑定成功！请返回网站发送验证码完成登录。\n\n您的验证token: ' + requestToken.substring(0, 8) + '...'
      );
    } else if (text === '/start') {
      // 普通start命令
      await sendTelegramMessage(
        chatId,
        '欢迎使用无忧服务Bot！\n\n请从网站获取登录链接以完成绑定。'
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

// 发送Telegram消息
async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN not configured');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}
