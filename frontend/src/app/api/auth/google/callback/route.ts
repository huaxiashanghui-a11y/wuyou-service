import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, initTables, UserIdentity } from '@/lib/db';
import { generateToken, createSession } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/feature-flags';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://www.wysz88.com/api/auth/google/callback';

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('googleLogin')) {
      return NextResponse.redirect(new URL('/login?error=google_disabled', request.url));
    }

    await initTables();

    const { searchParams } = request.nextUrl;
    const code = searchParams.get('code');
    const stateParam = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // 解析state获取redirect
    let redirect = '/';
    try {
      if (stateParam) {
        const stateData = JSON.parse(stateParam);
        redirect = stateData.redirect || '/';
      }
    } catch {
      // 忽略state解析错误
    }

    // 用code换token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.id_token) {
      console.error('Google token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/login?error=google_token', request.url));
    }

    // 验证id_token并提取用户信息
    // 使用Google tokeninfo端点验证
    const verifyResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenData.id_token}`
    );
    const userInfo = await verifyResponse.json();

    if (!userInfo.sub) {
      console.error('Google token info invalid:', userInfo);
      return NextResponse.redirect(new URL('/login?error=google_verify', request.url));
    }

    const googleSub = userInfo.sub;       // Google唯一标识
    const googleEmail = userInfo.email || '';
    const googleName = userInfo.name || '';

    // 查找是否已有绑定
    const existingIdentities = await dbQuery<UserIdentity[]>(
      "SELECT * FROM user_identities WHERE provider = 'google' AND identifier = ?",
      [googleSub]
    );

    let userId: number;
    let username: string;
    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    if (existingIdentities.length > 0) {
      // 已有绑定，直接登录
      userId = existingIdentities[0].user_id;

      // 获取用户信息
      const users = await dbQuery<any[]>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      if (users.length === 0) {
        return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
      }
      username = users[0].username;
    } else {
      // 新用户：自动注册
      // 检查是否有相同email的用户
      let existingUser: any = null;
      if (googleEmail) {
        const emailUsers = await dbQuery<any[]>(
          'SELECT * FROM users WHERE email = ?',
          [googleEmail]
        );
        if (emailUsers.length > 0) {
          existingUser = emailUsers[0];
        }
      }

      if (existingUser) {
        // 现有用户绑定Google
        userId = existingUser.id;
        username = existingUser.username;
      } else {
        // 创建新用户
        const safeUsername = googleEmail
          ? googleEmail.split('@')[0].replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '') + '_' + Date.now().toString(36)
          : 'google_' + Date.now().toString(36);

        const result = await dbQuery<any>(
          'INSERT INTO users (username, password, nickname, email, status) VALUES (?, ?, ?, ?, 1)',
          [safeUsername, '', googleName || safeUsername, googleEmail || null]
        );
        userId = result.insertId;
        username = safeUsername;

        // 创建推广信息
        const newInviteCode = 'WY' + userId.toString().padStart(6, '0');
        await dbQuery(
          'INSERT INTO referrals (user_id, invite_code) VALUES (?, ?)',
          [userId, newInviteCode]
        );
      }

      // 绑定Google身份
      await dbQuery(
        'INSERT IGNORE INTO user_identities (user_id, provider, identifier) VALUES (?, ?, ?)',
        [userId, 'google', googleSub]
      );
    }

    // 生成JWT Token
    const token = generateToken({ userId, username });

    // 创建会话
    await createSession(userId, token, ipAddress, userAgent);

    // 记录安全日志
    await dbQuery(
      'INSERT INTO security_logs (user_id, action, ip_address, device) VALUES (?, ?, ?, ?)',
      [userId, 'Google登录', ipAddress, userAgent]
    );

    // 重定向到前端页面，带上token
    const redirectUrl = new URL(redirect, request.url);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('userId', String(userId));
    redirectUrl.searchParams.set('username', encodeURIComponent(username));

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(new URL('/login?error=google_error', request.nextUrl.origin));
  }
}
