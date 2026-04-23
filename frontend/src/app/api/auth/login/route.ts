import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery } from '@/lib/db';
import { generateToken, createSession } from '@/lib/auth';
import { User } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找用户
    const users = await dbQuery<User[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 检查用户状态
    if (user.status !== 1) {
      return NextResponse.json(
        { success: false, message: '账号已被禁用' },
        { status: 403 }
      );
    }

    // 生成Token
    const token = generateToken({ userId: user.id, username: user.username });

    // 创建会话
    await createSession(
      user.id,
      token,
      request.headers.get('x-forwarded-for') || '127.0.0.1',
      request.headers.get('user-agent') || 'Unknown'
    );

    // 记录安全日志
    await dbQuery(
      'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
      [user.id, '登录', request.headers.get('x-forwarded-for') || '127.0.0.1']
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: userInfo,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: '登录失败: ' + error.message },
      { status: 500 }
    );
  }
}
