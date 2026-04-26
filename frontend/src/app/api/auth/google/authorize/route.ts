import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { isFeatureEnabled } from '@/lib/feature-flags';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://www.wysz88.com/api/auth/google/callback';

export async function GET(request: NextRequest) {
  try {
    if (!isFeatureEnabled('googleLogin')) {
      return NextResponse.json(
        { success: false, message: 'Google登录功能暂未开放' },
        { status: 403 }
      );
    }

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, message: 'Google OAuth未配置' },
        { status: 500 }
      );
    }

    // 生成state参数（防CSRF）
    const state = crypto.randomBytes(32).toString('hex');
    const redirectParam = request.nextUrl.searchParams.get('redirect') || '/';

    // 构建Google OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
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
      { success: false, message: '生成授权链接失败' },
      { status: 500 }
    );
  }
}
