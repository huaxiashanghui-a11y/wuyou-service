'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  Wallet,
  FileText,
  Gift,
  TrendingUp,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Bell,
  Settings
} from 'lucide-react';

type NavItem = {
  id: string;
  icon: typeof User;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: '首页概览', href: '/user' },
  { id: 'profile', icon: User, label: '个人信息', href: '/user/profile' },
  { id: 'wallet', icon: Wallet, label: '我的钱包', href: '/user/wallet' },
  { id: 'orders', icon: FileText, label: '我的订单', href: '/user/orders' },
  { id: 'coupons', icon: Gift, label: '我的优惠券', href: '/user/coupons' },
  { id: 'promotion', icon: TrendingUp, label: '我的推广', href: '/user/promotion' },
  { id: 'security', icon: Shield, label: '账户安全', href: '/user/security' },
];

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState({
    nickname: '用户',
    avatar: null as string | null,
    balance: '0.00',
    points: 0,
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

  // 获取当前激活的导航项
  const getActiveItem = () => {
    const current = navItems.find(item => pathname === item.href);
    return current?.id || 'home';
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-account-bg">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-account-card border-b border-account-border z-50 flex items-center justify-between px-4">
          <Link href="/user" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-account-primary to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">无</span>
            </div>
            <span className="text-white font-semibold">个人中心</span>
          </Link>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 text-white hover:bg-account-border rounded-lg transition-colors"
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
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-account-card animate-slide-in">
            {/* 用户信息头部 */}
            <div className="p-5 border-b border-account-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold">菜单</span>
                <button
                  onClick={() => setShowMobileNav(false)}
                  className="p-2 text-account-secondary hover:bg-account-border rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-account-primary to-blue-700 flex items-center justify-center">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-xl">{userData.nickname.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{userData.nickname}</p>
                  <p className="text-account-secondary text-sm">ID: 100001</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-account-bg rounded-lg p-3 text-center">
                  <p className="text-account-primary font-bold">¥{userData.balance}</p>
                  <p className="text-account-secondary text-xs">余额</p>
                </div>
                <div className="flex-1 bg-account-bg rounded-lg p-3 text-center">
                  <p className="text-account-gold font-bold">{userData.points}</p>
                  <p className="text-account-secondary text-xs">积分</p>
                </div>
              </div>
            </div>

            {/* 导航列表 */}
            <nav className="p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setShowMobileNav(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1 transition-all ${
                      isActive
                        ? 'bg-account-primary/20 text-account-primary'
                        : 'text-account-secondary hover:bg-account-bg hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            {/* 退出登录 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-account-border">
              <button
                onClick={() => {
                  setShowMobileNav(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-account-bg text-account-danger rounded-xl hover:bg-account-danger/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">退出登录</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PC端左侧固定侧边栏 */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-account-card border-r border-account-border z-40 flex flex-col">
          {/* Logo 区域 */}
          <div className="p-5 border-b border-account-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-account-primary to-blue-700 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-xl">无</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg">无忧服务</p>
                <p className="text-account-secondary text-sm">个人中心</p>
              </div>
            </Link>
          </div>

          {/* 用户信息区域 */}
          <div className="p-5 border-b border-account-border">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-account-primary to-blue-700 flex items-center justify-center">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-xl">{userData.nickname.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{userData.nickname}</p>
                <p className="text-account-secondary text-sm">ID: 100001</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <div className="flex-1 bg-account-bg rounded-xl p-3 text-center">
                <p className="text-account-primary font-bold text-lg">¥{userData.balance}</p>
                <p className="text-account-secondary text-xs">余额</p>
              </div>
              <div className="flex-1 bg-account-bg rounded-xl p-3 text-center">
                <p className="text-account-gold font-bold text-lg">{userData.points}</p>
                <p className="text-account-secondary text-xs">积分</p>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-account-primary/20 to-transparent text-account-primary border-l-2 border-account-primary'
                      : 'text-account-secondary hover:bg-account-bg hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 底部操作区 */}
          <div className="p-4 border-t border-account-border">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-account-bg text-account-danger rounded-xl hover:bg-account-danger/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">退出登录</span>
            </button>
          </div>
        </aside>
      )}

      {/* 主内容区域 */}
      <main className={`${isMobile ? 'pt-16' : 'ml-64'} min-h-screen`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* 退出登录确认弹窗 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-account-card rounded-2xl p-6 w-full max-w-sm animate-fade-in border border-account-border">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-account-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-account-danger" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">确认退出</h3>
              <p className="text-account-secondary">确定要退出登录吗？</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-account-bg text-white rounded-xl hover:bg-account-border transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-account-danger text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
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
