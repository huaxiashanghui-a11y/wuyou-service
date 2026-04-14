'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingCart, MessageCircle, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartDrawer from './CartDrawer';

const categories = [
  '首页', '点卡', '淘宝', '微信游戏', '抖音', 'Q币', '苹果充值',
  '陌陌直播', 'Mycard', '直播平台', '游戏代充', '台服/港服', '交友/陪玩'
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('首页');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        {/* Top Navigation Bar */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">无</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold">无忧服务</div>
                  <div className="text-[10px] text-gray-400">WORRY-FREE SERVICE</div>
                </div>
              </Link>

              {/* Search Bar - Center */}
              <div className="flex-1 max-w-xl mx-4 hidden md:flex">
                <div className="flex w-full">
                  <input
                    type="text"
                    placeholder="搜索商品..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white text-gray-800 rounded-l-lg text-sm focus:outline-none"
                  />
                  <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-r-lg transition-colors">
                    搜索
                  </button>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Language Dropdown */}
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="flex items-center gap-1 text-sm hover:text-gray-300"
                  >
                    <Globe className="w-4 h-4" />
                    <span>简体中文</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showLangDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-32 z-50">
                      <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left">简体中文</button>
                      <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left">English</button>
                    </div>
                  )}
                </div>

                {/* Currency Dropdown */}
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    className="flex items-center gap-1 text-sm hover:text-gray-300"
                  >
                    <span>USD</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showCurrencyDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-24 z-50">
                      <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left">USD</button>
                      <button className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left">CNY</button>
                    </div>
                  )}
                </div>

                {/* Login / Register */}
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login" className="text-sm hover:text-gray-300">登录</Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/register" className="text-sm hover:text-gray-300">注册</Link>
                </div>

                {/* Customer Service */}
                <button className="p-2 hover:bg-gray-800 rounded transition-colors" title="24小时在线客服">
                  <MessageCircle className="w-5 h-5" />
                </button>

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden pb-3">
              <div className="flex">
                <input
                  type="text"
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white text-gray-800 rounded-l-lg text-sm focus:outline-none"
                />
                <button className="px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-r-lg">
                  搜索
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12 overflow-x-auto">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={cat === '首页' ? '/' : `/category/${encodeURIComponent(cat)}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'text-purple-600 font-medium'
                      : 'text-gray-700 hover:text-purple-600'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="p-4 space-y-2">
              <Link href="/login" className="block py-2 text-gray-700 hover:text-purple-600">登录</Link>
              <Link href="/register" className="block py-2 text-gray-700 hover:text-purple-600">注册</Link>
              <div className="flex gap-4 pt-2 border-t">
                <button className="text-sm">简体中文</button>
                <button className="text-sm">English</button>
                <button className="text-sm">USD</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
