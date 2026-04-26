import { NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initTables();

    // 获取users表结构
    const usersColumns = await dbQuery<any[]>(
      'SHOW COLUMNS FROM `users`'
    );

    // 获取所有表
    const tables = await dbQuery<any[]>(
      'SHOW TABLES'
    );

    // 检查user_identities表结构
    let identitiesColumns: any[] = [];
    try {
      identitiesColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `user_identities`'
      );
    } catch { /* 表可能不存在 */ }

    // 检查otp_codes表结构
    let otpColumns: any[] = [];
    try {
      otpColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `otp_codes`'
      );
    } catch { /* 表可能不存在 */ }

    // 检查telegram_request_tokens表结构
    let tgTokenColumns: any[] = [];
    try {
      tgTokenColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `telegram_request_tokens`'
      );
    } catch { /* 表可能不存在 */ }

    // 用户数
    const userCount = await dbQuery<any[]>(
      'SELECT COUNT(*) AS cnt FROM `users`'
    );

    // 环境变量检查（只显示是否设置，不显示值）
    const envCheck = {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: !!process.env.GOOGLE_REDIRECT_URI,
      TELEGRAM_BOT_USERNAME: !!process.env.TELEGRAM_BOT_USERNAME,
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      SMS_API_KEY: !!process.env.SMS_API_KEY,
      SMS_FROM: !!process.env.SMS_FROM,
      EMAIL_PROVIDER: !!process.env.EMAIL_PROVIDER,
      EMAIL_API_KEY: !!process.env.EMAIL_API_KEY,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
      OTP_SECRET: !!process.env.OTP_SECRET,
      MYSQL_HOST: !!process.env.MYSQL_HOST,
      MYSQL_DATABASE: !!process.env.MYSQL_DATABASE,
    };

    return NextResponse.json({
      success: true,
      data: {
        tables: tables.map((t: any) => Object.values(t)[0]),
        usersColumnNames: usersColumns.map((c: any) => c.Field),
        usersColumnDetails: usersColumns,
        identitiesColumnNames: identitiesColumns.map((c: any) => c.Field),
        otpColumnNames: otpColumns.map((c: any) => c.Field),
        tgTokenColumnNames: tgTokenColumns.map((c: any) => c.Field),
        userCount: userCount[0]?.cnt || 0,
        envCheck,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Debug error: ' + error.message,
    }, { status: 500 });
  }
}
