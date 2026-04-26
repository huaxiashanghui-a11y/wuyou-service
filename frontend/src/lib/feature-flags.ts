// Feature Flag 工具
// 读取环境变量控制功能开关，同时检查必需的环境变量是否存在

export interface FeatureFlags {
  otpLogin: boolean;
  googleLogin: boolean;
  telegramLogin: boolean;
}

// 每次请求都重新读取（确保Vercel serverless环境下总是获取最新env vars）
export function getFeatureFlags(): FeatureFlags {
  const otpLoginFlag = process.env.FEATURE_OTP_LOGIN !== 'false';
  const googleLoginFlag = process.env.FEATURE_GOOGLE_LOGIN !== 'false';
  const telegramLoginFlag = process.env.FEATURE_TG_OTP_LOGIN !== 'false';

  // 额外检查：Google登录还需要 GOOGLE_CLIENT_ID
  const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
  const googleLogin = googleLoginFlag && googleClientId.length > 0;

  // 额外检查：Telegram登录还需要 TELEGRAM_BOT_USERNAME 和 TELEGRAM_BOT_TOKEN
  const telegramBotUsername = process.env.TELEGRAM_BOT_USERNAME || '';
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const telegramLogin = telegramLoginFlag && telegramBotUsername.length > 0 && telegramBotToken.length > 0;

  // OTP登录需要 OTP_SECRET
  const otpSecret = process.env.OTP_SECRET || '';
  const otpLogin = otpLoginFlag && otpSecret.length > 0;

  return { otpLogin, googleLogin, telegramLogin };
}

// 检查单个 Feature Flag
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature] === true;
}
