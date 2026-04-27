// ============================================
// 基础类型定义
// ============================================

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
  currency?: PaymentCurrency;
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

// ============================================
// 支付相关类型
// ============================================

/** 支持的支付方式 */
export type PaymentMethod = 'usdt_trc20' | 'kbzpay' | 'ayapay';

/** 支持的币种 */
export type PaymentCurrency = 'CNY' | 'MMK' | 'USDT';

/** 支付方式配置 */
export interface PaymentMethodConfig {
  id: PaymentMethod;
  name: string;
  icon: string;
  currency: PaymentCurrency;
  description: string;
}

/** 预设支付方式列表 */
export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'usdt_trc20',
    name: 'USDT-TRC20',
    icon: '₮',
    currency: 'USDT',
    description: 'Tether TRC20 链上转账',
  },
  {
    id: 'kbzpay',
    name: 'KBZPay',
    icon: 'K',
    currency: 'MMK',
    description: 'KBZPay 移动支付',
  },
  {
    id: 'ayapay',
    name: 'AYAPay',
    icon: 'A',
    currency: 'MMK',
    description: 'AYAPay 移动支付',
  },
];

/** 币种符号映射 */
export const CURRENCY_SYMBOLS: Record<PaymentCurrency, string> = {
  CNY: '¥',
  MMK: 'K',
  USDT: '$',
};

// ============================================
// API 响应类型
// ============================================

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

// ============================================
// 购物车类型
// ============================================

export interface CartItem {
  product: Product;
  quantity: number;
}

// ============================================
// 订单查询类型
// ============================================

export interface OrderQueryParams {
  orderNo?: string;
  email?: string;
  phone?: string;
}

// ============================================
// 结算类型
// ============================================

export interface CheckoutFormData {
  email: string;
  phone: string;
  remark?: string;
  paymentMethod: PaymentMethod;
  currency: PaymentCurrency;
}

/** 创建订单请求 */
export interface CreateOrderRequest {
  items: { productId: string; productName: string; productImage: string; quantity: number; price: number }[];
  paymentMethod: PaymentMethod;
  currency: PaymentCurrency;
  email?: string;
  phone?: string;
  remark?: string;
}
