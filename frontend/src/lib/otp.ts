import crypto from 'crypto';
import { dbQuery, OtpCode } from './db';

const OTP_SECRET = process.env.OTP_SECRET || 'wuyou-otp-secret-change-in-production';
const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 5;
const COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 10;
const DAILY_LIMIT = parseInt(process.env.OTP_DAILY_LIMIT || '10');

// HMAC-SHA256 哈希 OTP 码
export function hashOtp(code: string): string {
  return crypto.createHmac('sha256', OTP_SECRET).update(code).digest('hex');
}

// 生成6位随机数字OTP
export function generateOtp(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

// 验证OTP hash
export function verifyOtpHash(code: string, storedHash: string): boolean {
  const computedHash = hashOtp(code);
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedHash));
}

// 风控检查
export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

export async function checkRateLimit(destination: string, channel: string): Promise<RateLimitResult> {
  const now = new Date();

  // 1. 检查60秒冷却
  const recentCodes = await dbQuery<OtpCode[]>(
    'SELECT * FROM otp_codes WHERE destination = ? AND channel = ? AND last_sent_at > DATE_SUB(NOW(), INTERVAL ? SECOND) ORDER BY last_sent_at DESC',
    [destination, channel, COOLDOWN_SECONDS]
  );
  if (recentCodes.length > 0) {
    const elapsed = Math.floor((now.getTime() - new Date(recentCodes[0].last_sent_at).getTime()) / 1000);
    return { allowed: false, reason: `请等待 ${COOLDOWN_SECONDS - elapsed} 秒后重试` };
  }

  // 2. 检查每日上限
  const todayCount = await dbQuery<{ cnt: number }[]>(
    'SELECT COUNT(*) as cnt FROM otp_codes WHERE destination = ? AND channel = ? AND DATE(created_at) = CURDATE()',
    [destination, channel]
  );
  if (todayCount[0].cnt >= DAILY_LIMIT) {
    return { allowed: false, reason: '今日验证码发送次数已达上限，请明天再试' };
  }

  // 3. 检查是否被锁定（输错5次后锁10分钟）
  const activeLock = await dbQuery<OtpCode[]>(
    'SELECT * FROM otp_codes WHERE destination = ? AND channel = ? AND attempts >= ? AND last_sent_at > DATE_SUB(NOW(), INTERVAL ? MINUTE) AND verified = 0 ORDER BY last_sent_at DESC LIMIT 1',
    [destination, channel, MAX_ATTEMPTS, LOCK_MINUTES]
  );
  if (activeLock.length > 0) {
    const lockUntil = new Date(new Date(activeLock[0].last_sent_at).getTime() + LOCK_MINUTES * 60 * 1000);
    if (lockUntil > now) {
      return { allowed: false, reason: `验证码已锁定，请在 ${Math.ceil((lockUntil.getTime() - now.getTime()) / 60000)} 分钟后重试` };
    }
  }

  return { allowed: true };
}

// 存储OTP
export async function storeOtp(destination: string, channel: string, code: string): Promise<void> {
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // 废弃同destination同channel的旧验证码
  await dbQuery(
    "UPDATE otp_codes SET verified = -1 WHERE destination = ? AND channel = ? AND verified = 0 AND expires_at > NOW()",
    [destination, channel]
  );

  // 插入新验证码
  await dbQuery(
    'INSERT INTO otp_codes (destination, code_hash, channel, expires_at, last_sent_at) VALUES (?, ?, ?, ?, NOW())',
    [destination, codeHash, channel, expiresAt]
  );
}

// 校验OTP
export interface OtpVerifyResult {
  success: boolean;
  message?: string;
  otpRecord?: OtpCode;
}

export async function verifySubmittedOtp(destination: string, channel: string, code: string): Promise<OtpVerifyResult> {
  // 查找有效的OTP记录
  const records = await dbQuery<OtpCode[]>(
    'SELECT * FROM otp_codes WHERE destination = ? AND channel = ? AND verified = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [destination, channel]
  );

  if (records.length === 0) {
    return { success: false, message: '验证码不存在或已过期' };
  }

  const record = records[0];

  // 检查是否被锁定
  if (record.attempts >= MAX_ATTEMPTS) {
    const lockUntil = new Date(new Date(record.last_sent_at).getTime() + LOCK_MINUTES * 60 * 1000);
    if (lockUntil > new Date()) {
      return { success: false, message: '验证码已锁定，请稍后重试' };
    }
  }

  // 增加尝试次数
  await dbQuery(
    'UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?',
    [record.id]
  );

  // 验证hash
  if (!verifyOtpHash(code, record.code_hash)) {
    const newAttempts = record.attempts + 1;
    if (newAttempts >= MAX_ATTEMPTS) {
      return { success: false, message: '验证码错误次数过多，已锁定10分钟' };
    }
    return { success: false, message: `验证码错误（剩余 ${MAX_ATTEMPTS - newAttempts} 次机会）` };
  }

  // 标记为已验证
  await dbQuery(
    'UPDATE otp_codes SET verified = 1 WHERE id = ?',
    [record.id]
  );

  return { success: true, otpRecord: record };
}
