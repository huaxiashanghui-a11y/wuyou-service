'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeftSidebar from '@/components/LeftSidebar';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, Star, Zap, Shield, Clock } from 'lucide-react';
import { Product } from '@/lib/types';

const banners = [
  {
    id: 1,
    title: '抖音大优惠',
    subtitle: '充值秒到账',
    description: '全网最低价，安全可靠',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    id: 2,
    title: '游戏点卡特惠',
    subtitle: '限时8折',
    description: '王者荣耀、原神、英雄联盟',
    gradient: 'from-purple-600 to-purple-800',
  },
  {
    id: 3,
    title: 'B站大会员',
    subtitle: '年卡优惠中',
    description: '大会员年卡限时特价',
    gradient: 'from-pink-600 to-pink-800',
  },
];

// Sample products for demo
const sampleProducts: Product[] = [
  { id: '1', name: '抖音充值 100币', price: 98, originalPrice: 100, image: 'https://picsum.photos/300/300?random=1', category: 'douyin', stock: 999, sold: 9999, featured: true, status: 'active', description: '抖音充值 100薯币，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '2', name: '抖音充值 500币', price: 485, originalPrice: 500, image: 'https://picsum.photos/300/300?random=2', category: 'douyin', stock: 999, sold: 8888, featured: false, status: 'active', description: '抖音充值 500薯币，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '3', name: '小红书充值 100币', price: 95, originalPrice: 100, image: 'https://picsum.photos/300/300?random=3', category: 'xiaohongshu', stock: 999, sold: 7777, featured: true, status: 'active', description: '小红书薯币充值，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '4', name: '王者荣耀 648点券', price: 618, originalPrice: 648, image: 'https://picsum.photos/300/300?random=4', category: 'game', stock: 999, sold: 6666, featured: false, status: 'active', description: '王者荣耀648点券直充', sort: 0, createdAt: '', updatedAt: '' },
  { id: '5', name: '原神 328创世结晶', price: 318, originalPrice: 328, image: 'https://picsum.photos/300/300?random=5', category: 'game', stock: 999, sold: 5555, featured: false, status: 'active', description: '原神328元礼包直充', sort: 0, createdAt: '', updatedAt: '' },
  { id: '6', name: 'B站大会员月卡', price: 25, originalPrice: 30, image: 'https://picsum.photos/300/300?random=6', category: 'bilibili', stock: 999, sold: 4444, featured: false, status: 'active', description: 'B站大会员月卡', sort: 0, createdAt: '', updatedAt: '' },
  { id: '7', name: '快手充值 100币', price: 90, originalPrice: 100, image: 'https://picsum.photos/300/300?random=7', category: 'kuaishou', stock: 999, sold: 3333, featured: false, status: 'active', description: '快手充值 100快币', sort: 0, createdAt: '', updatedAt: '' },
  { id: '8', name: '陌陌充值 60币', price: 55, originalPrice: 60, image: 'https://picsum.photos/300/300?random=8', category: 'momo', stock: 999, sold: 2222, featured: false, status: 'active', description: '陌陌充值 60陌陌币', sort: 0, createdAt: '', updatedAt: '' },
];

// Platform cards data - 4 cards below banner
const platformCards = [
  { id: 'social', name: '社交账号', icon: '💬', description: '账号交易', href: '/coming-soon', color: 'from-pink-500 to-pink-600' },
  { id: 'gameaccount', name: '游戏账号', icon: '🎮', description: '游戏交易', href: '/coming-soon', color: 'from-blue-500 to-blue-600' },
  { id: 'proxy', name: '代购平台', icon: '🛒', description: '海外代购', href: '/coming-soon', color: 'from-orange-500 to-orange-600' },
  { id: 'secondhand', name: '二手商品', icon: '🔄', description: '闲置交易', href: '/coming-soon', color: 'from-green-500 to-green-600' },
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 pt-14">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-[200px] min-h-screen">
          <div className="container-custom py-6">
            {/* Banner Carousel */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              <div className="relative h-64 md:h-80 lg:h-96">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentBanner ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}>
                      <div className="absolute inset-0 flex items-center px-8 md:px-16">
                        <div className="text-white">
                          <h2 className="text-3xl md:text-5xl font-bold mb-2">{banner.title}</h2>
                          <p className="text-xl md:text-2xl mb-2 opacity-90">{banner.subtitle}</p>
                          <p className="text-sm md:text-base opacity-75 mb-4">{banner.description}</p>
                          <Link href="/shop" className="inline-block px-6 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                            立即购买
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Banner Navigation */}
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Banner Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentBanner ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Platform Cards - Below Banner (Red Box Area) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {platformCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group"
                >
                  <div className="card-dark p-4 text-center hover:border-accent transition-all duration-300">
                    <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <span className="text-2xl">{card.icon}</span>
                    </div>
                    <h4 className="font-bold text-text-primary text-sm mb-1 group-hover:text-accent transition-colors">
                      {card.name}
                    </h4>
                    <p className="text-xs text-text-muted">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Hot Products Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold text-text-primary">热门商品</h3>
                </div>
                <Link href="/shop" className="text-sm text-accent hover:text-accent-hover transition-colors">
                  查看全部 &gt;
                </Link>
              </div>

              {/* Product Grid */}
              <div className="product-grid">
                {sampleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card-dark p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">快速发货</h4>
                  <p className="text-sm text-text-muted">订单提交后秒级发货</p>
                </div>
              </div>
              <div className="card-dark p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">安全可靠</h4>
                  <p className="text-sm text-text-muted">官方渠道，正品保障</p>
                </div>
              </div>
              <div className="card-dark p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">24小时服务</h4>
                  <p className="text-sm text-text-muted">全天候在线客服支持</p>
                </div>
              </div>
            </section>

            {/* Purchase Notice */}
            <section className="card-dark p-4 mb-8">
              <h4 className="font-bold text-text-primary mb-3">购买须知</h4>
              <div className="text-sm text-text-muted space-y-2 max-h-32 overflow-y-auto">
                <p>1. 自动发货：付款成功后，系统将在5秒内自动发送卡密到您的订单页面。</p>
                <p>2. 卡密查询：请前往&quot;我的订单&quot;查看卡密信息。</p>
                <p>3. 充值说明：按照卡密上的指引在对应平台进行充值，或联系客服协助。</p>
                <p>4. 禁止用途：本平台仅提供正规充值服务，严禁用于任何违法用途。</p>
                <p>5. 退款政策：因平台原因导致的充值失败，经核实后可申请退款。</p>
              </div>
            </section>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
