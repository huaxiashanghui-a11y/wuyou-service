import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery, initTables } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { User } from '@/lib/db';

// 内置超级管理员账号：账号wysz88，密码wysz8888
const ADMIN_USERNAME = 'wysz88';
const ADMIN_PASSWORD = 'wysz8888';

// 初始化内置管理员密码（静态加密）
let adminPasswordHash: string | null = null;

async function getAdminPasswordHash(): Promise<string> {
  if (!adminPasswordHash) {
    adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  }
  return adminPasswordHash;
}

export async function POST(request: NextRequest) {
  try {
    // 确保数据库表已初始化
    await initTables();
    
    const { username, password } = await request.json();

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 检查是否为内置超级管理员
    if (username === ADMIN_USERNAME) {
      const hash = await getAdminPasswordHash();
      const isValid = await bcrypt.compare(password, hash);

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: '用户名或密码错误' },
          { status: 401 }
        );
      }

      // 内置管理员登录成功，生成 Token
      // 注意：内置管理员不写入 user_sessions 表，因为它是内存中的内置账号
      const token = generateToken({ userId: 0, username: ADMIN_USERNAME });
      
      const adminUser = {
        id: 0,
        username: ADMIN_USERNAME,
        nickname: '超级管理员',
        is_admin: true,
      };

      return NextResponse.json({
        success: true,
        message: '登录成功',
        data: {
          token,
          user: adminUser,
        },
      });
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
    const isValid = await bcrypt.compare(password, user.password_hash);
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
    await dbQuery(
      'INSERT INTO user_sessions (user_id, token, ip_address, device, expires_at) VALUES (?, ?, ?, ?, ?)',
      [
        user.id,
        token,
        request.headers.get('x-forwarded-for') || '127.0.0.1',
        request.headers.get('user-agent') || 'Unknown',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后过期
      ]
    );

    // 记录安全日志
    await dbQuery(
      'INSERT INTO security_logs (user_id, action, ip_address) VALUES (?, ?, ?)',
      [user.id, '登录', request.headers.get('x-forwarded-for') || '127.0.0.1']
    );

    // 返回用户信息（不包含密码）
    const { password_hash: _, ...userInfo } = user;

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
