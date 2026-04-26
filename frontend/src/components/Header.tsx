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
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const deliveryDropdownRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  // 外卖平台菜单项
  const deliveryMenuItems = [
    { id: 'waimai', name: '同城外卖', icon: '🍜', href: '/coming-soon' },
    { id: 'paotui', name: '同城跑腿', icon: '🏃', href: '/coming-soon' },
    { id: 'taxi', name: '滴滴车', icon: '🚗', href: '/coming-soon' },
    { id: 'bangmai', name: '帮买帮送', icon: '📦', href: '/coming-soon' },
  ];

  // Close lang dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
      if (deliveryDropdownRef.current && !deliveryDropdownRef.current.contains(event.target as Node)) {
        setShowDeliveryDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="nav-fixed" style={{ backgroundColor: '#75092D' }}>
        {/* Top Bar - Logo, Search, Actions */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1447E6' }}>
                <span className="text-white font-bold text-sm">WY</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold" style={{ color: '#FAFAFA' }}>无忧服务</div>
                <div className="text-[10px]" style={{ color: '#FAFAFA', opacity: 0.7 }}>WY.ai</div>
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
                  className="w-full rounded-full py-2 pl-10 pr-4 text-sm bg-white border-0 focus:outline-none transition-colors"
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
                  className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors"
                  style={{ color: '#FAFAFA' }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden lg:inline">中文</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-40 rounded-xl shadow-2xl p-2 z-50 animate-slide-down" style={{ backgroundColor: '#FFFFFF', border: '1px solid #e5e7eb' }}>
                    <button className="w-full text-left px-4 py-2 text-sm rounded-lg" style={{ color: '#1447E6' }}>
                      中文
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm rounded-lg transition-colors" style={{ color: '#333' }}>
                      English
                    </button>
                  </div>
                )}
              </div>

              {/* Login/Register */}
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/login" className="px-3 py-1.5 text-sm transition-colors" style={{ color: '#FAFAFA' }}>
                  登录
                </Link>
                <Link href="/register" className="px-3 py-1.5 text-sm text-white rounded-lg transition-colors font-medium" style={{ backgroundColor: '#1447E6' }}>
                  注册
                </Link>
              </div>

              {/* User Center */}
              <Link href="/user" className="p-2 rounded-lg transition-colors hidden sm:block" style={{ color: '#FAFAFA' }}>
                <User className="w-5 h-5" />
              </Link>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: '#FAFAFA' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center" style={{ backgroundColor: '#1447E6' }}>
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#FAFAFA' }}
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
        <div className="hidden lg:block" style={{ backgroundColor: '#1447E6' }}>
          <div className="container-custom">
            <div className="flex items-center gap-1 py-2">
              <Link href="/" className="px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>首页</Link>
              <Link href="/shop" className="px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>热门产品</Link>
              <div ref={deliveryDropdownRef} className="relative">
                <button onClick={() => setShowDeliveryDropdown(!showDeliveryDropdown)} onMouseEnter={() => setShowDeliveryDropdown(true)} className="flex items-center gap-1 px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>
                  外卖平台<ChevronDown className={`w-3 h-3 transition-transform ${showDeliveryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDeliveryDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-48 rounded-xl shadow-2xl p-2 z-50 animate-slide-down" style={{ backgroundColor: '#FFFFFF', border: '1px solid #e5e7eb' }}>
                    {deliveryMenuItems.map((item) => (
                      <Link key={item.id} href={item.href} onClick={() => setShowDeliveryDropdown(false)} className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#333' }}>
                        <span className="text-xl">{item.icon}</span><span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/games" className="px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>游戏直充</Link>
              <Link href="/recharge" className="px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>话费充值</Link>
              <Link href="/coming-soon" className="px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>海外手机卡</Link>
              <Link href="/forex" className="px-5 py-2 text-sm rounded-lg transition-colors font-medium whitespace-nowrap" style={{ color: '#FAFAFA' }}>货币外汇</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t" style={{ backgroundColor: '#75092D', borderColor: '#5a0730' }}>
            <div className="container-custom py-4">
              <nav className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>首页</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>热门产品</Link>
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between text-sm" style={{ color: '#FAFAFA' }}>
                    <span>外卖平台</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDeliveryDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showDeliveryDropdown && (
                    <div className="mt-2 pl-4 space-y-1">
                      {deliveryMenuItems.map((item) => (
                        <Link key={item.id} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-sm transition-colors" style={{ color: '#FAFAFA', opacity: 0.8 }}>
                          <span>{item.icon}</span><span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/games" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>游戏直充</Link>
                <Link href="/recharge" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>话费充值</Link>
                <Link href="/coming-soon" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>海外手机卡</Link>
                <Link href="/forex" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm rounded-lg transition-colors" style={{ color: '#FAFAFA' }}>货币外汇</Link>
              </nav>
              <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#5a0730' }}>
                <Link href="/login" className="flex-1 py-2 text-center text-sm border rounded transition-colors" style={{ borderColor: '#FAFAFA', color: '#FAFAFA' }}>登录</Link>
                <Link href="/register" className="flex-1 py-2 text-center text-sm text-white rounded transition-colors" style={{ backgroundColor: '#1447E6' }}>注册</Link>
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
