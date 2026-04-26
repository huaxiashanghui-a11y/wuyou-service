import mysql from 'mysql2/promise';

// 数据库配置
const dbConfig = {
  host: process.env.MYSQL_HOST || 'mysql6.sqlpub.com',
  port: parseInt(process.env.MYSQL_PORT || '3311'),
  user: process.env.MYSQL_USER || 'wuyou248699',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'wuyouservice',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// JWT密钥
export const JWT_SECRET = process.env.JWT_SECRET || 'wuyou-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';

// 创建连接池
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// 数据库查询
export async function dbQuery<T = any>(sql: string, params?: any[]): Promise<T> {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows as T;
}

// 初始化数据库表
export async function initTables(): Promise<void> {
  const p = getPool();

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(50),
      email VARCHAR(100),
      phone VARCHAR(20),
      avatar VARCHAR(255),
      balance DECIMAL(10,2) DEFAULT 0,
      points INT DEFAULT 0,
      member_level INT DEFAULT 1,
      real_name VARCHAR(50),
      id_card VARCHAR(20),
      status TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_username (username),
      INDEX idx_phone (phone),
      INDEX idx_email (email)
    )`,

    `CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_no VARCHAR(50) UNIQUE NOT NULL,
      user_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      payment_method VARCHAR(50),
      paid_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_order_no (order_no),
      INDEX idx_status (status)
    )`,

    `CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_name VARCHAR(100),
      product_id INT,
      quantity INT DEFAULT 1,
      price DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS recharge_records (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      order_no VARCHAR(50) UNIQUE,
      payment_proof VARCHAR(255),
      paid_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_order_no (order_no)
    )`,

    `CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      type VARCHAR(20) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      balance_before DECIMAL(10,2),
      balance_after DECIMAL(10,2),
      description VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS referrals (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL UNIQUE,
      invite_code VARCHAR(20) UNIQUE NOT NULL,
      invite_count INT DEFAULT 0,
      commission DECIMAL(10,2) DEFAULT 0,
      withdrawn DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_invite_code (invite_code)
    )`,

    `CREATE TABLE IF NOT EXISTS referral_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      referral_id INT NOT NULL,
      invited_user_id INT,
      commission DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_referral_id (referral_id)
    )`,

    `CREATE TABLE IF NOT EXISTS coupons (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      code VARCHAR(50) NOT NULL,
      name VARCHAR(100),
      amount DECIMAL(10,2),
      min_amount DECIMAL(10,2),
      status VARCHAR(20) DEFAULT 'unused',
      valid_from DATE,
      valid_to DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_code (code)
    )`,

    `CREATE TABLE IF NOT EXISTS security_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      action VARCHAR(50),
      ip_address VARCHAR(50),
      device VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS user_sessions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      token VARCHAR(255) NOT NULL,
      ip_address VARCHAR(50),
      device VARCHAR(100),
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_token (token)
    )`,

    `CREATE TABLE IF NOT EXISTS merchant_apply (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      shop_name VARCHAR(100) NOT NULL,
      contact_phone VARCHAR(20) NOT NULL,
      business_category VARCHAR(50),
      remark TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      admin_remark TEXT,
      reviewed_at TIMESTAMP NULL,
      reviewed_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status)
    )`,

    `CREATE TABLE IF NOT EXISTS user_identities (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      provider VARCHAR(20) NOT NULL,
      identifier VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE INDEX idx_provider_identifier (provider, identifier),
      INDEX idx_user_id (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS otp_codes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      destination VARCHAR(255) NOT NULL,
      code_hash VARCHAR(255) NOT NULL,
      channel VARCHAR(20) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      attempts INT DEFAULT 0,
      last_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_destination_channel (destination, channel),
      INDEX idx_expires (expires_at)
    )`,

    `CREATE TABLE IF NOT EXISTS telegram_request_tokens (
      id INT PRIMARY KEY AUTO_INCREMENT,
      request_token VARCHAR(64) NOT NULL UNIQUE,
      telegram_user_id BIGINT,
      user_id INT,
      status VARCHAR(20) DEFAULT 'pending',
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_request_token (request_token),
      INDEX idx_telegram_user_id (telegram_user_id)
    )`
  ];

  // 更新 users 表添加 is_merchant 字段（MySQL 需要先检查字段是否存在）
  try {
    // 检查字段是否已存在
    const [columns] = await p.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_merchant'
    `, [process.env.MYSQL_DATABASE || 'wuyouservice']);

    if ((columns as any[]).length === 0) {
      await p.execute('ALTER TABLE users ADD COLUMN is_merchant TINYINT DEFAULT 0');
      console.log('is_merchant 字段添加成功');
    }
  } catch (e: any) {
    // 忽略错误
    console.log('检查/添加 is_merchant 字段:', e.message);
  }

  for (const sql of tables) {
    await p.execute(sql);
  }
}

// 关闭连接池
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// 类型定义
export interface User {
  id: number;
  username: string;
  password: string;
  nickname: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  balance: number;
  points: number;
  member_level: number;
  real_name: string | null;
  id_card: string | null;
  status: number;
  is_merchant: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  order_no: string;
  user_id: number;
  total_amount: number;
  status: string;
  payment_method: string | null;
  paid_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface RechargeRecord {
  id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  status: string;
  order_no: string;
  payment_proof: string | null;
  paid_at: Date | null;
  created_at: Date;
}

export interface WalletTransaction {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  created_at: Date;
}

export interface Referral {
  id: number;
  user_id: number;
  invite_code: string;
  invite_count: number;
  commission: number;
  withdrawn: number;
  created_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  ip_address: string | null;
  device: string | null;
  expires_at: Date;
  created_at: Date;
}

export interface MerchantApply {
  id: number;
  user_id: number;
  shop_name: string;
  contact_phone: string;
  business_category: string | null;
  remark: string | null;
  status: string;
  admin_remark: string | null;
  reviewed_at: Date | null;
  reviewed_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserIdentity {
  id: number;
  user_id: number;
  provider: string;
  identifier: string;
  created_at: Date;
}

export interface OtpCode {
  id: number;
  destination: string;
  code_hash: string;
  channel: string;
  expires_at: Date;
  attempts: number;
  last_sent_at: Date;
  verified: number;
  created_at: Date;
}

export interface TelegramRequestToken {
  id: number;
  request_token: string;
  telegram_user_id: number | null;
  user_id: number | null;
  status: string;
  expires_at: Date;
  created_at: Date;
}
