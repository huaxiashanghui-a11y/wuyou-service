'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { useApp } from '@/lib/i18n';
import { ChevronLeft, ChevronRight, ArrowUp, MessageCircle, QrCode, Star, Clock, Shield, Headphones, TrendingUp, ArrowUpRight, ArrowDownRight, Calculator, Globe } from 'lucide-react';

const leftCategories = [
  { id: 'all', name: '全部分类', icon: '📦', href: '/shop' },
  { id: 'recharge', name: '话费充值', icon: '📱', href: '/recharge' },
  { id: 'games', name: '游戏代充', icon: '🎮', href: '/games' },
  { id: 'points', name: '游戏点卡', icon: '💳', href: '/shop' },
  { id: 'video', name: '视频音频', icon: '🎬', href: '/shop' },
  { id: 'live', name: '直播平台', icon: '📺', href: '/shop' },
  { id: 'gift', name: '礼品卡', icon: '🎁', href: '/shop' },
  { id: 'forex', name: '无忧外汇', icon: '💱', href: '/forex' },
];

const banners = [
  {
    id: 1,
    title: '抖音大优惠',
    subtitle: '马上抢购',
    description: '10秒到账',
    bgGradient: 'from-orange-500 to-orange-600',
  },
  {
    id: 2,
    title: '小红书充值',
    subtitle: '限时折扣',
    description: '全网最低价',
    bgGradient: 'from-pink-500 to-red-400',
  },
  {
    id: 3,
    title: '游戏点卡特惠',
    subtitle: '全场8折',
    description: '秒到账',
    bgGradient: 'from-blue-500 to-orange-500',
  },
];

const sidebarItems = [
  {
    id: 1,
    icon: Headphones,
    title: '24小时在线客服',
    subtitle: '随时为您服务',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 2,
    icon: QrCode,
    title: '扫码咨询',
    subtitle: '',
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 3,
    icon: MessageCircle,
    title: '微信客服',
    subtitle: '',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 4,
    icon: Headphones,
    title: 'QQ客服',
    subtitle: '',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 5,
    icon: Star,
    title: '视频教程',
    subtitle: '',
    color: 'bg-red-100 text-red-600',
  },
];

const hotProducts = [
  { id: '1', name: '抖音', price: 100, originalPrice: 120, sales: 9999 },
  { id: '2', name: '小红书', price: 50, originalPrice: 60, sales: 8888 },
  { id: '3', name: '快手', price: 100, originalPrice: 120, sales: 7777 },
  { id: '4', name: 'B站', price: 68, originalPrice: 80, sales: 6666 },
  { id: '5', name: '王者荣耀', price: 648, originalPrice: 800, sales: 5555 },
  { id: '6', name: '原神', price: 328, originalPrice: 400, sales: 4444 },
  { id: '7', name: '英雄联盟', price: 100, originalPrice: 120, sales: 3333 },
  { id: '8', name: '陌陌', price: 60, originalPrice: 70, sales: 2222 },
];

const leftPlatforms = [
  { name: '抖音充值', icon: '🎵', href: '/shop' },
  { name: '快手充值', icon: '🎥', href: '/shop' },
  { name: 'B站大会员', icon: '📺', href: '/shop' },
  { name: '小红书薯币', icon: '📕', href: '/shop' },
  { name: '陌陌直播', icon: '💬', href: '/shop' },
  { name: '探探充值', icon: '💕', href: '/shop' },
];

const rightGames = [
  { name: '王者荣耀', icon: '👑', href: '/games' },
  { name: '原神', icon: '⚔️', href: '/games' },
  { name: '英雄联盟', icon: '🎮', href: '/games' },
  { name: '和平精英', icon: '🔫', href: '/games' },
  { name: '崩坏星穹铁道', icon: '🚀', href: '/games' },
  { name: '鸣潮', icon: '🌊', href: '/games' },
];

// Exchange rates data
const exchangeRates = [
  { code: 'CNY', name: { zh: '人民币', my: 'တရုတ်ငွေ', en: 'Chinese Yuan' }, rate: 7.24, change: 0.02, flag: '🇨🇳' },
  { code: 'MMK', name: { zh: '缅币', my: 'မြန်မာကျပ်', en: 'Myanmar Kyat' }, rate: 2100, change: -0.15, flag: '🇲🇲' },
  { code: 'USD', name: { zh: '美元', my: 'ဒေါ်လာ', en: 'US Dollar' }, rate: 1, change: 0, flag: '🇺🇸' },
  { code: 'THB', name: { zh: '泰铢', my: 'ဘတ်', en: 'Thai Baht' }, rate: 35.5, change: 0.01, flag: '🇹🇭' },
  { code: 'SGD', name: { zh: '新币', my: 'စင်ကာပူ', en: 'Singapore Dollar' }, rate: 1.34, change: -0.01, flag: '🇸🇬' },
];

