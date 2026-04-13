// 基础类型定义
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
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
  icon?: string;
  sort: number;
  status: 'active' | 'inactive';
}

export interface Card {
  id: string;
  code: string;
  password?: string;
  productId: string;
  productName: string;
  status: 'available' | 'used' | 'expired';
  orderId?: string;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNo: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'processing' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  paidAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cards?: OrderCard[];
  buyerEmail?: string;
  buyerPhone?: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCard {
  code: string;
  password?: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin';
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  customerServiceQQ?: string;
  customerServiceWechat?: string;
  announcements: Announcement[];
  bannerImages: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  publishedAt: string;
  status: 'active' | 'inactive';
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// JWT Payload
export interface JWTPayload {
  adminId: string;
  username: string;
  role: 'admin' | 'superadmin';
  permissions: string[];
}
