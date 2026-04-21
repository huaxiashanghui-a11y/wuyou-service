// Types for database entities

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
