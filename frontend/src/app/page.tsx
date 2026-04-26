'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCards from '@/components/CategoryCards';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight, Star, Zap, Shield, Clock, MessageCircle, Users, ArrowUp, Bell, Gift } from 'lucide-react';
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
  { id: '3', name: '充值平台 100币', price: 95, originalPrice: 100, image: 'https://picsum.photos/300/300?random=3', category: 'xiaohongshu', stock: 999, sold: 7777, featured: true, status: 'active', description: '充值平台薯币充值，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '4', name: '王者荣耀 648点券', price: 618, originalPrice: 648, image: 'https://picsum.photos/300/300?random=4', category: 'game', stock: 999, sold: 6666, featured: false, status: 'active', description: '王者荣耀648点券直充', sort: 0, createdAt: '', updatedAt: '' },
  { id: '5', name: '原神 328创世结晶', price: 318, originalPrice: 328, image: 'https://picsum.photos/300/300?random=5', category: 'game', stock: 999, sold: 5555, featured: false, status: 'active', description: '原神328元礼包直充', sort: 0, createdAt: '', updatedAt: '' },
  { id: '6', name: '会员充值月卡', price: 25, originalPrice: 30, image: 'https://picsum.photos/300/300?random=6', category: 'bilibili', stock: 999, sold: 4444, featured: false, status: 'active', description: '会员充值月卡', sort: 0, createdAt: '', updatedAt: '' },
  { id: '7', name: '快手充值 100币', price: 90, originalPrice: 100, image: 'https://picsum.photos/300/300?random=7', category: 'kuaishou', stock: 999, sold: 3333, featured: false, status: 'active', description: '快手充值 100快币', sort: 0, createdAt: '', updatedAt: '' },
  { id: '8', name: '陌陌充值 60币', price: 55, originalPrice: 60, image: 'https://picsum.photos/300/300?random=8', category: 'momo', stock: 999, sold: 2222, featured: false, status: 'active', description: '陌陌充值 60陌陌币', sort: 0, createdAt: '', updatedAt: '' },
  { id: '9', name: '游戏代充 100元', price: 95, originalPrice: 100, image: 'https://picsum.photos/300/300?random=9', category: 'game', stock: 999, sold: 1111, featured: false, status: 'active', description: '游戏代充 100元', sort: 0, createdAt: '', updatedAt: '' },
  { id: '10', name: '话费充值 100元', price: 98, originalPrice: 100, image: 'https://picsum.photos/300/300?random=10', category: 'recharge', stock: 999, sold: 999, featured: false, status: 'active', description: '话费充值 100元', sort: 0, createdAt: '', updatedAt: '' },
  { id: '11', name: '影音账号 月卡', price: 35, originalPrice: 40, image: 'https://picsum.photos/300/300?random=11', category: 'video', stock: 999, sold: 888, featured: false, status: 'active', description: '影音账号 月卡', sort: 0, createdAt: '', updatedAt: '' },
  { id: '12', name: '游戏点卡 100元', price: 90, originalPrice: 100, image: 'https://picsum.photos/300/300?random=12', category: 'game', stock: 999, sold: 777, featured: false, status: 'active', description: '游戏点卡 100元', sort: 0, createdAt: '', updatedAt: '' },
];

// 主营业务卡片
const mainBusinessCards = [
  { id: 'food', name: '同城外卖', icon: '🍜', description: '美食外卖', color: 'from-red-500 to-orange-500', href: 'https://frontend-one-coral-41.vercel.app/food' },
  { id: 'errand', name: '同城跑腿', icon: '🏃', description: '帮我跑腿', color: 'from-blue-500 to-cyan-500', href: 'https://frontend-one-coral-41.vercel.app/errand' },
  { id: 'taxi', name: '同城滴滴车', icon: '🚗', description: '打车出行', color: 'from-green-500 to-emerald-500', href: 'https://frontend-one-coral-41.vercel.app/taxi' },
  { id: 'buy', name: '帮买帮送', icon: '📦', description: '代买代送', color: 'from-purple-500 to-pink-500', href: 'https://frontend-one-coral-41.vercel.app/buy' },
  { id: 'secondhand', name: '二手商品', icon: '🔄', description: '闲置交易', color: 'from-yellow-500 to-orange-500', href: 'https://frontend-one-coral-41.vercel.app/secondhand' },
  { id: 'proxy', name: '平台代购', icon: '🛒', description: '海外代购', color: 'from-pink-500 to-rose-500', href: 'https://frontend-one-coral-41.vercel.app/proxy' },
];

// 热门会员/活动卡片
const memberCards = [
  { id: 'newuser', title: '新人专享', subtitle: '首单立减10元', icon: '🎁', color: 'from-green-500 to-emerald-500', href: '/shop' },
  { id: 'vip', title: '会员特权', subtitle: '开通享8折', icon: '👑', color: 'from-yellow-500 to-amber-500', href: '/shop' },
  { id: 'recharge', title: '充值返利', subtitle: '充100送20', icon: '💰', color: 'from-blue-500 to-indigo-500', href: '/shop' },
  { id: 'game', title: '游戏狂欢', subtitle: '限时8折起', icon: '🎮', color: 'from-purple-500 to-violet-500', href: '/games' },
  { id: 'festival', title: '节日活动', subtitle: '更多优惠', icon: '🎉', color: 'from-pink-500 to-rose-500', href: '/shop' },
];

