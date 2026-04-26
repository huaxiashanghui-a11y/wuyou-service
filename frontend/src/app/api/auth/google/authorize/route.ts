import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { isFeatureEnabled } from '@/lib/feature-flags';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('googleLogin')) {
      return NextResponse.json(
        { success: false, message: 'Google登录功能暂未开放' },
        { status: 403 }
      );
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://www.wysz88.com/api/auth/google/callback';

    if (!googleClientId) {
      return NextResponse.json(
        { success: false, message: 'Google OAuth未配置（缺少GOOGLE_CLIENT_ID）' },
        { status: 500 }
      );
    }

    // 生成state参数（防CSRF）
    const state = crypto.randomBytes(32).toString('hex');
    const redirectParam = request.nextUrl.searchParams.get('redirect') || '/';

    // 构建Google OAuth URL
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: googleRedirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state: JSON.stringify({ csrf: state, redirect: redirectParam }),
      access_type: 'offline',
      prompt: 'consent',
    });

    const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.json({
      success: true,
      data: { authorizeUrl },
    });
  } catch (error: any) {
    console.error('Google authorize error:', error);
    return NextResponse.json(
      { success: false, message: '生成授权链接失败: ' + error.message },
      { status: 500 }
    );
  }
}
