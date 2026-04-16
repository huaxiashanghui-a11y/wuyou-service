'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MessageCircle, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useApp } from '@/lib/i18n';
import CartDrawer from './CartDrawer';

const navItems = [
  { id: 'home', name: '首页', href: '/' },
  { id: 'shop', name: '产品', href: '/shop' },
  { id: 'games', name: '游戏充值', href: '/games' },
  { id: 'recharge', name: '话费充值', href: '/recharge' },
  { id: 'forex', name: '无忧外汇', href: '/forex' },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { language } = useApp();
  const totalItems = getTotalItems();

  return (
    <>
      {/* Fixed Top Navigation */}
      <header className="nav-fixed">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">无</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-text-primary">无忧服务</div>
                <div className="text-[10px] text-text-muted">WORRY-FREE SERVICE</div>
              </div>
            </Link>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    activeNav === item.id
                      ? 'text-accent font-medium bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded transition-colors"
                title="搜索"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Service */}
              <button
                onClick={() => setShowServiceModal(true)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded transition-colors"
                title="客服"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Actions */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <Link href="/login" className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  登录
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-sm bg-accent hover:bg-accent-hover text-white rounded transition-colors">
                  注册
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="py-3 border-t border-dark-border animate-slide-down">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-dark flex-1"
                  autoFocus
                />
                <Link
                  href={`/shop?search=${searchQuery}`}
                  className="btn-primary"
                  onClick={() => setShowSearch(false)}
                >
                  搜索
                </Link>
              </div>
              {searchQuery && (
                <div className="mt-2 text-sm text-text-muted">
                  按回车搜索 &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-dark-border bg-dark-nav">
            <div className="container-custom py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveNav(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 text-sm rounded transition-colors ${
                      activeNav === item.id
                        ? 'text-accent font-medium bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                <Link href="/login" className="flex-1 py-2 text-center text-sm border border-dark-border text-text-secondary rounded hover:bg-dark-card transition-colors">
                  登录
                </Link>
                <Link href="/register" className="flex-1 py-2 text-center text-sm bg-accent text-white rounded hover:bg-accent-hover transition-colors">
                  注册
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Customer Service Modal */}
      {showServiceModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowServiceModal(false);
          }}
        >
          <div className="bg-dark-nav border border-dark-border rounded-xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">在线客服</h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="p-2 text-text-muted hover:text-text-primary hover:bg-dark-card rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* WeChat */}
              <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">微信客服</div>
                  <div className="text-sm text-text-muted">工作时间：9:00-24:00</div>
                </div>
                <button className="btn-buy text-sm">咨询</button>
              </div>

              {/* QQ */}
              <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🐧</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">QQ客服</div>
                  <div className="text-sm text-text-muted">QQ号：88888888</div>
                </div>
                <button className="btn-buy text-sm">咨询</button>
              </div>

              {/* Telegram */}
              <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
                <div className="w-12 h-12 bg-sky-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✈️</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">Telegram</div>
                  <div className="text-sm text-text-muted">@wuyou_service</div>
                </div>
                <button className="btn-buy text-sm">咨询</button>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-dark-card rounded-lg">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">邮件支持</div>
                  <div className="text-sm text-text-muted">support@wuyou.com</div>
                </div>
                <button className="btn-primary text-sm">发送</button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-border text-center text-sm text-text-muted">
              遇到问题？我们随时为您服务
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