// QR codes for carousel
const qrCodes = [
  { id: 1, title: { zh: '微信客服', my: 'ဝက်ဘ်ဝန်ဆောင်မှု', en: 'WeChat Service' } },
  { id: 2, title: { zh: 'QQ客服', my: 'QQ ဝန်ဆောင်မှု', en: 'QQ Service' } },
  { id: 3, title: { zh: 'Telegram', my: 'Telegram', en: 'Telegram' } },
];

interface Product {
  id: string;
  price: number;
  coins: number;
  label?: string;
  soldOut?: boolean;
}

const products: Product[] = [
  { id: '1', price: 100, coins: 10000 },
  { id: '2', price: 200, coins: 20000 },
  { id: '3', price: 500, coins: 50000 },
  { id: '4', price: 1000, coins: 100000 },
  { id: '5', price: 2000, coins: 200000, label: '限时' },
  { id: '6', price: 5000, coins: 500000 },
  { id: '7', price: 10000, coins: 1000000 },
  { id: '8', price: 66, coins: 6666, label: '爆款' },
];

export default function HomePage() {
  const { addItem } = useCartStore();
  const { t, formatPrice, language } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentSidebar, setCurrentSidebar] = useState(0);
  const [currentQR, setCurrentQR] = useState(0);
  const [hotProductIndex, setHotProductIndex] = useState(0);
  const [forexAmount, setForexAmount] = useState('100');
  const [forexFrom, setForexFrom] = useState('USD');
  const [forexTo, setForexTo] = useState('MMK');

  // Auto-play banner every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  // Auto-play sidebar every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSidebar((prev) => (prev + 1) % sidebarItems.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Auto-play QR carousel every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQR((prev) => (prev + 1) % qrCodes.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Convert currency
  const convertCurrency = (amount: number, from: string, to: string) => {
    const fromRate = exchangeRates.find(r => r.code === from)?.rate || 1;
    const toRate = exchangeRates.find(r => r.code === to)?.rate || 1;
    return ((amount * fromRate) / toRate).toFixed(2);
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSidebar = () => {
    setCurrentSidebar((prev) => (prev + 1) % sidebarItems.length);
  };

  const prevSidebar = () => {
    setCurrentSidebar((prev) => (prev - 1 + sidebarItems.length) % sidebarItems.length);
  };

  const nextQR = () => {
    setCurrentQR((prev) => (prev + 1) % qrCodes.length);
  };

  const prevQR = () => {
    setCurrentQR((prev) => (prev - 1 + qrCodes.length) % qrCodes.length);
  };

  const nextHotProducts = () => {
    setHotProductIndex((prev) => Math.min(prev + 4, hotProducts.length - 4));
  };

  const prevHotProducts = () => {
    setHotProductIndex((prev) => Math.max(prev - 4, 0));
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: `${product.coins} 薯币`,
      description: '充值服务',
      price: product.price,
      originalPrice: product.price * 1.2,
      image: 'https://picsum.photos/200/200',
      category: 'douyin',
      stock: 999,
      sold: 0,
      featured: false,
      status: 'active',
      sort: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-48 pb-8 min-h-[70vh]">
        {/* Main Content Grid */}
        <div className="flex gap-4 mb-8 items-start">
          {/* Left Sidebar - Category Menu */}
          <div className="hidden lg:block w-48 glass rounded-lg p-4 shrink-0">
            <h3 className="font-bold text-gray-800 mb-4">{t('cat.allCategories')}</h3>
            <div className="space-y-1">
              {leftCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/shop" className="block mt-4 text-sm text-orange-600 hover:underline">
              {t('section.viewMore')} &gt;
            </Link>
          </div>

          {/* Center - Banner Carousel */}
          <div className="flex-1 min-w-0">
            <div className="relative rounded-lg overflow-hidden">
              {/* Banner Images */}
              <div className="relative h-80 md:h-96">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentBanner ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient}`}>
                      <div className="absolute inset-0 flex items-center">
                        <div className="px-8 md:px-16 w-full">
                          <div className="text-white">
                            <div className="text-3xl md:text-5xl font-bold mb-2">{banner.title}</div>
                            <div className="text-xl md:text-2xl mb-2">{banner.subtitle}</div>
                            <div className="text-lg opacity-80">{banner.description}</div>
                            <button className="mt-4 px-8 py-3 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
                              {t('banner.buyNow')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner Navigation */}
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Banner Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentBanner ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Category Cards - Below Banner */}
          <div className="hidden xl:flex gap-3 mb-4">
            {/* 社交账号 */}
            <Link href="/coming-soon" className="flex-1 glass rounded-lg p-3 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <span className="text-xl">💬</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">
                {language === 'zh' ? '社交账号' : language === 'en' ? 'Social' : 'လူမှု'}
              </h4>
              <p className="text-xs text-gray-500">
                {language === 'zh' ? '账号交易' : language === 'en' ? 'Account trading' : 'အကောင်အထည်'}
              </p>
            </Link>

            {/* 游戏ID平台 */}
            <Link href="/coming-soon" className="flex-1 glass rounded-lg p-3 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <span className="text-xl">🎮</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">
                {language === 'zh' ? '游戏ID平台' : language === 'en' ? 'Game ID' : 'ဂိမ်း ID'}
              </h4>
              <p className="text-xs text-gray-500">
                {language === 'zh' ? '游戏账号' : language === 'en' ? 'Game account' : 'ဂိမ်း'}
              </p>
            </Link>

            {/* 代购平台 */}
            <Link href="/coming-soon" className="flex-1 glass rounded-lg p-3 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <span className="text-xl">🛒</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">
                {language === 'zh' ? '代购平台' : language === 'en' ? 'Proxy' : 'အစားဝယ်'}
              </h4>
              <p className="text-xs text-gray-500">
                {language === 'zh' ? '海外代购' : language === 'en' ? 'Overseas' : 'နိုင်ငံခြား'}
              </p>
            </Link>

            {/* 二手商品平台 */}
            <Link href="/coming-soon" className="flex-1 glass rounded-lg p-3 text-center hover:scale-105 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <span className="text-xl">🔄</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">
                {language === 'zh' ? '二手商品' : language === 'en' ? 'Second-hand' : 'အေးအိုး'}
              </h4>
              <p className="text-xs text-gray-500">
                {language === 'zh' ? '闲置交易' : language === 'en' ? 'Trading' : 'ပစ္စည်း'}
              </p>
            </Link>
          </div>

          {/* Right Sidebar - Customer Service Info with Auto-play */}
          <div className="hidden xl:block w-56 glass rounded-lg p-4 shrink-0">
            {/* Auto-play Sidebar Carousel */}
            <div className="relative">
              <div className="min-h-48">
                {sidebarItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`transition-opacity duration-500 ${
                      index === currentSidebar ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                  >
                    {/* Customer Service */}
                    <div className="text-center mb-4">
                      <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-gray-800">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-sm text-gray-500">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Navigation */}
              <button
                onClick={prevSidebar}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={nextSidebar}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Sidebar Dots */}
            <div className="flex justify-center gap-1 mt-4">
              {sidebarItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSidebar(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSidebar ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* QR Code Carousel */}
            <div className="border-t pt-4 mb-4 mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2 text-center">{t('sidebar.scan')}</div>
              {/* QR Carousel with auto-play */}
              <div className="relative">
                <div className="h-28 flex items-center justify-center">
                  {qrCodes.map((qr, index) => (
                    <div
                      key={qr.id}
                      className={`absolute transition-all duration-500 ${
                        index === currentQR
                          ? 'opacity-100 translate-x-0 scale-100'
                          : index < currentQR
                          ? 'opacity-0 -translate-x-8 scale-90'
                          : 'opacity-0 translate-x-8 scale-90'
                      }`}
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-100 mx-auto flex flex-col items-center justify-center rounded-lg border-2 border-orange-200">
                        <QrCode className="w-12 h-12 text-orange-600 mb-1" />
                        <span className="text-xs text-orange-600 font-medium">{qr.title[language] || qr.title.zh}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* QR Navigation */}
                <button
                  onClick={prevQR}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 hover:bg-orange-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={nextQR}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 hover:bg-orange-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {/* QR Dots */}
              <div className="flex justify-center gap-1 mt-2">
                {qrCodes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQR(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentQR ? 'bg-orange-600 w-4' : 'bg-gray-300 hover:bg-orange-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">{t('sidebar.social')}</div>
              <div className="flex justify-center gap-2">
                <a href="#" className="w-8 h-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow">微</a>
                <a href="#" className="w-8 h-8 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow">博</a>
                <a href="#" className="w-8 h-8 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 rounded flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow">知</a>
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              {t('sidebar.backTop')}
            </button>
          </div>
        </div>

        {/* Hot Products Section */}
        <div className="glass rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-lg text-gray-800">{t('section.hotRecharge')}</h3>
            </div>
            <Link href="/category/热门" className="text-sm text-orange-600 hover:underline">{t('section.viewMore')} &gt;</Link>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{ transform: `translateX(-${hotProductIndex * 196}px)` }}
              >
                {hotProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="flex-shrink-0 w-44 bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="w-full h-28 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                      <img
                        src={`https://picsum.photos/176/112?random=${product.id}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">{product.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-500 font-bold">{formatPrice(product.price)}</span>
                      <span className="text-xs text-gray-400">{t('section.sold')}{product.sales}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Hot Products Navigation */}
            <button
              onClick={prevHotProducts}
              disabled={hotProductIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextHotProducts}
              disabled={hotProductIndex >= hotProducts.length - 4}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Popular Categories Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-gray-800">{t('section.hotCategories')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Live/Social */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {t('section.liveSocial')}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {leftPlatforms.map((platform) => (
                  <Link
                    key={platform.name}
                    href={platform.href}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <span className="text-2xl mb-1">{platform.icon}</span>
                    <span className="text-xs text-gray-700">{platform.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Games */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                {t('section.games')}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {rightGames.map((game) => (
                  <Link
                    key={game.name}
                    href={game.href}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <span className="text-2xl mb-1">{game.icon}</span>
                    <span className="text-xs text-gray-700">{game.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Worry-Free Forex Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6" />
              <h3 className="font-bold text-xl">{t('forex.title') || '无忧外汇'}</h3>
              <span className="px-2 py-0.5 bg-white/20 rounded text-xs">LIVE</span>
            </div>
            <Link href="/forex" className="px-4 py-1.5 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md">
              {t('forex.viewMore') || '查看更多'}
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Exchange Rates */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">{language === 'zh' ? '实时汇率' : language === 'my' ? 'အချက်အလက်နှုန်း' : 'Live Rates'}</span>
              </div>
              <div className="space-y-2">
                {exchangeRates.slice(0, 5).map((rate) => (
                  <div key={rate.code} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{rate.flag}</span>
                      <div>
                        <div className="font-medium">{rate.code}</div>
                        <div className="text-xs text-white/70">{rate.name[language] || rate.name.zh}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{rate.rate.toFixed(2)}</div>
                      <div className={`text-xs flex items-center justify-end gap-1 ${rate.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                        {rate.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(rate.change).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-green-600">
                <Calculator className="w-5 h-5" />
                <span className="font-medium">{language === 'zh' ? '汇率计算器' : language === 'my' ? 'ငွေလဲဂဏန်း' : 'Calculator'}</span>
              </div>
              <div className="space-y-3">
                {/* Amount Input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{language === 'zh' ? '金额' : language === 'my' ? 'ငွေပမာဏ' : 'Amount'}</label>
                  <input
                    type="number"
                    value={forexAmount}
                    onChange={(e) => setForexAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="100"
                  />
                </div>
                {/* From Currency */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{language === 'zh' ? '从' : language === 'my' ? 'မှ' : 'From'}</label>
                  <select
                    value={forexFrom}
                    onChange={(e) => setForexFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    {exchangeRates.map((r) => (
                      <option key={r.code} value={r.code}>{r.flag} {r.code} - {r.name[language] || r.name.zh}</option>
                    ))}
                  </select>
                </div>
                {/* To Currency */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{language === 'zh' ? '到' : language === 'my' ? 'သို့' : 'To'}</label>
                  <select
                    value={forexTo}
                    onChange={(e) => setForexTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    {exchangeRates.map((r) => (
                      <option key={r.code} value={r.code}>{r.flag} {r.code} - {r.name[language] || r.name.zh}</option>
                    ))}
                  </select>
                </div>
                {/* Result */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-4 text-white text-center">
                  <div className="text-sm opacity-80 mb-1">{language === 'zh' ? '转换结果' : language === 'my' ? 'ရလဒ်' : 'Result'}</div>
                  <div className="text-2xl font-bold">
                    {convertCurrency(parseFloat(forexAmount) || 0, forexFrom, forexTo)} {forexTo}
                  </div>
                </div>
                <Link
                  href="/forex"
                  className="block w-full py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-center rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  {language === 'zh' ? '查看详细汇率' : language === 'my' ? 'အသေးစိတ်ကြည့်ရန်' : 'View Details'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <div className="glass rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{t('service.autoDeliver')}</div>
                <div className="text-xs text-gray-500">{t('service.instant')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{t('service.secure')}</div>
                <div className="text-xs text-gray-500">{t('service.guarantee')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{t('service.authentic')}</div>
                <div className="text-xs text-gray-500">{t('service.official')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">{t('service.support')}</div>
                <div className="text-xs text-gray-500">{t('service.customer')}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
