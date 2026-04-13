import { Product, Category, Card, Order, Admin, SystemSettings } from '../types';

// 模拟管理员数据
export const admins: Admin[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@wuyou.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    role: 'superadmin',
    permissions: ['*'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// 模拟商品数据
export const products: Product[] = [
  {
    id: '1',
    name: '王者荣耀点卡 100元',
    description: '官方直充，快速到账，安全可靠',
    price: 95,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 5200,
    featured: true,
    status: 'active',
    sort: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '原神月卡 30元',
    description: '原神祈月礼遇，快速充值',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 3500,
    featured: true,
    status: 'active',
    sort: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Steam充值卡 100美元',
    description: 'Steam钱包充值码，全球通用',
    price: 680,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
    category: 'game',
    stock: 50,
    sold: 1200,
    featured: true,
    status: 'active',
    sort: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: '腾讯视频VIP月卡',
    description: '腾讯视频会员，畅享海量影视',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 999,
    sold: 8000,
    featured: false,
    status: 'active',
    sort: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: '网易云音乐VIP年卡',
    description: '网易云音乐年度会员，高品质音乐',
    price: 158,
    originalPrice: 188,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 200,
    sold: 1500,
    featured: false,
    status: 'active',
    sort: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: '英雄联盟点券 1000',
    description: 'LOL官方点券充值，秒到账',
    price: 85,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 4500,
    featured: false,
    status: 'active',
    sort: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: '手机话费充值 100元',
    description: '全网运营商通用，秒到账',
    price: 98,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'recharge',
    stock: 999,
    sold: 12000,
    featured: false,
    status: 'active',
    sort: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'QQ超级会员月卡',
    description: 'QQ超级会员特权，尊享体验',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 500,
    sold: 3000,
    featured: false,
    status: 'active',
    sort: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 模拟分类数据
export const categories: Category[] = [
  { id: 'game', name: '游戏点卡', sort: 1, status: 'active' },
  { id: 'gift', name: '礼品卡', sort: 2, status: 'active' },
  { id: 'recharge', name: '话费充值', sort: 3, status: 'active' },
  { id: 'other', name: '增值服务', sort: 4, status: 'active' },
];

// 模拟卡密数据
export const cards: Card[] = [
  // 王者荣耀点卡
  { id: 'card-1', code: 'WZRY-100-AAAA-BBBB-CCCC', productId: '1', productName: '王者荣耀点卡 100元', status: 'available', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'card-2', code: 'WZRY-100-DDDD-EEEE-FFFF', productId: '1', productName: '王者荣耀点卡 100元', status: 'available', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'card-3', code: 'WZRY-100-GGGG-HHHH-III', productId: '1', productName: '王者荣耀点卡 100元', status: 'used', orderId: 'order-1', usedAt: '2024-01-15T10:30:00Z', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  // 原神月卡
  { id: 'card-4', code: 'YS-30-AAAA-BBBB-CCCC', productId: '2', productName: '原神月卡 30元', status: 'available', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'card-5', code: 'YS-30-DDDD-EEEE-FFFF', productId: '2', productName: '原神月卡 30元', status: 'available', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // Steam充值卡
  { id: 'card-6', code: 'STEAM-100-AAAA-BBBB', productId: '3', productName: 'Steam充值卡 100美元', status: 'available', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  // 腾讯视频VIP
  { id: 'card-7', code: 'TVIP-20-AAAA-BBBB-CCCC', productId: '4', productName: '腾讯视频VIP月卡', status: 'available', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// 模拟订单数据
export const orders: Order[] = [
  {
    id: 'order-1',
    orderNo: 'WY202401150001',
    productId: '1',
    productName: '王者荣耀点卡 100元',
    productImage: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=100&h=100&fit=crop',
    quantity: 1,
    price: 95,
    totalPrice: 95,
    status: 'completed',
    paymentMethod: 'alipay',
    paidAt: '2024-01-15T10:30:00Z',
    deliveredAt: '2024-01-15T10:30:05Z',
    completedAt: '2024-01-15T10:30:10Z',
    cards: [{ code: 'WZRY-100-GGGG-HHHH-III' }],
    buyerEmail: 'customer@example.com',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:10Z',
  },
];

// 模拟系统设置
export const systemSettings: SystemSettings = {
  siteName: '无忧服务',
  siteDescription: '专业游戏点卡商城',
  contactEmail: 'support@wuyou.com',
  contactPhone: '400-888-8888',
  customerServiceQQ: '12345678',
  announcements: [
    {
      id: 'ann-1',
      title: '春节期间发货延迟通知',
      content: '春节期间物流可能有所延迟，请谅解',
      type: 'warning',
      publishedAt: '2024-01-15T00:00:00Z',
      status: 'active',
    },
  ],
  bannerImages: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1200&h=400&fit=crop',
  ],
};
