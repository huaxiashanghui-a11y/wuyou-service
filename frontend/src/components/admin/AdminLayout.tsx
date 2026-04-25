'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  Store,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Shield,
  Loader2,
  Package,
  Truck,
  CreditCard,
  Wallet,
  User,
  Gamepad2,
  DollarSign,
  Megaphone,
  Image,
  TrendingUp,
  ShoppingBag,
  Mail,
  Bell,
  Link2,
  ChevronLeft,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '首页', icon: Home, href: '/admin' },
  {
    id: 'users',
    label: '用户管理',
    icon: Users,
    children: [
      { id: 'user-list', label: '用户列表', icon: Users, href: '/admin/users' },
      { id: 'user-bindings', label: '绑定管理', icon: Link2, href: '/admin/users/bindings' },
    ],
  },
  {
    id: 'merchants',
    label: '商家管理',
    icon: Store,
    children: [
      { id: 'merchant-list', label: '商户列表', icon: Store, href: '/admin/merchants' },
      { id: 'merchant-auth', label: '认证管理', icon: Shield, href: '/admin/merchants/auth' },
    ],
  },
  { id: 'products', label: '产品管理', icon: Package, href: '/admin/products' },
  { id: 'orders', label: '订单管理', icon: FileText, href: '/admin/orders' },
  {
    id: 'services',
    label: '服务管理',
    icon: Truck,
    children: [
      { id: 'service-food', label: '同城外卖', icon: ShoppingBag, href: '/admin/services/food' },
      { id: 'service-errand', label: '同城跑腿', icon: Truck, href: '/admin/services/errand' },
      { id: 'service-buy', label: '帮买帮送', icon: ShoppingBag, href: '/admin/services/buy' },
      { id: 'service-proxy', label: '平台代购', icon: ShoppingBag, href: '/admin/services/proxy' },
      { id: 'service-taxi', label: '同城滴滴车', icon: Truck, href: '/admin/services/taxi' },
    ],
  },
  {
    id: 'funds',
    label: '资金管理',
    icon: Wallet,
    children: [
      { id: 'fund-payment', label: '支付配置', icon: CreditCard, href: '/admin/finance/payment-config' },
      { id: 'fund-points', label: '积分列表', icon: Wallet, href: '/admin/funds/points' },
      { id: 'fund-price', label: '价格列表', icon: DollarSign, href: '/admin/funds/price' },
    ],
  },
  {
    id: 'payments',
    label: '支付管理',
    icon: CreditCard,
    children: [
      { id: 'pay-wechat', label: '微信支付', icon: CreditCard, href: '/admin/payments/wechat' },
      { id: 'pay-alipay', label: '支付宝', icon: CreditCard, href: '/admin/payments/alipay' },
      { id: 'pay-kbzpay', label: 'KBZpay', icon: CreditCard, href: '/admin/payments/kbzpay' },
      { id: 'pay-kbzbanking', label: 'KBZBanking', icon: CreditCard, href: '/admin/payments/kbzbanking' },
      { id: 'pay-wavepay', label: 'Wavepay', icon: CreditCard, href: '/admin/payments/wavepay' },
      { id: 'pay-ayapay', label: 'AYApay', icon: CreditCard, href: '/admin/payments/ayapay' },
      { id: 'pay-cbpay', label: 'CBpay', icon: CreditCard, href: '/admin/payments/cbpay' },
      { id: 'pay-usdt', label: 'USDT', icon: CreditCard, href: '/admin/payments/usdt' },
      { id: 'pay-binance', label: '币安', icon: CreditCard, href: '/admin/payments/binance' },
    ],
  },
  {
    id: 'finance',
    label: '财务管理',
    icon: Wallet,
    children: [
      { id: 'finance-exchange', label: '兑换记录', icon: DollarSign, href: '/admin/finance/exchange' },
      { id: 'finance-recharge', label: '充值管理', icon: Wallet, href: '/admin/finance/recharge' },
      { id: 'finance-recharge-detail', label: '充值明细', icon: FileText, href: '/admin/finance/recharge-detail' },
      { id: 'finance-points', label: '积分兑换明细', icon: TrendingUp, href: '/admin/finance/points' },
    ],
  },
  {
    id: 'membership',
    label: '会员管理',
    icon: User,
    children: [
      { id: 'member-orders', label: '会员订单', icon: FileText, href: '/admin/membership/orders' },
      { id: 'member-levels', label: '会员等级', icon: User, href: '/admin/membership/levels' },
    ],
  },
  {
    id: 'games',
    label: '游戏管理',
    icon: Gamepad2,
    children: [
      { id: 'game-orders', label: '游戏订单', icon: FileText, href: '/admin/games/orders' },
      { id: 'game-products', label: '游戏产品', icon: Package, href: '/admin/games/products' },
    ],
  },
  { id: 'accounts', label: '账号管理', icon: Shield, href: '/admin/accounts' },
  {
    id: 'forex',
    label: '外汇管理',
    icon: DollarSign,
    children: [
      { id: 'forex-cny-mmk', label: '人民币兑缅币', icon: DollarSign, href: '/admin/forex/cny-mmk' },
      { id: 'forex-mmk-cny', label: '缅币兑人民币', icon: DollarSign, href: '/admin/forex/mmk-cny' },
      { id: 'forex-usdt-cny', label: 'USDT兑人民币', icon: DollarSign, href: '/admin/forex/usdt-cny' },
      { id: 'forex-cny-usdt', label: '人民币兑USDT', icon: DollarSign, href: '/admin/forex/cny-usdt' },
      { id: 'forex-mmk-usdt', label: '缅币兑USDT', icon: DollarSign, href: '/admin/forex/mmk-usdt' },
      { id: 'forex-usdt-mmk', label: 'USDT兑缅币', icon: DollarSign, href: '/admin/forex/usdt-mmk' },
    ],
  },
  {
    id: 'operations',
    label: '运营管理',
    icon: Megaphone,
    children: [
      { id: 'ops-activity', label: '活动管理', icon: Megaphone, href: '/admin/operations/activity' },
      { id: 'ops-activity-detail', label: '活动明细', icon: FileText, href: '/admin/operations/activity-detail' },
      { id: 'ops-notice', label: '公告管理', icon: Bell, href: '/admin/operations/notice' },
      { id: 'ops-message', label: '系统消息', icon: Mail, href: '/admin/operations/message' },
      { id: 'ops-email', label: '邮件列表', icon: Mail, href: '/admin/operations/email' },
      { id: 'ops-support', label: '客服列表', icon: Users, href: '/admin/operations/support' },
      { id: 'ops-claim', label: '领取明细', icon: TrendingUp, href: '/admin/operations/claim' },
    ],
  },
  {
    id: 'media',
    label: '素材管理',
    icon: Image,
    children: [
      { id: 'media-game', label: '游戏素材', icon: Gamepad2, href: '/admin/media/game' },
      { id: 'media-product', label: '商品素材', icon: Package, href: '/admin/media/product' },
      { id: 'media-activity', label: '活动素材', icon: Megaphone, href: '/admin/media/activity' },
      { id: 'media-food', label: '外卖素材', icon: ShoppingBag, href: '/admin/media/food' },
    ],
  },
  {
    id: 'promotion',
    label: '推广管理',
    icon: TrendingUp,
    children: [
      { id: 'promo-users', label: '用户信息', icon: Users, href: '/admin/promotion/users' },
      { id: 'promo-invite', label: '邀请人数', icon: TrendingUp, href: '/admin/promotion/invite' },
      { id: 'promo-commission', label: '返佣明细', icon: Wallet, href: '/admin/promotion/commission' },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminData, setAdminData] = useState({
    id: 0,
    nickname: '管理员',
    username: '',
  });

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 自动展开当前菜单的父级
  useEffect(() => {
    const expandCurrentMenu = () => {
      for (const item of menuItems) {
        if (item.children?.some(child => pathname.startsWith(child.href || ''))) {
          setExpandedMenus(prev => {
            const newSet = new Set(prev);
            newSet.add(item.id);
            return newSet;
          });
          break;
        }
      }
    };
    expandCurrentMenu();
  }, [pathname]);

  // 获取管理员信息
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.id === 0 && userData.is_admin) {
            setAdminData({
              id: 0,
              nickname: '超级管理员',
              username: 'wysz88',
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {}
      }

      try {
        const response = await fetch('/api/user?action=profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setAdminData({
              id: userData.id,
              nickname: userData.nickname || userData.username,
              username: userData.username,
            });
            setIsLoading(false);
            return;
          }
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          router.push('/admin/login');
          return;
        }

        const result = await response.json();
        if (result.success && result.data) {
          setAdminData({
            id: result.data.id,
            nickname: result.data.nickname || result.data.username,
            username: result.data.username,
          });
        }
      } catch (error) {
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setAdminData({
            id: userData.id,
            nickname: userData.nickname || userData.username,
            username: userData.username,
          });
          setIsLoading(false);
          return;
        }
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  }, []);

  const isActive = useCallback((href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  }, [pathname]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      router.push('/admin/login');
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.id);
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <div key={item.id} className="relative">
        {item.href ? (
          <Link
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 ease-out
              group relative
              ${active
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }
              ${level > 0 ? 'ml-6 text-sm' : ''}
            `}
          >
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
            )}
            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
            {!sidebarCollapsed && (
              <span className="font-medium truncate">{item.label}</span>
            )}
            {hasChildren && !sidebarCollapsed && (
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            )}
          </Link>
        ) : (
          <button
            onClick={() => toggleMenu(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 ease-out
              group relative
              ${active
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }
              ${level > 0 ? 'ml-6 text-sm' : ''}
            `}
          >
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
            )}
            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
            {!sidebarCollapsed && (
              <>
                <span className="font-medium truncate">{item.label}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              </>
            )}
          </button>
        )}
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="mt-1 space-y-1 overflow-hidden">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f3f4f6' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f3f4f6' }}>
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold">管理后台</span>
          </Link>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 移动端侧边导航抽屉 */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileNav(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 overflow-y-auto"
            style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)' }}>
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold">菜单</span>
                <button
                  onClick={() => setShowMobileNav(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{adminData.nickname}</p>
                  <p className="text-white/60 text-sm">管理员</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map(item => renderMenuItem(item))}
            </nav>
          </div>
        </div>
      )}

      {/* PC端左侧固定侧边栏 - 深色主题 */}
      {!isMobile && (
        <aside
          className={`
            fixed left-0 top-0 bottom-0 z-40
            flex flex-col
            transition-all duration-300 ease-out
            ${sidebarCollapsed ? 'w-20' : 'w-64'}
          `}
          style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)' }}
        >
          {/* Logo 区域 */}
          <div className="p-4 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-white font-bold text-lg leading-tight">管理后台</p>
                  <p className="text-white/50 text-xs">wysz88.com</p>
                </div>
              )}
            </Link>
          </div>

          {/* 管理员信息区域 */}
          <div className="p-4 border-b border-white/10">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{adminData.nickname}</p>
                  <p className="text-white/40 text-xs">ID: {adminData.id}</p>
                </div>
              )}
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-3 overflow-y-auto admin-scroll space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* 底部操作区 */}
          <div className="p-3 border-t border-white/10 space-y-2">
            {/* 折叠按钮 */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-300 hover:bg-white/10 hover:text-white
                transition-all duration-200
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">收起菜单</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-red-400 hover:bg-red-500/20 hover:text-red-300
                transition-all duration-200
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">退出登录</span>}
            </button>
          </div>
        </aside>
      )}

      {/* 主内容区域 */}
      <main className={`
        flex-1 min-h-screen
        transition-all duration-300 ease-out
        ${isMobile ? 'pt-16' : sidebarCollapsed ? 'ml-20' : 'ml-64'}
      `}>
        <div className="p-4 md:p-6 lg:p-8 page-enter">
          {children}
        </div>
      </main>

      {/* 退出登录确认弹窗 - 带动画 */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">确认退出</h3>
              <p className="text-gray-500 mb-8">确定要退出管理后台吗？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-500/25"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
