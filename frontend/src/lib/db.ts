import mysql from 'mysql2/promise';

// Database configuration
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

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Query helper function
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  const pool = getPool();
  const [results] = await pool.execute(sql, params);
  return results as T;
}

// Transaction helper
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Types
export interface User {
  id: number;
  username: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface WalletRecharge {
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

export interface OrderItem {
  id: number;
  order_id: number;
  product_name: string | null;
  product_id: number | null;
  quantity: number;
  price: number;
}

export interface Coupon {
  id: number;
  user_id: number;
  code: string;
  name: string | null;
  amount: number | null;
  min_amount: number | null;
  status: string;
  valid_from: Date | null;
  valid_to: Date | null;
  created_at: Date;
}

export interface Promotion {
  id: number;
  user_id: number;
  invite_code: string;
  invite_count: number;
  commission: number;
  created_at: Date;
}

export interface SecurityLog {
  id: number;
  user_id: number;
  action: string;
  ip_address: string | null;
  device: string | null;
  created_at: Date;
}

export interface UserSecurity {
  id: number;
  user_id: number;
  login_password: string | null;
  pay_password: string | null;
  two_factor_enabled: number;
  login_protection: number;
  updated_at: Date;
}

// Initialize database tables
export async function initDatabase(): Promise<void> {
  const pool = getPool();

  // Create users table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
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
      UNIQUE KEY idx_username (username)
    )
  `);

  // Create wallet_recharges table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS wallet_recharges (
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
      INDEX idx_order_no (order_no),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create wallet_transactions table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      type VARCHAR(20) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      balance_before DECIMAL(10,2),
      balance_after DECIMAL(10,2),
      description VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create orders table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders (
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
      INDEX idx_status (status),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create order_items table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      product_name VARCHAR(100),
      product_id INT,
      quantity INT DEFAULT 1,
      price DECIMAL(10,2),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  // Create coupons table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
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
      INDEX idx_code (code),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create promotions table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS promotions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL UNIQUE,
      invite_code VARCHAR(20) UNIQUE NOT NULL,
      invite_count INT DEFAULT 0,
      commission DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create promotion_logs table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS promotion_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      promotion_id INT NOT NULL,
      invited_user_id INT,
      commission DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (promotion_id) REFERENCES promotions(id)
    )
  `);

  // Create security_logs table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS security_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      action VARCHAR(50),
      ip_address VARCHAR(50),
      device VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create user_security table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS user_security (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL UNIQUE,
      login_password VARCHAR(255),
      pay_password VARCHAR(255),
      two_factor_enabled TINYINT DEFAULT 0,
      login_protection TINYINT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Database tables initialized successfully');
}

// Close pool
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
