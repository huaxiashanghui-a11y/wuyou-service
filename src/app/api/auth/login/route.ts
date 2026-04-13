import { NextRequest, NextResponse } from 'next/server';

// 演示账号数据
const demoAdmins = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@wuyou.com',
    role: 'admin',
    permissions: ['products', 'cards', 'orders'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'superadmin',
    password: 'super123',
    email: 'super@wuyou.com',
    role: 'superadmin',
    permissions: ['all'],
    createdAt: new Date().toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '请输入用户名和密码' },
        { status: 400 }
      );
    }

    const admin = demoAdmins.find(
      a => a.username === username && a.password === password
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成 token
    const token = Buffer.from(`${admin.username}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        },
        expiresIn: 86400 // 24小时
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
