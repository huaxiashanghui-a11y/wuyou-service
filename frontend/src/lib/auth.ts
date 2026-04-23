import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from './db';
import { dbQuery } from './db';
import { Session } from './db';
import { NextRequest } from 'next/server';

export interface TokenPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

// 生成Token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// 验证Token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// 从请求中获取Token
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// 验证Token并检查会话
export async function verifySession(request: NextRequest): Promise<TokenPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // 检查会话是否有效
  const sessions = await dbQuery<Session[]>(
    'SELECT * FROM user_sessions WHERE user_id = ? AND token = ? AND expires_at > NOW()',
    [payload.userId, token]
  );

  if (sessions.length === 0) return null;

  return payload;
}

// 创建会话
export async function createSession(
  userId: number,
  token: string,
  ipAddress: string | null = null,
  device: string | null = null
): Promise<void> {
  // 删除旧会话
  await dbQuery('DELETE FROM user_sessions WHERE user_id = ?', [userId]);

  // 计算过期时间
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // 创建新会话
  await dbQuery(
    'INSERT INTO user_sessions (user_id, token, ip_address, device, expires_at) VALUES (?, ?, ?, ?, ?)',
    [userId, token, ipAddress, device, expiresAt]
  );
}

// 删除会话
export async function deleteSession(token: string): Promise<void> {
  await dbQuery('DELETE FROM user_sessions WHERE token = ?', [token]);
}

// 删除用户所有会话
export async function deleteAllSessions(userId: number): Promise<void> {
  await dbQuery('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
}
