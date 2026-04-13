'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import Categories from '@/components/Categories';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/lib/types';

// 模拟商品数据 - 实际项目中应从 API 获取
const mockProducts: Product[] = [
  {
    id: '1',
    name: '王者荣耀点卡 100元',
    description: '官方直充，快速到账，安全可靠',
    price: 95,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 5200,
    featured: true,
    status: 'active',
    sort: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '原神月卡 30元',
    description: '原神祈月礼遇，快速充值',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 3500,
    featured: true,
    status: 'active',
    sort: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Steam充值卡 100美元',
    description: 'Steam钱包充值码，全球通用',
    price: 680,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
    category: 'game',
    stock: 50,
    sold: 1200,
    featured: true,
    status: 'active',
    sort: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: '腾讯视频VIP月卡',
    description: '腾讯视频会员，畅享海量影视',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 999,
    sold: 8000,
    featured: false,
    status: 'active',
    sort: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: '网易云音乐VIP年卡',
    description: '网易云音乐年度会员，高品质音乐',
    price: 158,
    originalPrice: 188,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 200,
    sold: 1500,
    featured: false,
    status: 'active',
    sort: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: '英雄联盟点券 1000',
    description: 'LOL官方点券充值，秒到账',
    price: 85,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'game',
    stock: 999,
    sold: 4500,
    featured: false,
    status: 'active',
    sort: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: '手机话费充值 100元',
    description: '全网运营商通用，秒到账',
    price: 98,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'recharge',
    stock: 999,
    sold: 12000,
    featured: false,
    status: 'active',
    sort: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'QQ超级会员月卡',
    description: 'QQ超级会员特权，尊享体验',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
    category: 'gift',
    stock: 500,
    sold: 3000,
    featured: false,
    status: 'active',
    sort: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const featuredProducts = mockProducts.filter((p) => p.featured);
  const allProducts = mockProducts;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="container-custom py-8">
          <HeroCarousel />
        </section>

        {/* Categories */}
        <section className="container-custom py-8">
          <Categories />
        </section>

        {/* Featured Products */}
        <section className="container-custom py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="h-48 skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 skeleton rounded" />
                    <div className="h-4 skeleton rounded w-2/3" />
                    <div className="h-8 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} title="热门推荐" />
          )}
        </section>

        {/* All Products */}
        <section className="container-custom py-8">
          <ProductGrid products={allProducts} title="更多商品" />
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">快速发货</h3>
                <p className="text-gray-600">支付成功后，卡密立即发送到您的邮箱</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">安全可靠</h3>
                <p className="text-gray-600">官方渠道，真实有效，售后有保障</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">24小时客服</h3>
                <p className="text-gray-600">全天候在线，随时为您解答疑问</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
