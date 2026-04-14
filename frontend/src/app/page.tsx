'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, ArrowUp, MessageCircle, QrCode, Star, Clock, Shield, Headphones } from 'lucide-react';

const leftCategories = [
  { name: '直播平台', icon: '📺', href: '/category/直播平台' },
  { name: '陪玩陪聊', icon: '🎮', href: '/category/陪玩陪聊' },
  { name: '游戏点卡', icon: '💳', href: '/category/游戏点卡' },
  { name: '小说动漫', icon: '📚', href: '/category/小说动漫' },
  { name: '视频音频', icon: '🎬', href: '/category/视频音频' },
  { name: '游戏充值', icon: '🎯', href: '/category/游戏充值' },
  { name: '社交平台', icon: '💬', href: '/category/社交平台' },
  { name: '生活服务', icon: '🛒', href: '/category/生活服务' },
];

const banners = [
  {
    id: 1,
    title: '抖音大优惠',
    subtitle: '马上抢购',
    description: '10秒到账',
    bgGradient: 'from-purple-600 to-pink-500',
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
    bgGradient: 'from-blue-500 to-purple-500',
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
  { name: '抖音充值', icon: '🎵', href: '/category/抖音' },
  { name: '快手充值', icon: '🎥', href: '/category/快手' },
  { name: 'B站大会员', icon: '📺', href: '/category/B站' },
  { name: '小红书薯币', icon: '📕', href: '/category/小红书' },
  { name: '陌陌直播', icon: '💬', href: '/category/陌陌' },
  { name: '探探充值', icon: '💕', href: '/category/探探' },
];

const rightGames = [
  { name: '王者荣耀', icon: '👑', href: '/category/王者荣耀' },
  { name: '原神', icon: '⚔️', href: '/category/原神' },
  { name: '英雄联盟', icon: '🎮', href: '/category/英雄联盟' },
  { name: '和平精英', icon: '🔫', href: '/category/和平精英' },
  { name: '崩坏星穹铁道', icon: '🚀', href: '/category/崩坏星穹铁道' },
  { name: '鸣潮', icon: '🌊', href: '/category/鸣潮' },
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
  const [currentBanner, setCurrentBanner] = useState(0);
  const [hotProductIndex, setHotProductIndex] = useState(0);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-48">
        {/* Main Content Grid */}
        <div className="flex gap-4 mb-8">
          {/* Left Sidebar - Category Menu */}
          <div className="hidden lg:block w-48 bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-4">全部分类</h3>
            <div className="space-y-1">
              {leftCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Banner Carousel */}
          <div className="flex-1">
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
                            <button className="mt-4 px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
                              立即抢购
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

          {/* Right Sidebar - Customer Service Info */}
          <div className="hidden xl:block w-56 bg-white rounded-lg shadow-sm p-4">
            {/* Customer Service */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <div className="font-bold text-gray-800">24小时在线客服</div>
              <div className="text-sm text-gray-500">随时为您服务</div>
            </div>

            {/* QR Code */}
            <div className="border-t pt-4 mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 text-center">扫码咨询</div>
              <div className="w-24 h-24 bg-gray-200 mx-auto flex items-center justify-center rounded">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            {/* Social Links */}
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">社交平台</div>
              <div className="flex justify-center gap-2">
                <a href="#" className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs">微</a>
                <a href="#" className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs">博</a>
                <a href="#" className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center text-white text-xs">知</a>
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              回到顶部
            </button>
          </div>
        </div>

        {/* Hot Products Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-lg text-gray-800">热门充值</h3>
            </div>
            <Link href="/category/热门" className="text-sm text-purple-600 hover:underline">查看更多 &gt;</Link>
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
                      <span className="text-red-500 font-bold">¥{product.price}</span>
                      <span className="text-xs text-gray-400">已售{product.sales}</span>
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
            <h3 className="font-bold text-lg text-gray-800">热门分类</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Live/Social */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                直播/社交
              </div>
              <div className="grid grid-cols-3 gap-3">
                {leftPlatforms.map((platform) => (
                  <Link
                    key={platform.name}
                    href={platform.href}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
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
                游戏充值
              </div>
              <div className="grid grid-cols-3 gap-3">
                {rightGames.map((game) => (
                  <Link
                    key={game.name}
                    href={game.href}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  >
                    <span className="text-2xl mb-1">{game.icon}</span>
                    <span className="text-xs text-gray-700">{game.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Recharge Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-lg text-gray-800">快捷充值</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
              >
                {product.label && (
                  <div className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded mb-1">
                    {product.label}
                  </div>
                )}
                <div className="text-xl font-bold text-red-500">¥{product.price}</div>
                <div className="text-xs text-gray-500 mb-2">{product.coins.toLocaleString()}币</div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded hover:opacity-90 transition-opacity"
                >
                  购买
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Service Features */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">24h自动发货</div>
                <div className="text-xs text-gray-500">下单即到</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">安全支付</div>
                <div className="text-xs text-gray-500">交易保障</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">正品保证</div>
                <div className="text-xs text-gray-500">官方渠道</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">售后保障</div>
                <div className="text-xs text-gray-500">7x24h客服</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
