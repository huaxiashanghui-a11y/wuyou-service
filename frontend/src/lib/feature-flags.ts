// Feature Flag 工具
// 读取环境变量控制功能开关

export interface FeatureFlags {
  otpLogin: boolean;
  googleLogin: boolean;
  telegramLogin: boolean;
}

// 读取 Feature Flag（使用缓存避免每次请求都读取环境变量）
let cachedFlags: FeatureFlags | null = null;

export function getFeatureFlags(): FeatureFlags {
  if (!cachedFlags) {
    cachedFlags = {
      otpLogin: process.env.FEATURE_OTP_LOGIN !== 'false',      // 默认开启
      googleLogin: process.env.FEATURE_GOOGLE_LOGIN !== 'false', // 默认开启
      telegramLogin: process.env.FEATURE_TG_OTP_LOGIN !== 'false', // 默认开启
    };
  }
  return cachedFlags;
}

// 重置缓存（用于测试或配置变更时）
export function resetFeatureFlags(): void {
  cachedFlags = null;
}

// 检查单个 Feature Flag
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature] === true;
}
