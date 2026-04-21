'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Wallet,
  User,
  FileText,
  Headphones,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
  X
} from 'lucide-react';

type NavItem = {
  id: string;
  icon: typeof Home;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: '首页', href: '/user' },
  { id: 'wallet', icon: Wallet, label: '钱包充值', href: '/user/wallet' },
  { id: 'profile', icon: User, label: '个人资料', href: '/user/profile' },
  { id: 'orders', icon: FileText, label: '订单管理', href: '/user/orders' },
  { id: 'service', icon: Headphones, label: '客服中心', href: '/user/service' },
  { id: 'stats', icon: BarChart3, label: '数据统计', href: '/user/stats' },
  { id: 'security', icon: Shield, label: '账户安全', href: '/user/security' },
  { id: 'settings', icon: Settings, label: '设置', href: '/user/settings' },
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

  // 检测是否为移动端
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
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#1e1e1e] border-b border-[#333] z-50 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">无</span>
            </div>
            <span className="text-white font-medium">个人中心</span>
          </Link>
          <button
            onClick={() => setShowMobileNav(true)}
            className="p-2 text-white hover:bg-[#333] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 移动端侧边导航抽屉 */}
      {showMobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileNav(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#1e1e1e] animate-slide-in">
            {/* 用户信息头部 */}
            <div className="p-4 border-b border-[#333]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold">优</span>
                </div>
                <div>
                  <p className="text-white font-medium">无忧用户</p>
                  <p className="text-[#888] text-sm">ID: 51966932</p>
                </div>
              </div>
              <div className="mt-3 flex gap-3">
                <div className="flex-1 bg-[#252525] rounded-lg p-2 text-center">
                  <p className="text-orange-500 font-bold">¥1,280.00</p>
                  <p className="text-[#888] text-xs">余额</p>
                </div>
                <div className="flex-1 bg-[#252525] rounded-lg p-2 text-center">
                  <p className="text-orange-500 font-bold">580</p>
                  <p className="text-[#888] text-xs">积分</p>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-500'
                        : 'text-[#ccc] hover:bg-[#252525] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 退出登录 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333]">
              <button
                onClick={() => {
                  setShowMobileNav(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#252525] text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
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
        <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[#1e1e1e] border-r border-[#333] z-40 flex flex-col">
          {/* Logo 区域 */}
          <div className="p-4 border-b border-[#333]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">无</span>
              </div>
              <div>
                <p className="text-white font-bold">无忧服务</p>
                <p className="text-[#888] text-xs">个人中心</p>
              </div>
            </Link>
          </div>

          {/* 用户信息区域 */}
          <div className="p-4 border-b border-[#333]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold">优</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">无忧用户</p>
                <p className="text-[#888] text-xs">ID: 51966932</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-[#252525] rounded-lg p-2 text-center">
                <p className="text-orange-500 font-bold text-sm">¥1,280</p>
                <p className="text-[#888] text-xs">余额</p>
              </div>
              <div className="bg-[#252525] rounded-lg p-2 text-center">
                <p className="text-orange-500 font-bold text-sm">580</p>
                <p className="text-[#888] text-xs">积分</p>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-500 border-l-2 border-orange-500'
                      : 'text-[#ccc] hover:bg-[#252525] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 底部操作区 */}
          <div className="p-4 border-t border-[#333]">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#252525] text-[#ccc] rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">退出登录</span>
            </button>
          </div>
        </aside>
      )}

      {/* 主内容区域 */}
      <main className={`${isMobile ? 'pt-14' : 'ml-56'} min-h-screen`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* 退出登录确认弹窗 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252525] rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">确认退出</h3>
              <p className="text-[#ccc] text-sm">确定要退出登录吗？</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-[#333] text-white rounded-xl hover:bg-[#444] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
