'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MessageCircle, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useApp } from '@/lib/i18n';
import CartDrawer from './CartDrawer';

const categories = [
  '首页', '点卡', '淘宝', '微信游戏', '抖音', 'Q币', '苹果充值',
  '陌陌直播', 'Mycard', '直播平台', '游戏代充', '台服/港服', '交友/陪玩'
];

const serviceCategories = [
  { name: '直播平台', icon: '📺', color: 'bg-orange-500' },
  { name: '平台点卡', icon: '💳', color: 'bg-purple-500' },
  { name: '游戏充值', icon: '🎮', color: 'bg-orange-500' },
  { name: '视频音频', icon: '🎬', color: 'bg-teal-500' },
  { name: '陪玩陪聊', icon: '🎯', color: 'bg-pink-500' },
  { name: '语音交友', icon: '🎤', color: 'bg-pink-400' },
  { name: '生活日常', icon: '💝', color: 'bg-blue-400' },
  { name: '社交平台', icon: '💬', color: 'bg-green-500' },
  { name: '文学动漫', icon: '📚', color: 'bg-yellow-500' },
  { name: '加速工具', icon: '🔔', color: 'bg-orange-400' },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('首页');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, toggleCart } = useCartStore();
  const { t, language, setLanguage, currency, setCurrency } = useApp();
  const totalItems = getTotalItems();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: 'zh' | 'en') => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const handleCurrencyChange = (curr: 'USD' | 'CNY' | 'MMK') => {
    setCurrency(curr);
    setShowCurrencyDropdown(false);
  };

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
                    placeholder={t('nav.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white text-gray-800 rounded-l-lg text-sm focus:outline-none"
                  />
                  <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-r-lg transition-colors">
                    {t('nav.searchBtn')}
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
                    <span>{language === 'zh' ? '简体中文' : 'English'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showLangDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-32 z-50">
                      <button
                        onClick={() => handleLanguageChange('zh')}
                        className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${language === 'zh' ? 'text-purple-600 font-medium' : ''}`}
                      >
                        简体中文
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${language === 'en' ? 'text-purple-600 font-medium' : ''}`}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>

                {/* Currency Dropdown */}
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    className="flex items-center gap-1 text-sm hover:text-gray-300"
                  >
                    <span>{currency}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showCurrencyDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-24 z-50">
                      <button
                        onClick={() => handleCurrencyChange('USD')}
                        className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${currency === 'USD' ? 'text-purple-600 font-medium' : ''}`}
                      >
                        USD ($)
                      </button>
                      <button
                        onClick={() => handleCurrencyChange('CNY')}
                        className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${currency === 'CNY' ? 'text-purple-600 font-medium' : ''}`}
                      >
                        CNY (¥)
                      </button>
                      <button
                        onClick={() => handleCurrencyChange('MMK')}
                        className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${currency === 'MMK' ? 'text-purple-600 font-medium' : ''}`}
                      >
                        MMK (K)
                      </button>
                    </div>
                  )}
                </div>

                {/* Login / Register */}
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login" className="text-sm hover:text-gray-300">{t('nav.login')}</Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/register" className="text-sm hover:text-gray-300">{t('nav.register')}</Link>
                </div>

                {/* Customer Service */}
                <button className="p-2 hover:bg-gray-800 rounded transition-colors" title={t('sidebar.service24')}>
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
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white text-gray-800 rounded-l-lg text-sm focus:outline-none"
                />
                <button className="px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-r-lg">
                  {t('nav.searchBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12 gap-2 overflow-x-auto">
              {/* All Services Dropdown */}
              <div ref={serviceRef} className="relative">
                <button
                  onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors whitespace-nowrap"
                >
                  {t('cat.allServices')}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Service Dropdown Modal */}
                {showServiceDropdown && (
                  <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border p-4 z-50 min-w-96">
                    <div className="grid grid-cols-5 gap-3">
                      {serviceCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={`/category/${encodeURIComponent(cat.name)}`}
                          onClick={() => setShowServiceDropdown(false)}
                          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
                            {cat.icon}
                          </div>
                          <span className="text-xs text-gray-700 text-center">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
              <Link href="/login" className="block py-2 text-gray-700 hover:text-purple-600">{t('nav.login')}</Link>
              <Link href="/register" className="block py-2 text-gray-700 hover:text-purple-600">{t('nav.register')}</Link>
              <div className="flex gap-4 pt-2 border-t">
                <button onClick={() => handleLanguageChange('zh')} className={`text-sm ${language === 'zh' ? 'text-purple-600 font-medium' : ''}`}>简体中文</button>
                <button onClick={() => handleLanguageChange('en')} className={`text-sm ${language === 'en' ? 'text-purple-600 font-medium' : ''}`}>English</button>
              </div>
              <div className="flex gap-4">
                <button onClick={() => handleCurrencyChange('USD')} className={`text-sm ${currency === 'USD' ? 'text-purple-600 font-medium' : ''}`}>USD</button>
                <button onClick={() => handleCurrencyChange('CNY')} className={`text-sm ${currency === 'CNY' ? 'text-purple-600 font-medium' : ''}`}>CNY</button>
                <button onClick={() => handleCurrencyChange('MMK')} className={`text-sm ${currency === 'MMK' ? 'text-purple-600 font-medium' : ''}`}>MMK</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
