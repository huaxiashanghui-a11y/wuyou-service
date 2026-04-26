// Feature Flag 工具
// 仅检查功能开关，不检查具体API密钥（API密钥检查由各API路由负责并返回具体错误信息）

export interface FeatureFlags {
  otpLogin: boolean;
  googleLogin: boolean;
  telegramLogin: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    // 默认开启；设为 'false' 才关闭
    otpLogin: process.env.FEATURE_OTP_LOGIN !== 'false',
    googleLogin: process.env.FEATURE_GOOGLE_LOGIN !== 'false',
    telegramLogin: process.env.FEATURE_TG_OTP_LOGIN !== 'false',
  };
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature] === true;
}
