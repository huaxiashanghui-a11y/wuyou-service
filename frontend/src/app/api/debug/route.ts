import { NextResponse } from 'next/server';
import { dbQuery, initTables } from '@/lib/db';
import { getFeatureFlags } from '@/lib/feature-flags';

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

    // 检查orders表结构
    let ordersColumns: any[] = [];
    try {
      ordersColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `orders`'
      );
    } catch { /* 表可能不存在 */ }

    // 检查order_items表结构
    let orderItemsColumns: any[] = [];
    try {
      orderItemsColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `order_items`'
      );
    } catch { /* 表可能不存在 */ }

    // 检查 payment_methods 表
    let pmColumns: any[] = [];
    let pmCount = 0;
    try {
      pmColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `payment_methods`'
      );
      const pmCountResult = await dbQuery<any[]>(
        'SELECT COUNT(*) AS cnt FROM `payment_methods`'
      );
      pmCount = pmCountResult[0]?.cnt || 0;
    } catch { /* 表可能不存在 */ }

    // 检查 payment_transactions 表
    let ptColumns: any[] = [];
    try {
      ptColumns = await dbQuery<any[]>(
        'SHOW COLUMNS FROM `payment_transactions`'
      );
    } catch { /* 表可能不存在 */ }

    // 用户数
    const userCount = await dbQuery<any[]>(
      'SELECT COUNT(*) AS cnt FROM `users`'
    );

    // 检查users表中关键列是否存在
    const columnNames = usersColumns.map((c: any) => c.Field);
    const hasPasswordHash = columnNames.includes('password_hash');
    const hasOldPassword = columnNames.includes('password');

    // 环境变量检查（只显示是否设置，不显示值）
    const envKeys = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GOOGLE_REDIRECT_URI',
      'TELEGRAM_BOT_USERNAME',
      'TELEGRAM_BOT_TOKEN',
      'SMS_API_KEY',
      'SMS_FROM',
      'EMAIL_PROVIDER',
      'EMAIL_API_KEY',
      'EMAIL_FROM',
      'OTP_SECRET',
      'MYSQL_HOST',
      'MYSQL_DATABASE',
      'MYSQL_PASSWORD',
      'JWT_SECRET',
      'VERCEL_ENV',
      'NODE_ENV',
      'FEATURE_OTP_LOGIN',
      'FEATURE_GOOGLE_LOGIN',
      'FEATURE_TG_OTP_LOGIN',
    ];

    const envCheck: Record<string, boolean | string> = {};
    for (const key of envKeys) {
      const val = process.env[key];
      if (val === undefined || val === null || val === '') {
        envCheck[key] = false;
      } else if (key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD') || key.includes('TOKEN')) {
        // 敏感信息只显示是否设置和长度
        envCheck[key] = `set (length=${val.length})`;
      } else {
        envCheck[key] = val;
      }
    }

    // Feature flags 实际值
    const featureFlags = getFeatureFlags();

    return NextResponse.json({
      success: true,
      data: {
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
        tables: tables.map((t: any) => Object.values(t)[0]),
        usersColumnNames: columnNames,
        usersColumnDetails: usersColumns,
        hasPasswordHash,
        hasOldPassword,
        identitiesColumnNames: identitiesColumns.map((c: any) => c.Field),
        otpColumnNames: otpColumns.map((c: any) => c.Field),
        tgTokenColumnNames: tgTokenColumns.map((c: any) => c.Field),
        ordersColumnNames: ordersColumns.map((c: any) => c.Field),
        orderItemsColumnNames: orderItemsColumns.map((c: any) => c.Field),
        paymentMethodsColumnNames: pmColumns.map((c: any) => c.Field),
        paymentMethodsCount: pmCount,
        paymentTransactionsColumnNames: ptColumns.map((c: any) => c.Field),
        userCount: userCount[0]?.cnt || 0,
        envCheck,
        featureFlags,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Debug error: ' + error.message,
    }, { status: 500 });
  }
}
