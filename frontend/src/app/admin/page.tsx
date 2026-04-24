'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Users,
  Store,
  Package,
  FileText,
  CreditCard,
  Coins,
  Crown,
  Gamepad2,
  Globe,
  Gift,
  Image,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Download,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DashboardStats {
  users: { count: number; change: number };
  merchants: { count: number; change: number };
  products: { count: number; change: number };
  orders: { count: number; change: number };
  services: { count: number; change: number };
  recharge: { amount: number; change: number };
  payments: { count: number; change: number };
  points: { balance: number; change: number };
  members: { count: number; change: number };
  games: { active: number; change: number };
  forex: { volume: number; change: number };
  activities: { count: number; change: number };
  media: { count: number; change: number };
  promotion: { count: number; change: number };
  exceptions: { count: number; change: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    users: { count: 0, change: 0 },
    merchants: { count: 0, change: 0 },
    products: { count: 0, change: 0 },
    orders: { count: 0, change: 0 },
    services: { count: 0, change: 0 },
    recharge: { amount: 0, change: 0 },
    payments: { count: 0, change: 0 },
    points: { balance: 0, change: 0 },
    members: { count: 0, change: 0 },
    games: { active: 0, change: 0 },
    forex: { volume: 0, change: 0 },
    activities: { count: 0, change: 0 },
    media: { count: 0, change: 0 },
    promotion: { count: 0, change: 0 },
    exceptions: { count: 0, change: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const timeOptions = [
    { value: 'today', label: '今日' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'year', label: '本年' },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 从API获取各类统计数据
      const [usersRes, merchantsRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/merchants', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const usersData = await usersRes.json();
      const merchantsData = await merchantsRes.json();

      // 模拟其他数据（实际项目中应该从API获取）
      setStats({
        users: { count: usersData.data?.total || 0, change: Math.floor(Math.random() * 20) - 5 },
        merchants: { count: merchantsData.data?.total || 0, change: Math.floor(Math.random() * 15) - 3 },
        products: { count: 0, change: Math.floor(Math.random() * 30) - 10 },
        orders: { count: 0, change: Math.floor(Math.random() * 25) - 8 },
        services: { count: 0, change: Math.floor(Math.random() * 20) - 5 },
        recharge: { amount: 0, change: Math.floor(Math.random() * 40) - 10 },
        payments: { count: 0, change: Math.floor(Math.random() * 18) - 6 },
        points: { balance: 0, change: Math.floor(Math.random() * 50) - 15 },
        members: { count: 0, change: Math.floor(Math.random() * 12) - 4 },
        games: { active: 0, change: Math.floor(Math.random() * 22) - 8 },
        forex: { volume: 0, change: Math.floor(Math.random() * 35) - 15 },
        activities: { count: 0, change: Math.floor(Math.random() * 10) - 3 },
        media: { count: 0, change: Math.floor(Math.random() * 28) - 10 },
        promotion: { count: 0, change: Math.floor(Math.random() * 15) - 5 },
        exceptions: { count: Math.floor(Math.random() * 5), change: Math.floor(Math.random() * 10) - 5 },
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchDashboardStats();
  };

  const handleExport = () => {
    // 导出数据逻辑
    alert('数据导出功能开发中...');
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) return '¥' + (amount / 10000).toFixed(1) + 'w';
    if (amount >= 1000) return '¥' + (amount / 1000).toFixed(1) + 'k';
    return '¥' + amount.toFixed(2);
  };

  const dataCards = [
    { key: 'users', label: '用户', icon: Users, value: stats.users.count, change: stats.users.change, color: '#3498DB', href: '/admin/users' },
    { key: 'merchants', label: '商户', icon: Store, value: stats.merchants.count, change: stats.merchants.change, color: '#9B59B6', href: '/admin/merchants' },
    { key: 'products', label: '产品', icon: Package, value: stats.products.count, change: stats.products.change, color: '#E67E22', href: '/admin/products' },
    { key: 'orders', label: '订单', icon: FileText, value: stats.orders.count, change: stats.orders.change, color: '#67C23A', href: '/admin/orders' },
    { key: 'services', label: '服务', icon: CreditCard, value: stats.services.count, change: stats.services.change, color: '#1ABC9C', href: '/admin/services' },
    { key: 'recharge', label: '充值', icon: Coins, value: stats.recharge.amount, change: stats.recharge.change, color: '#F39C12', isCurrency: true, href: '/admin/payment/recharge' },
    { key: 'payments', label: '支付', icon: CreditCard, value: stats.payments.count, change: stats.payments.change, color: '#3498DB', href: '/admin/payment/list' },
    { key: 'points', label: '积分', icon: Coins, value: stats.points.balance, change: stats.points.change, color: '#E74C3C', href: '/admin/finance/points' },
    { key: 'members', label: '会员', icon: Crown, value: stats.members.count, change: stats.members.change, color: '#9B59B6', href: '/admin/users/members' },
    { key: 'games', label: '游戏', icon: Gamepad2, value: stats.games.active, change: stats.games.change, color: '#2ECC71', href: '/admin/games' },
    { key: 'forex', label: '外汇', icon: Globe, value: stats.forex.volume, change: stats.forex.change, color: '#34495E', href: '/admin/forex' },
    { key: 'activities', label: '活动', icon: Gift, value: stats.activities.count, change: stats.activities.change, color: '#E91E63', href: '/admin/operations/activities' },
    { key: 'media', label: '素材', icon: Image, value: stats.media.count, change: stats.media.change, color: '#00BCD4', href: '/admin/media' },
    { key: 'promotion', label: '推广', icon: TrendingUp, value: stats.promotion.count, change: stats.promotion.change, color: '#FF5722', href: '/admin/promotion' },
    { key: 'exceptions', label: '异常数据', icon: AlertTriangle, value: stats.exceptions.count, change: stats.exceptions.change, color: '#F56C6C', href: '/admin/exceptions' },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-[#3498DB] animate-spin mx-auto mb-2" />
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span className="text-gray-700">数据总表</span>
        </div>

        {/* 页面标题和操作栏 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数据总表</h1>
            <p className="text-gray-500 mt-1">查看平台运营数据概览</p>
          </div>
          <div className="flex items-center gap-3">
            {/* 刷新按钮 */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">刷新</span>
            </button>
            {/* 导出按钮 */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 时间筛选栏 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">时间范围：</span>
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">
                  {timeOptions.find(opt => opt.value === timeRange)?.label || '今日'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTimeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                  {timeOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTimeRange(option.value);
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        timeRange === option.value ? 'text-[#3498DB] bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1"></div>
            <span className="text-gray-500 text-sm">
              最后更新: {new Date().toLocaleString('zh-CN')}
            </span>
          </div>
        </div>

        {/* 数据卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {dataCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            const displayValue = card.isCurrency
              ? formatCurrency(card.value)
              : formatNumber(card.value);

            return (
              <a
                key={card.key}
                href={card.href}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-[#3498DB]/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: card.color + '15' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{Math.abs(card.change)}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-[#3498DB] transition-colors">
                  {displayValue}
                </div>
                <div className="text-gray-500 text-sm">{card.label}</div>
              </a>
            );
          })}
        </div>

        {/* 快捷操作入口 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <a
              href="/admin/users"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#3498DB]" />
              </div>
              <span className="text-sm text-gray-700">用户管理</span>
            </a>
            <a
              href="/admin/merchants"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-[#9B59B6]" />
              </div>
              <span className="text-sm text-gray-700">商家管理</span>
            </a>
            <a
              href="/admin/products"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-[#E67E22]" />
              </div>
              <span className="text-sm text-gray-700">产品管理</span>
            </a>
            <a
              href="/admin/orders"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#67C23A]" />
              </div>
              <span className="text-sm text-gray-700">订单管理</span>
            </a>
            <a
              href="/admin/payment/recharge"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#F39C12]" />
              </div>
              <span className="text-sm text-gray-700">充值管理</span>
            </a>
            <a
              href="/admin/finance"
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-[#1ABC9C]" />
              </div>
              <span className="text-sm text-gray-700">财务管理</span>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}