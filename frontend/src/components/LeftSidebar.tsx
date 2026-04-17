'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const categories = [
  { id: 'all', name: '全部分类', icon: '📦', href: '/shop' },
  { id: 'bilibili', name: 'B站大会员', icon: '📺', href: '/shop' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', href: '/shop' },
  { id: 'games', name: '游戏代充', icon: '🎮', href: '/games' },
  { id: 'recharge', name: '话费充值', icon: '📱', href: '/recharge' },
  { id: 'video', name: '视频音频', icon: '🎬', href: '/shop' },
  { id: 'social', name: '社交账号', icon: '💬', href: '/coming-soon' },
  { id: 'gameaccount', name: '游戏账号', icon: '🎮', href: '/coming-soon' },
  { id: 'proxy', name: '代购平台', icon: '🛒', href: '/coming-soon' },
  { id: 'secondhand', name: '二手商品', icon: '🔄', href: '/coming-soon' },
];

// 直播平台子分类
const liveSubCategories = [
  { id: 'momo', name: '陌陌直播', icon: '💬', href: '/shop' },
  { id: 'douyin', name: '抖音充值', icon: '🎵', href: '/shop' },
  { id: 'kuaishou', name: '快手充值', icon: '🎥', href: '/shop' },
  { id: 'tantan', name: '探探充值', icon: '💕', href: '/shop' },
];

export default function LeftSidebar() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedLive, setExpandedLive] = useState(true);

  return (
    <aside className="sidebar-fixed hidden lg:block">
      <div className="p-4">
        <h3 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-dark-border">
          商品分类
        </h3>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                activeCategory === cat.id
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}

          {/* 直播平台 - 可展开 */}
          <div>
            <button
              onClick={() => setExpandedLive(!expandedLive)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
                activeCategory === 'live'
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📺</span>
                <span>直播平台</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedLive ? 'rotate-180' : ''}`} />
            </button>

            {/* 子分类 */}
            {expandedLive && (
              <div className="ml-4 mt-1 space-y-1">
                {liveSubCategories.map((subCat) => (
                  <Link
                    key={subCat.id}
                    href={subCat.href}
                    onClick={() => setActiveCategory(subCat.id)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeCategory === subCat.id
                        ? 'bg-accent/10 text-accent font-medium'
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

          {/* 礼品卡 */}
          <Link
            href="/shop"
            onClick={() => setActiveCategory('gift')}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              activeCategory === 'gift'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
            }`}
          >
            <span className="text-base">🎁</span>
            <span>礼品卡</span>
          </Link>

          {/* 游戏点卡 */}
          <Link
            href="/shop"
            onClick={() => setActiveCategory('points')}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              activeCategory === 'points'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
            }`}
          >
            <span className="text-base">💳</span>
            <span>游戏点卡</span>
          </Link>
        </nav>

        {/* Quick Links */}
        <div className="mt-6 pt-4 border-t border-dark-border">
          <h4 className="text-xs font-medium text-text-muted mb-3">快捷链接</h4>
          <div className="space-y-1">
            <Link href="/user/orders" className="block px-3 py-2 text-sm text-text-secondary hover:text-accent hover:bg-dark-card rounded-lg transition-colors">
              我的订单
            </Link>
            <Link href="/user" className="block px-3 py-2 text-sm text-text-secondary hover:text-accent hover:bg-dark-card rounded-lg transition-colors">
              个人中心
            </Link>
            <Link href="/help" className="block px-3 py-2 text-sm text-text-secondary hover:text-accent hover:bg-dark-card rounded-lg transition-colors">
              帮助中心
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
