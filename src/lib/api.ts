import apiClient from './api-client';
import type {
  Product,
  Category,
  Order,
  Card,
  DashboardStats,
  SystemSettings,
  Admin,
  CreateOrderRequest,
  LoginRequest,
  LoginResponse,
  ProductQuery,
  CardQuery,
  ImportCardsRequest,
  PaginatedResponse
} from './types';

// 认证 API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/api/auth/login', data);
  },
  
  logout: async (): Promise<void> => {
    return apiClient.post('/api/auth/logout');
  },
  
  getProfile: async (): Promise<Admin> => {
    return apiClient.get('/api/auth/profile');
  },
  
  refreshToken: async (): Promise<{ token: string }> => {
    return apiClient.post('/api/auth/refresh');
  }
};

// 商品 API
export const productApi = {
  // 获取商品列表
  getProducts: async (query?: ProductQuery): Promise<PaginatedResponse<Product>> => {
    return apiClient.get('/api/products', { params: query });
  },
  
  // 获取热门商品
  getFeaturedProducts: async (): Promise<Product[]> => {
    return apiClient.get('/api/products/featured');
  },
  
  // 获取单个商品
  getProduct: async (id: string): Promise<Product> => {
    return apiClient.get(`/api/products/${id}`);
  },
  
  // 获取商品分类
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get('/api/categories');
  },
  
  // 创建商品（管理员）
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    return apiClient.post('/api/products', data);
  },
  
  // 更新商品（管理员）
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    return apiClient.put(`/api/products/${id}`, data);
  },
  
  // 删除商品（管理员）
  deleteProduct: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/products/${id}`);
  },
  
  // 批量更新商品状态（管理员）
  batchUpdateProducts: async (ids: string[], data: Partial<Product>): Promise<void> => {
    return apiClient.post('/api/products/batch', { ids, data });
  }
};

// 订单 API
export const orderApi = {
  // 创建订单
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    return apiClient.post('/api/orders', data);
  },
  
  // 查询订单
  queryOrder: async (orderId?: string, email?: string): Promise<Order[]> => {
    return apiClient.get('/api/orders/query', { params: { orderId, email } });
  },
  
  // 获取订单详情
  getOrder: async (id: string): Promise<Order> => {
    return apiClient.get(`/api/orders/${id}`);
  },
  
  // 获取订单列表（管理员）
  getOrders: async (params?: any): Promise<PaginatedResponse<Order>> => {
    return apiClient.get('/api/orders', { params });
  },
  
  // 更新订单状态（管理员）
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    return apiClient.put(`/api/orders/${id}/status`, { status });
  },
  
  // 导出订单（管理员）
  exportOrders: async (params?: any): Promise<Blob> => {
    return apiClient.get('/api/orders/export', { 
      params, 
      responseType: 'blob' 
    });
  }
};

// 卡密 API
export const cardApi = {
  // 获取卡密列表（管理员）
  getCards: async (query?: CardQuery): Promise<PaginatedResponse<Card>> => {
    return apiClient.get('/api/cards', { params: query });
  },
  
  // 获取可用卡密数量
  getAvailableCount: async (productId: string): Promise<number> => {
    return apiClient.get(`/api/cards/available/${productId}`);
  },
  
  // 导入卡密（管理员）
  importCards: async (data: ImportCardsRequest): Promise<{ count: number }> => {
    return apiClient.post('/api/cards/import', data);
  },
  
  // 导出卡密（管理员）
  exportCards: async (productId?: string): Promise<Blob> => {
    return apiClient.get('/api/cards/export', { 
      params: { productId },
      responseType: 'blob' 
    });
  },
  
  // 删除卡密（管理员）
  deleteCard: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/cards/${id}`);
  }
};

// 管理员 API
export const adminApi = {
  // 获取管理员列表（超级管理员）
  getAdmins: async (): Promise<Admin[]> => {
    return apiClient.get('/api/admins');
  },
  
  // 创建管理员（超级管理员）
  createAdmin: async (data: Partial<Admin>): Promise<Admin> => {
    return apiClient.post('/api/admins', data);
  },
  
  // 更新管理员（超级管理员）
  updateAdmin: async (id: string, data: Partial<Admin>): Promise<Admin> => {
    return apiClient.put(`/api/admins/${id}`, data);
  },
  
  // 删除管理员（超级管理员）
  deleteAdmin: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/admins/${id}`);
  }
};

// 系统设置 API
export const settingsApi = {
  // 获取系统设置
  getSettings: async (): Promise<SystemSettings> => {
    return apiClient.get('/api/settings');
  },
  
  // 更新系统设置（管理员）
  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    return apiClient.put('/api/settings', data);
  }
};

// 仪表盘统计 API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get('/api/dashboard/stats');
  }
};

// 健康检查 API
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    return apiClient.get('/api/health');
  }
};

export default {
  auth: authApi,
  products: productApi,
  orders: orderApi,
  cards: cardApi,
  admins: adminApi,
  settings: settingsApi,
  dashboard: dashboardApi,
  health: healthApi
};
