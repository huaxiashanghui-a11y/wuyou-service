import { NextResponse } from 'next/server';
import { getFeatureFlags } from '@/lib/feature-flags';

export async function GET() {
  const flags = getFeatureFlags();
  return NextResponse.json({
    success: true,
    data: {
      otpLogin: flags.otpLogin,
      googleLogin: flags.googleLogin,
      telegramLogin: flags.telegramLogin,
    },
  });
}
