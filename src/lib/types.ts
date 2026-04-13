// 用户相关类型
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

// 商品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryName?: string;
  stock: number;
  sold: number;
  featured: boolean;
  status: 'active' | 'inactive';
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
  productCount?: number;
}

// 卡密相关类型
export interface Card {
  id: string;
  productId: string;
  productName?: string;
  code: string;
  password?: string;
  status: 'available' | 'used' | 'expired';
  usedBy?: string;
  usedAt?: string;
  orderId?: string;
  createdAt: string;
}

// 订单相关类型
export interface Order {
  id: string;
  orderId: string;
  email: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod?: 'alipay' | 'wechat' | 'qqpay';
  paymentTime?: string;
  cards?: OrderCard[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderCard {
  code: string;
  password?: string;
}

// 管理员相关类型
export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
}

// 系统设置类型
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteLogo?: string;
  contactEmail: string;
  contactPhone: string;
  announcements: Announcement[];
  paymentEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  published: boolean;
  createdAt: string;
}

// 统计数据类型
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCards: number;
  availableCards: number;
  todayOrders: number;
  todayRevenue: number;
  recentOrders: Order[];
  topProducts: Product[];
}

// 购物车类型
export interface CartItem {
  product: Product;
  quantity: number;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  admin: Admin;
  expiresIn: number;
}

// 创建订单请求
export interface CreateOrderRequest {
  productId: string;
  quantity: number;
  email: string;
}

// 订单查询
export interface OrderQuery {
  orderId?: string;
  email?: string;
}

// 商品查询
export interface ProductQuery {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// 卡密查询
export interface CardQuery {
  productId?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// 批量导入卡密
export interface ImportCardsRequest {
  productId: string;
  codes: string[];
  passwords?: string[];
}
