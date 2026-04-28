import apiClient, { PaginatedResponse, ApiResponse } from './api-client';
import {
  Product, Category, Order, SystemSettings,
  CreateOrderRequest, OrderQueryParams,
  PaymentMethodRecord, QuoteRequest, QuoteResponse,
  PaymentPrepareRequest, PaymentPrepareResponse,
  CreateOrderQuoteRequest, CreateOrderQuoteResponse,
} from './types';

// ============================================
// 商品 API
// ============================================

export const productApi = {
  getProducts: async (params?: {
    category?: string;
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/api/admin/products', { params });
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>('/api/admin/products', { params: { id } });
    return response.data.data!;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/api/admin/products', { params: { featured: true } });
    return response.data.data || [];
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/admin/categories');
    return response.data.data || [];
  },
};

// ============================================
// 订单 API
// ============================================

export const orderApi = {
  // 创建订单（旧版兼容）
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>('/api/orders', data);
    return response.data;
  },

  // 创建订单（新版：quote-based）
  createOrderFromQuote: async (data: CreateOrderQuoteRequest): Promise<ApiResponse<CreateOrderQuoteResponse>> => {
    const response = await apiClient.post<ApiResponse<CreateOrderQuoteResponse>>('/api/orders', data);
    return response.data;
  },

  // 查询订单
  queryOrder: async (params: OrderQueryParams): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/api/orders', { params });
    return response.data.data || [];
  },

  // 获取订单详情（通过 orderNo）
  getOrder: async (orderNo: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>('/api/orders', { params: { orderNo } });
    return response.data.data!;
  },

  // 获取单个订单详情（新版动态路由）
  getOrderByNo: async (orderNo: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/api/orders/${orderNo}`);
    return response.data;
  },

  // 确认支付（用户确认后更新支付状态）
  confirmPayment: async (orderNo: string, paymentProof?: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.put<ApiResponse<Order>>('/api/orders', { orderNo, action: 'confirmPayment', paymentProof });
    return response.data;
  },
};

// ============================================
// 支付 API
// ============================================

export const paymentApi = {
  // 获取可用支付方式
  getMethods: async (): Promise<ApiResponse<PaymentMethodRecord[]>> => {
    const response = await apiClient.get<ApiResponse<PaymentMethodRecord[]>>('/api/payment/methods');
    return response.data;
  },

  // 创建汇率报价
  createQuote: async (data: QuoteRequest): Promise<ApiResponse<QuoteResponse>> => {
    const response = await apiClient.post<ApiResponse<QuoteResponse>>('/api/payments/quote', data);
    return response.data;
  },

  // 准备支付（获取支付指引）
  preparePayment: async (data: PaymentPrepareRequest): Promise<ApiResponse<PaymentPrepareResponse>> => {
    const response = await apiClient.post<ApiResponse<PaymentPrepareResponse>>('/api/payments/prepare', data);
    return response.data;
  },
};

// ============================================
// 系统设置 API
// ============================================

export const settingsApi = {
  getSettings: async (): Promise<SystemSettings> => {
    const response = await apiClient.get<ApiResponse<SystemSettings>>('/api/settings');
    return response.data.data!;
  },

  getAnnouncements: async (): Promise<SystemSettings['announcements']> => {
    const response = await apiClient.get<ApiResponse<SystemSettings['announcements']>>('/api/announcements');
    return response.data.data || [];
  },
};

// ============================================
// 健康检查
// ============================================

export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get<{ status: string; timestamp: string }>('/api/health');
    return response.data;
  },
};
