'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'all', name: '全部分类', icon: '📦', href: '/shop' },
  { id: 'food', name: '同城外卖', icon: '🍜', href: '/food' },
  { id: 'errand', name: '同城跑腿', icon: '🏃', href: '/errand' },
  { id: 'taxi', name: '滴滴车', icon: '🚗', href: '/taxi' },
  { id: 'buy', name: '帮买帮送', icon: '📦', href: '/buy' },
  { id: 'live', name: '直播平台', icon: '📺', href: '/shop', expandable: true },
  { id: 'platform', name: '充值平台', icon: '💰', href: '/shop' },
  { id: 'vip', name: '会员充值', icon: '👑', href: '/shop' },
  { id: 'game', name: '游戏代充', icon: '🎮', href: '/games' },
  { id: 'phone', name: '话费充值', icon: '📱', href: '/recharge' },
  { id: 'points', name: '游戏点卡', icon: '💳', href: '/shop' },
  { id: 'video', name: '影音账号', icon: '🎬', href: '/shop' },
  { id: 'gameaccount', name: '游戏账号', icon: '🎯', href: '/coming-soon' },
  { id: 'secondhand', name: '二手商品', icon: '🔄', href: '/secondhand' },
  { id: 'proxy', name: '平台代购', icon: '🛒', href: '/proxy' },
];

// 直播平台子分类
const liveSubCategories = [
  { id: 'douyin', name: '抖音充值', icon: '🎵', href: '/shop' },
  { id: 'kuaishou', name: '快手充值', icon: '🎥', href: '/shop' },
  { id: 'momo', name: '陌陌直播', icon: '💬', href: '/shop' },
  { id: 'tantan', name: '探探充值', icon: '💕', href: '/shop' },
  { id: 'blued', name: 'BLUED', icon: '👬', href: '/shop' },
];

export default function LeftSidebar() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedLive, setExpandedLive] = useState(true);

  return (
    <aside className="sidebar-fixed hidden lg:block">
      <div className="p-3">
        <h3 className="text-sm font-bold text-text-primary mb-3 pb-2 border-b border-dark-border flex items-center gap-2">
          <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
          商品分类
        </h3>
        <nav className="space-y-0.5">
          {categories.map((cat) => (
            <div key={cat.id}>
              {cat.expandable ? (
                <button
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedLive(!expandedLive);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-orange-500/10 text-orange-500 font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  {expandedLive ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <Link
                  href={cat.href}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-orange-500/10 text-orange-500 font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              )}

              {/* 子分类 */}
              {cat.expandable && expandedLive && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {liveSubCategories.map((subCat) => (
                    <Link
                      key={subCat.id}
                      href={subCat.href}
                      onClick={() => setActiveCategory(subCat.id)}
                      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeCategory === subCat.id
                          ? 'bg-orange-500/10 text-orange-500 font-medium'
                          : 'text-text-muted hover:text-text-primary hover:bg-dark-card'
                      }`}
                    >
                      <span className="text-sm">{subCat.icon}</span>
                      <span>{subCat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Links */}
        <div className="mt-4 pt-4 border-t border-dark-border">
          <h4 className="text-xs font-medium text-text-muted mb-2 px-3">快捷链接</h4>
          <div className="space-y-0.5">
            <Link href="/user/orders" className="block px-3 py-2 text-sm text-text-secondary hover:text-orange-500 hover:bg-dark-card rounded-lg transition-colors">
              我的订单
            </Link>
            <Link href="/user" className="block px-3 py-2 text-sm text-text-secondary hover:text-orange-500 hover:bg-dark-card rounded-lg transition-colors">
              个人中心
            </Link>
            <Link href="/help" className="block px-3 py-2 text-sm text-text-secondary hover:text-orange-500 hover:bg-dark-card rounded-lg transition-colors">
              帮助中心
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
