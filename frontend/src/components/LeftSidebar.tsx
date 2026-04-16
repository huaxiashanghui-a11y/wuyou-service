'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/lib/i18n';

const categories = [
  { id: 'all', name: '全部分类', icon: '📦', href: '/shop' },
  { id: 'douyin', name: '抖音充值', icon: '🎵', href: '/shop' },
  { id: 'kuaishou', name: '快手充值', icon: '🎥', href: '/shop' },
  { id: 'bilibili', name: 'B站大会员', icon: '📺', href: '/shop' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', href: '/shop' },
  { id: 'momo', name: '陌陌直播', icon: '💬', href: '/shop' },
  { id: 'tantan', name: '探探充值', icon: '💕', href: '/shop' },
  { id: 'games', name: '游戏代充', icon: '🎮', href: '/games' },
  { id: 'recharge', name: '话费充值', icon: '📱', href: '/recharge' },
  { id: 'video', name: '视频音频', icon: '🎬', href: '/shop' },
  { id: 'live', name: '直播平台', icon: '📺', href: '/shop' },
  { id: 'gift', name: '礼品卡', icon: '🎁', href: '/shop' },
  { id: 'points', name: '游戏点卡', icon: '💳', href: '/shop' },
  { id: 'social', name: '社交账号', icon: '💬', href: '/coming-soon' },
  { id: 'gameid', name: '游戏ID平台', icon: '🎮', href: '/coming-soon' },
  { id: 'proxy', name: '代购平台', icon: '🛒', href: '/coming-soon' },
  { id: 'secondhand', name: '二手商品', icon: '🔄', href: '/coming-soon' },
];

export default function LeftSidebar() {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');

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
