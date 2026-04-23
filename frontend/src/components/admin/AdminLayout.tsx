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
  ChevronRight,
  Home,
  Shield,
  Loader2
} from 'lucide-react';

type NavItem = {
  id: string;
  icon: typeof Users;
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: 'dashboard', icon: Home, label: '后台概览', href: '/admin' },
  { id: 'merchants', icon: Store, label: '商家审核', href: '/admin/merchants' },
  { id: 'users', icon: Users, label: '用户管理', href: '/admin/users' },
  { id: 'orders', icon: FileText, label: '订单管理', href: '/admin/orders' },
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
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/user?action=profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login');
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
        console.error('获取管理员信息失败:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

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
      router.push('/');
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-account-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-account-primary animate-spin mx-auto mb-4" />
          <p className="text-account-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-account-bg">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-account-card border-b border-account-border z-50 flex items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold">管理后台</span>
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
            {/* 头部 */}
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{adminData.nickname}</p>
                  <p className="text-account-secondary text-sm">管理员</p>
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
                        ? 'bg-purple-500/20 text-purple-400'
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
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">管理后台</p>
                <p className="text-account-secondary text-sm">wysz88.com</p>
              </div>
            </Link>
          </div>

          {/* 管理员信息区域 */}
          <div className="p-5 border-b border-account-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{adminData.nickname}</p>
                <p className="text-account-secondary text-sm">ID: {adminData.id}</p>
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
                      ? 'bg-gradient-to-r from-purple-500/20 to-transparent text-purple-400 border-l-2 border-purple-500'
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
              <p className="text-account-secondary">确定要退出管理后台吗？</p>
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