// 分类卡片 - 从原左侧导航迁移
const categoryCards = [
  { id: 'zhibo', name: '直播平台', icon: '📺', href: '/coming-soon', subItems: [{ name: '抖音充值', href: '/coming-soon' }, { name: '快手充值', href: '/coming-soon' }, { name: '陌陌直播', href: '/coming-soon' }] },
  { id: 'peiywan', name: '陪玩陪聊', icon: '🎮', href: '/coming-soon', subItems: [] },
  { id: 'youxi', name: '游戏点卡', icon: '🎯', href: '/games', subItems: [{ name: '王者荣耀', href: '/games' }, { name: '原神', href: '/games' }, { name: '英雄联盟', href: '/games' }] },
  { id: 'xiaoshuo', name: '小说动漫', icon: '📚', href: '/coming-soon', subItems: [] },
  { id: 'shipin', name: '视频音频', icon: '🎬', href: '/coming-soon', subItems: [{ name: 'B站大会员', href: '/coming-soon' }, { name: '爱奇艺', href: '/coming-soon' }, { name: '优酷会员', href: '/coming-soon' }] },
  { id: 'chongzhi', name: '游戏充值', icon: '💎', href: '/games', subItems: [{ name: '游戏代充', href: '/games' }, { name: '话费充值', href: '/recharge' }] },
  { id: 'shejiao', name: '社交平台', icon: '💬', href: '/coming-soon', subItems: [{ name: '探探充值', href: '/coming-soon' }, { name: 'BLUED', href: '/coming-soon' }] },
  { id: 'shenghuo', name: '生活服务', icon: '🛍️', href: '/coming-soon', subItems: [] },
];

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-homepage">
      <Header />

      <main className="flex-1 pt-[106px] lg:pt-[138px]">
        <div className="container-custom py-6">

          {/* Section 1: Important Announcement Banner */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg mb-6 overflow-hidden">
            <div className="flex items-center">
              <div className="flex items-center gap-2 px-4 py-3 bg-orange-700/50">
                <Bell className="w-5 h-5" />
                <span className="font-bold text-sm whitespace-nowrap">重要公告</span>
              </div>
              <div className="flex-1 overflow-hidden py-3">
                <div className="animate-scroll-left whitespace-nowrap text-sm">
                  限时优惠：会员充值年卡仅需168元 | 新用户首单满50减10 | 游戏代充全场8折起 | 充值平台秒到账，安全可靠！
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Banner Carousel with Category Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Left Category Cards */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <CategoryCards categories={categoryCards} />
            </div>

            {/* Center Banner Carousel */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden">
                <div className="relative h-64 md:h-80 lg:h-[420px]">
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
                <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
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
            </div>

            {/* Right Side Info Cards */}
            <div className="lg:col-span-3 order-3">
              <div className="flex flex-col gap-4">
                <div className="card-dark p-4 flex-1">
                  <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    快速服务
                  </h4>
                  <div className="space-y-2">
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors">
                      <span>📦</span> 自动发货
                    </Link>
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors">
                      <span>⏰</span> 24小时在线
                    </Link>
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors">
                      <span>🔒</span> 安全交易
                    </Link>
                    <Link href="/shop" className="flex items-center gap-2 text-sm text-text-secondary hover:text-orange-500 transition-colors">
                      <span>💬</span> 专属客服
                    </Link>
                  </div>
                </div>

                <div className="card-dark p-4">
                  <h4 className="font-bold text-text-primary mb-3">平台数据</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">9999+</div>
                      <div className="text-xs text-text-muted">成交订单</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">99.9%</div>
                      <div className="text-xs text-text-muted">好评率</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Main Business Category Cards */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                主营业务
              </h3>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {mainBusinessCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group"
                >
                  <div className={`card-dark p-4 bg-gradient-to-br ${card.color} hover:scale-105 transition-all duration-300`}>
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <h4 className="font-bold text-white text-sm mb-1">{card.name}</h4>
                    <p className="text-white/80 text-xs">{card.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 4: Hot Products */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-text-primary">热门推荐</h3>
              </div>
              <Link href="/shop" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                查看全部 &gt;
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sampleProducts.slice(0, 12).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Section 5: Hot Member/Activity Cards */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                热门会员
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {memberCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group"
                >
                  <div className={`card-dark p-5 bg-gradient-to-br ${card.color} hover:scale-105 transition-all duration-300`}>
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <h4 className="font-bold text-white text-sm mb-1">{card.title}</h4>
                    <p className="text-white/80 text-xs">{card.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card-dark p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary">快速发货</h4>
                <p className="text-sm text-text-muted">订单提交后秒级发货</p>
              </div>
            </div>
            <div className="card-dark p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
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
            <div className="text-sm text-text-muted space-y-2">
              <p>1. 自动发货：付款成功后，系统将在5秒内自动发送卡密到您的订单页面。</p>
              <p>2. 卡密查询：请前往&quot;我的订单&quot;查看卡密信息。</p>
              <p>3. 充值说明：按照卡密上的指引在对应平台进行充值，或联系客服协助。</p>
            </div>
          </section>
        </div>

        <Footer />
      </main>

      {/* Right Floating Sidebar */}
      <div className="floating-sidebar">
        <button className="floating-btn" title="在线客服">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="floating-btn" title="消息通知">
          <Bell className="w-5 h-5" />
        </button>
        <button className="floating-btn" title="活动优惠">
          <Gift className="w-5 h-5" />
        </button>
        <button className="floating-btn" title="商务合作">
          <Users className="w-5 h-5" />
        </button>
        {showBackToTop && (
          <button onClick={scrollToTop} className="floating-btn" title="回到顶部">
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}