'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CategoryLayoutProps {
  children: React.ReactNode;
  accentColor: string;
  title: string;
}

const categories = [
  { id: 'all', name: '全部分类', icon: '📦', href: '/shop' },
  { id: 'live', name: '直播平台', icon: '📺', href: '/shop' },
  { id: 'platform', name: '充值平台', icon: '💰', href: '/shop' },
  { id: 'vip', name: '会员充值', icon: '👑', href: '/shop' },
  { id: 'game', name: '游戏代充', icon: '🎮', href: '/games' },
  { id: 'phone', name: '话费充值', icon: '📱', href: '/recharge' },
  { id: 'points', name: '游戏点卡', icon: '💳', href: '/shop' },
  { id: 'video', name: '影音账号', icon: '🎬', href: '/shop' },
  { id: 'gameaccount', name: '游戏账号', icon: '🎯', href: '/coming-soon' },
  { id: 'proxy', name: '代购平台', icon: '🛒', href: '/coming-soon' },
  { id: 'secondhand', name: '二手商品', icon: '🔄', href: '/coming-soon' },
];

export default function CategoryLayout({ children, accentColor, title }: CategoryLayoutProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedLive, setExpandedLive] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header placeholder - same as home page */}
      <div className="h-14 bg-dark-nav border-b border-dark-border"></div>

      {/* Main Layout */}
      <div className="flex flex-1 pt-14">
        {/* Left Sidebar */}
        <aside className="sidebar-fixed hidden lg:block">
          <div className="p-3">
            <h3 className="text-sm font-bold text-text-primary mb-3 pb-2 border-b border-dark-border flex items-center gap-2">
              <span className="w-1 h-5 rounded-full" style={{ backgroundColor: accentColor }}></span>
              商品分类
            </h3>
            <nav className="space-y-0.5">
              {categories.map((cat) => (
                <div key={cat.id}>
                  {cat.id === 'live' ? (
                    <>
                      <button
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setExpandedLive(!expandedLive);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
                          activeCategory === cat.id
                            ? 'text-white font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                        }`}
                        style={activeCategory === cat.id ? { backgroundColor: `${accentColor}20`, color: accentColor } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        {expandedLive ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      {expandedLive && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {['抖音充值', '快手充值', '陌陌直播', '探探充值'].map((item, idx) => (
                            <Link
                              key={idx}
                              href="/shop"
                              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-text-muted hover:text-text-primary hover:bg-dark-card transition-colors"
                            >
                              <span className="text-sm">{['🎵', '🎥', '💬', '💕'][idx]}</span>
                              <span>{item}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={cat.href}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        activeCategory === cat.id
                          ? 'text-white font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                      }`}
                      style={activeCategory === cat.id ? { backgroundColor: `${accentColor}20`, color: accentColor } : {}}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Quick Links */}
            <div className="mt-4 pt-4 border-t border-dark-border">
              <h4 className="text-xs font-medium text-text-muted mb-2 px-3">快捷链接</h4>
              <div className="space-y-0.5">
                <Link href="/user/orders" className="block px-3 py-2 text-sm text-text-secondary hover:text-orange-500 rounded-lg transition-colors">
                  我的订单
                </Link>
                <Link href="/user" className="block px-3 py-2 text-sm text-text-secondary hover:text-orange-500 rounded-lg transition-colors">
                  个人中心
                </Link>
                <Link href="/help" className="block px-3 py-2 text-sm text-text-secondary hover:text-orange-500 rounded-lg transition-colors">
                  帮助中心
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[200px] min-h-screen">
          <div className="container-custom py-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-dark-nav border-t border-dark-border mt-auto">
      <div className="border-t border-dark-border bg-dark-primary/50">
        <div className="container-custom py-4">
          <div className="text-center text-text-muted text-sm">
            <p>© {new Date().getFullYear()} 无忧服务 版权所有</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
