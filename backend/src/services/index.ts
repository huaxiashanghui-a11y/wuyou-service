import { v4 as uuidv4 } from 'uuid';
import { products, cards, orders, categories, systemSettings, admins } from '../data/mock';
import { Product, Card, Order, Category, Admin, SystemSettings, OrderCard } from '../types';

// ============================================
// 商品服务
// ============================================

export const productService = {
  getAll: (params?: { category?: string; status?: string; page?: number; pageSize?: number }) => {
    let filtered = [...products];

    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(p => p.category === params.category);
    }

    if (params?.status) {
      filtered = filtered.filter(p => p.status === params.status);
    }

    // 排序
    filtered.sort((a, b) => a.sort - b.sort);

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  getById: (id: string) => {
    return products.find(p => p.id === id);
  },

  getFeatured: () => {
    return products.filter(p => p.featured && p.status === 'active');
  },

  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(product);
    return product;
  },

  update: (id: string, data: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return products[index];
  },

  delete: (id: string) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};

// ============================================
// 分类服务
// ============================================

export const categoryService = {
  getAll: () => {
    return [...categories].sort((a, b) => a.sort - b.sort);
  },

  getById: (id: string) => {
    return categories.find(c => c.id === id);
  },

  create: (data: Omit<Category, 'id'>) => {
    const category: Category = { ...data, id: uuidv4() };
    categories.push(category);
    return category;
  },

  update: (id: string, data: Partial<Category>) => {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...data };
    return categories[index];
  },

  delete: (id: string) => {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    categories.splice(index, 1);
    return true;
  },
};

// ============================================
// 卡密服务
// ============================================

export const cardService = {
  getAll: (params?: { productId?: string; status?: string; page?: number; pageSize?: number }) => {
    let filtered = [...cards];

    if (params?.productId) {
      filtered = filtered.filter(c => c.productId === params.productId);
    }

    if (params?.status) {
      filtered = filtered.filter(c => c.status === params.status);
    }

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  getAvailableByProductId: (productId: string, quantity: number) => {
    const availableCards = cards.filter(
      c => c.productId === productId && c.status === 'available'
    );
    return availableCards.slice(0, quantity);
  },

  create: (data: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    const card: Card = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    cards.push(card);
    return card;
  },

  bulkCreate: (productId: string, productName: string, codes: string[]) => {
    const newCards = codes.map(code => ({
      id: uuidv4(),
      code,
      productId,
      productName,
      status: 'available' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    cards.push(...newCards);
    return newCards;
  },

  markAsUsed: (cardId: string, orderId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      card.status = 'used';
      card.orderId = orderId;
      card.usedAt = new Date().toISOString();
      card.updatedAt = new Date().toISOString();
    }
    return card;
  },

  delete: (id: string) => {
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) return false;
    cards.splice(index, 1);
    return true;
  },
};

// ============================================
// 订单服务
// ============================================

export const orderService = {
  getAll: (params?: { status?: string; page?: number; pageSize?: number }) => {
    let filtered = [...orders];

    if (params?.status) {
      filtered = filtered.filter(o => o.status === params.status);
    }

    // 按创建时间倒序
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  getByOrderNo: (orderNo: string) => {
    return orders.find(o => o.orderNo === orderNo);
  },

  query: (params: { orderNo?: string; email?: string; phone?: string }) => {
    let filtered = [...orders];

    if (params.orderNo) {
      filtered = filtered.filter(o => o.orderNo.includes(params.orderNo!));
    }

    if (params.email) {
      filtered = filtered.filter(o => o.buyerEmail?.includes(params.email!));
    }

    if (params.phone) {
      filtered = filtered.filter(o => o.buyerPhone?.includes(params.phone!));
    }

    return filtered;
  },

  create: (data: {
    productId: string;
    quantity: number;
    email?: string;
    phone?: string;
    remark?: string;
    paymentMethod: string;
  }) => {
    const product = products.find(p => p.id === data.productId);
    if (!product) throw new Error('商品不存在');

    const orderNo = `WY${Date.now()}`;
    const order: Order = {
      id: uuidv4(),
      orderNo,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      quantity: data.quantity,
      price: product.price,
      totalPrice: product.price * data.quantity,
      status: 'pending',
      paymentMethod: data.paymentMethod,
      buyerEmail: data.email,
      buyerPhone: data.phone,
      remark: data.remark,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);
    return order;
  },

  // 模拟支付
  pay: async (orderNo: string) => {
    const order = orders.find(o => o.orderNo === orderNo);
    if (!order) throw new Error('订单不存在');
    if (order.status !== 'pending') throw new Error('订单状态不允许支付');

    // 更新状态为已支付
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    // 自动发卡
    const orderCards: OrderCard[] = [];
    const availableCards = cardService.getAvailableByProductId(order.productId, order.quantity);

    for (const card of availableCards) {
      cardService.markAsUsed(card.id, order.id);
      orderCards.push({ code: card.code, password: card.password });
    }

    // 更新订单卡密
    order.cards = orderCards;
    order.status = 'completed';
    order.deliveredAt = new Date().toISOString();
    order.completedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    // 更新商品销量
    const product = products.find(p => p.id === order.productId);
    if (product) {
      product.sold += order.quantity;
    }

    return order;
  },

  updateStatus: (orderNo: string, status: Order['status']) => {
    const order = orders.find(o => o.orderNo === orderNo);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'paid') {
      order.paidAt = new Date().toISOString();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date().toISOString();
    } else if (status === 'completed') {
      order.completedAt = new Date().toISOString();
    }

    return order;
  },

  getStats: () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      completed: orders.filter(o => o.status === 'completed').length,
      totalRevenue: orders
        .filter(o => ['paid', 'processing', 'delivered', 'completed'].includes(o.status))
        .reduce((sum, o) => sum + o.totalPrice, 0),
    };
  },
};

// ============================================
// 管理员服务
// ============================================

export const adminService = {
  getAll: () => {
    return admins.map(({ password, ...rest }) => rest);
  },

  getById: (id: string) => {
    const admin = admins.find(a => a.id === id);
    if (admin) {
      const { password, ...rest } = admin;
      return rest;
    }
    return null;
  },

  getByUsername: (username: string) => {
    return admins.find(a => a.username === username);
  },

  create: async (data: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existing = admins.find(a => a.username === data.username);
    if (existing) throw new Error('用户名已存在');

    const admin: Admin = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    admins.push(admin);
    return admin;
  },

  update: (id: string, data: Partial<Admin>) => {
    const index = admins.findIndex(a => a.id === id);
    if (index === -1) return null;
    admins[index] = { ...admins[index], ...data, updatedAt: new Date().toISOString() };
    return admins[index];
  },

  delete: (id: string) => {
    const index = admins.findIndex(a => a.id === id);
    if (index === -1) return false;
    admins.splice(index, 1);
    return true;
  },
};

// ============================================
// 系统设置服务
// ============================================

export const settingsService = {
  get: () => systemSettings,

  update: (data: Partial<SystemSettings>) => {
    Object.assign(systemSettings, data);
    return systemSettings;
  },
};
