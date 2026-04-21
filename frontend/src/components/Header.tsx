'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MessageCircle, Menu, X, ChevronDown, Globe, User, Bell, Gift } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  // Close lang dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="nav-fixed">
        {/* Top Bar - Logo, Search, Actions */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">WY</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-text-primary">无忧服务</div>
                <div className="text-[10px] text-text-muted">WY.ai</div>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                {searchQuery && (
                  <Link
                    href={`/shop?search=${searchQuery}`}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500 hover:text-orange-400"
                  >
                    搜索
                  </Link>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language/Currency Selector */}
              <div ref={langDropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden lg:inline">中文</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-dark-nav border border-dark-border rounded-xl shadow-2xl p-2 z-50 animate-slide-down">
                    <button className="w-full text-left px-4 py-2 text-sm text-text-primary bg-accent/10 rounded-lg">
                      中文
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg">
                      English
                    </button>
                  </div>
                )}
              </div>

              {/* Login/Register */}
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                  登录
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium">
                  注册
                </Link>
              </div>

              {/* User Center */}
              <Link href="/user" className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors hidden sm:block">
                <User className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索商品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            </div>
          </div>
        </div>

        {/* Navigation Bar - Below Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 hidden lg:block">
          <div className="container-custom">
            <div className="flex items-center gap-1 py-2">
              {[
                { id: 'home', name: '首页', href: '/' },
                { id: 'hot', name: '热门产品', href: '/shop' },
                { id: 'delivery', name: '外卖平台', href: '/coming-soon' },
                { id: 'game', name: '游戏直充', href: '/games' },
                { id: 'recharge', name: '话费充值', href: '/recharge' },
                { id: 'sim', name: '海外手机卡', href: '/coming-soon' },
                { id: 'forex', name: '货币外汇', href: '/forex' },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="px-5 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-dark-border bg-dark-nav">
            <div className="container-custom py-4">
              <nav className="flex flex-col gap-1">
                {[
                  { id: 'home', name: '首页', href: '/' },
                  { id: 'hot', name: '热门产品', href: '/shop' },
                  { id: 'delivery', name: '外卖平台', href: '/coming-soon' },
                  { id: 'game', name: '游戏直充', href: '/games' },
                  { id: 'recharge', name: '话费充值', href: '/recharge' },
                  { id: 'sim', name: '海外手机卡', href: '/coming-soon' },
                  { id: 'forex', name: '货币外汇', href: '/forex' },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                <Link href="/login" className="flex-1 py-2 text-center text-sm border border-dark-border text-text-secondary rounded hover:bg-dark-card transition-colors">
                  登录
                </Link>
                <Link href="/register" className="flex-1 py-2 text-center text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
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
                className="p-2 text-text-muted hover:text-text-primary hover:bg-dark-card rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
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
