'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/i18n';
import {
  User,
  FileText,
  Shield,
  Gift,
  HelpCircle,
  LogOut,
  Home,
  CheckCircle
} from 'lucide-react';

type ActiveTab = 'account' | 'orders' | 'verification' | 'coupons' | 'help';

interface UserLayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
}

const navItems = [
  { id: 'account' as ActiveTab, icon: User, labelKey: 'user.account' },
  { id: 'orders' as ActiveTab, icon: FileText, label: '我的订单' },
  { id: 'verification' as ActiveTab, icon: Shield, label: '我的认证' },
  { id: 'coupons' as ActiveTab, icon: Gift, label: '我的优惠券' },
  { id: 'help' as ActiveTab, icon: HelpCircle, label: '帮助中心' },
];

const navLabels: Record<ActiveTab, { zh: string; en: string; my: string }> = {
  account: { zh: '我的账户', en: 'My Account', my: 'ကျွန်ုပ်၏အကောင့်' },
  orders: { zh: '我的订单', en: 'My Orders', my: 'ကျွန်ုပ်၏အမှာစာများ' },
  verification: { zh: '我的认证', en: 'My Verification', my: 'ကျွန်ုပ်၏အတည်ပြုချက်' },
  coupons: { zh: '我的优惠券', en: 'My Coupons', my: 'ကျွန်ုပ်၏လျှော့စျေးစင်တင်' },
  help: { zh: '帮助中心', en: 'Help Center', my: 'အကူအညီစင်တာ' },
};

export default function UserLayout({ children, activeTab }: UserLayoutProps) {
  const router = useRouter();
  const { language, t } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getNavLabel = (item: typeof navItems[0]) => {
    if (item.label) {
      // Custom labels for some items
      if (item.id === 'account') return navLabels.account[language] || navLabels.account.zh;
      return item.label;
    }
    return navLabels[item.id][language] || navLabels[item.id].zh;
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Simulate logout
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10">🎮</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10">🖱️</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10">🤖</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10">▶️</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="glass rounded-2xl p-4 sticky top-8">
              {/* Logo */}
              <div className="text-center pb-4 border-b border-gray-100">
                <Link href="/" className="inline-flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">无</span>
                  </div>
                </Link>
                <div className="mt-2 text-sm font-medium text-gray-800">
                  {language === 'zh' ? '我的账户' : language === 'my' ? 'ကျွန်ုပ်၏အကောင့်' : 'My Account'}
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/user/${item.id === 'account' ? '' : item.id}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-200'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      <span className="font-medium text-sm">{getNavLabel(item)}</span>
                      {isActive && <CheckCircle className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-4 border-t border-gray-100 pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">
                    {language === 'zh' ? '退出登录' : language === 'my' ? 'ထွက်မည်' : 'Logout'}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            {/* Return to Home Button */}
            <div className="flex justify-end mb-4">
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl hover:from-orange-600 hover:to-orange-500 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                {language === 'zh' ? '返回首页' : language === 'my' ? 'ပင်မသို့ပြန်သွားမည်' : 'Back to Home'}
              </Link>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {language === 'zh' ? '确认退出' : language === 'my' ? 'ထွက်ခွင့်အတည်ပြုမည်' : 'Confirm Logout'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'zh' ? '确定要退出登录吗？' : language === 'my' ? 'ထွက်မှာသေချာပါသလား?' : 'Are you sure you want to logout?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {language === 'zh' ? '取消' : language === 'my' ? 'မလုပ်' : 'Cancel'}
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl hover:from-red-600 hover:to-red-500 transition-colors font-medium"
              >
                {language === 'zh' ? '确认退出' : language === 'my' ? 'ထွက်မည်' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
