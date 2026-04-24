import { NextRequest, NextResponse } from 'next/server';
import { verifySession, deleteSession, getTokenFromRequest } from '@/lib/auth';
import { dbQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 验证会话
    const payload = await verifySession(request);

    if (payload) {
      // 删除会话
      const token = getTokenFromRequest(request);
      if (token) {
        await deleteSession(token);
      }

      // 记录安全日志（内置管理员不记录到数据库）
      if (payload.userId !== 0) {
        await dbQuery(
          'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
          [payload.userId, '退出登录', request.headers.get('x-forwarded-for') || '127.0.0.1']
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: '退出成功',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: '退出失败' },
      { status: 500 }
    );
  }
}
