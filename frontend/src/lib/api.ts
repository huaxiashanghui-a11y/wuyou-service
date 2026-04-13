import apiClient, { PaginatedResponse, ApiResponse } from './api-client';
import { Product, Category, Order, SystemSettings, CheckoutFormData } from './types';

// ============================================
// 商品 API
// ============================================

export const productApi = {
  // 获取商品列表
  getProducts: async (params?: {
    category?: string;
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/api/products', { params });
    return response.data;
  },

  // 获取单个商品
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data.data!;
  },

  // 获取热门商品
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/api/products/featured');
    return response.data.data || [];
  },

  // 获取商品分类
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
    return response.data.data || [];
  },
};

// ============================================
// 订单 API
// ============================================

export const orderApi = {
  // 创建订单
  createOrder: async (data: {
    productId: string;
    quantity: number;
    checkoutData: CheckoutFormData;
  }): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/api/orders', data);
    return response.data.data!;
  },

  // 查询订单
  queryOrder: async (params: {
    orderNo?: string;
    email?: string;
    phone?: string;
  }): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/api/orders/query', { params });
    return response.data.data || [];
  },

  // 获取订单详情
  getOrder: async (orderNo: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/api/orders/${orderNo}`);
    return response.data.data!;
  },

  // 模拟支付
  mockPay: async (orderNo: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/api/orders/${orderNo}/pay`);
    return response.data.data!;
  },
};

// ============================================
// 系统设置 API
// ============================================

export const settingsApi = {
  // 获取系统设置
  getSettings: async (): Promise<SystemSettings> => {
    const response = await apiClient.get<ApiResponse<SystemSettings>>('/api/settings');
    return response.data.data!;
  },

  // 获取公告列表
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
