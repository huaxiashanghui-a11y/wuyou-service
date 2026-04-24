'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '首页',
    icon: Home,
    href: '/admin',
  },
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
  {
    id: 'products',
    label: '产品管理',
    icon: Package,
    href: '/admin/products',
  },
  {
    id: 'orders',
    label: '订单管理',
    icon: FileText,
    href: '/admin/orders',
  },
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
      { id: 'fund-payment', label: '支付配置', icon: CreditCard, href: '/admin/funds/payment' },
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
  {
    id: 'accounts',
    label: '账号管理',
    icon: Shield,
    href: '/admin/accounts',
  },
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
  const [collapsedMenus, setCollapsedMenus] = useState<Set<string>>(new Set());
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

  // 获取管理员信息
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      // 首先检查是否为内置管理员（userId 为 0）
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.id === 0 && userData.is_admin) {
            // 内置管理员 - 不需要从API获取用户信息
            setAdminData({
              id: 0,
              nickname: '超级管理员',
              username: 'wysz88',
            });
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // 解析失败，继续尝试获取用户信息
        }
      }

      // 非内置管理员，从API获取用户信息
      try {
        const response = await fetch('/api/user?action=profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 即使 API 返回错误，也可能是临时的网络问题，不要直接重定向
        if (!response.ok) {
          console.warn('API 响应异常:', response.status);
          // 检查是否有存储的用户信息作为备用
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setAdminData({
                id: userData.id,
                nickname: userData.nickname || userData.username,
                username: userData.username,
              });
              setIsLoading(false);
              return;
            } catch (e) {
              // 解析备用数据失败
            }
          }
          // 如果没有备用数据，仍然重定向
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
        } else if (storedUser) {
          // API 返回 success=false，使用备用数据
          try {
            const userData = JSON.parse(storedUser);
            setAdminData({
              id: userData.id,
              nickname: userData.nickname || userData.username,
              username: userData.username,
            });
          } catch (e) {
            // 备用数据解析失败
          }
        }
      } catch (error) {
        console.error('获取管理员信息失败:', error);
        // 网络错误时，尝试使用存储的用户信息
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setAdminData({
              id: userData.id,
              nickname: userData.nickname || userData.username,
              username: userData.username,
            });
            setIsLoading(false);
            return;
          } catch (e) {
            // 备用数据解析失败
          }
        }
        // 如果无法获取用户信息，重定向
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const toggleMenu = (menuId: string) => {
    const newCollapsed = new Set(collapsedMenus);
    if (newCollapsed.has(menuId)) {
      newCollapsed.delete(menuId);
    } else {
      newCollapsed.add(menuId);
    }
    setCollapsedMenus(newCollapsed);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

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
    const isCollapsed = collapsedMenus.has(item.id);
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <div key={item.id}>
        {item.href ? (
          <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
              active
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleMenu(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
              active
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {hasChildren && (
              <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
            )}
          </button>
        )}
        {hasChildren && !isCollapsed && (
          <div className={`ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4`}>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 shadow-sm">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-800 font-semibold">管理后台</span>
          </Link>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 移动端侧边导航抽屉 */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileNav(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-800 font-semibold">菜单</span>
                <button
                  onClick={() => setShowMobileNav(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{adminData.nickname}</p>
                  <p className="text-gray-500 text-sm">管理员</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map(item => renderMenuItem(item))}
            </nav>
          </div>
        </div>
      )}

      {/* PC端左侧固定侧边栏 */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 flex flex-col shadow-sm">
          {/* Logo 区域 */}
          <div className="p-5 border-b border-gray-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-800 font-bold">管理后台</p>
                <p className="text-gray-400 text-xs">wysz88.com</p>
              </div>
            </Link>
          </div>

          {/* 管理员信息区域 */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium truncate">{adminData.nickname}</p>
                <p className="text-gray-400 text-xs">ID: {adminData.id}</p>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 overflow-y-auto space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* 底部操作区 */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </aside>
      )}

      {/* 主内容区域 */}
      <main className={`${isMobile ? 'pt-14' : 'ml-64'} min-h-screen`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* 退出登录确认弹窗 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">确认退出</h3>
              <p className="text-gray-500 text-sm">确定要退出管理后台吗？</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}