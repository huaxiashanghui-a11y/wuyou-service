'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeftSidebar from '@/components/LeftSidebar';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/lib/i18n';
import { Product } from '@/lib/types';
import {
  Smartphone, Gamepad2, Monitor, Globe, Zap, Play,
  Box, Copyright, Gift, ArrowRight, Flame, Clock, Search
} from 'lucide-react';

// Sample products for shop page
const sampleProducts: Product[] = [
  { id: '1', name: '抖音充值 100币', price: 98, originalPrice: 100, image: 'https://picsum.photos/300/300?random=1', category: 'douyin', stock: 999, sold: 9999, featured: true, status: 'active', description: '抖音充值 100薯币，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '2', name: '抖音充值 500币', price: 485, originalPrice: 500, image: 'https://picsum.photos/300/300?random=2', category: 'douyin', stock: 999, sold: 8888, featured: false, status: 'active', description: '抖音充值 500薯币，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '3', name: '小红书充值 100币', price: 95, originalPrice: 100, image: 'https://picsum.photos/300/300?random=3', category: 'xiaohongshu', stock: 999, sold: 7777, featured: true, status: 'active', description: '小红书薯币充值，秒到账', sort: 0, createdAt: '', updatedAt: '' },
  { id: '4', name: '王者荣耀 648点券', price: 618, originalPrice: 648, image: 'https://picsum.photos/300/300?random=4', category: 'game', stock: 999, sold: 6666, featured: false, status: 'active', description: '王者荣耀648点券直充', sort: 0, createdAt: '', updatedAt: '' },
  { id: '5', name: '原神 328创世结晶', price: 318, originalPrice: 328, image: 'https://picsum.photos/300/300?random=5', category: 'game', stock: 999, sold: 5555, featured: false, status: 'active', description: '原神328元礼包直充', sort: 0, createdAt: '', updatedAt: '' },
  { id: '6', name: 'B站大会员月卡', price: 25, originalPrice: 30, image: 'https://picsum.photos/300/300?random=6', category: 'bilibili', stock: 999, sold: 4444, featured: false, status: 'active', description: 'B站大会员月卡', sort: 0, createdAt: '', updatedAt: '' },
  { id: '7', name: '快手充值 100币', price: 90, originalPrice: 100, image: 'https://picsum.photos/300/300?random=7', category: 'kuaishou', stock: 999, sold: 3333, featured: false, status: 'active', description: '快手充值 100快币', sort: 0, createdAt: '', updatedAt: '' },
  { id: '8', name: '陌陌充值 60币', price: 55, originalPrice: 60, image: 'https://picsum.photos/300/300?random=8', category: 'momo', stock: 999, sold: 2222, featured: false, status: 'active', description: '陌陌充值 60陌陌币', sort: 0, createdAt: '', updatedAt: '' },
  { id: '9', name: '和平精英 600点券', price: 58, originalPrice: 60, image: 'https://picsum.photos/300/300?random=9', category: 'game', stock: 999, sold: 1111, featured: false, status: 'active', description: '和平精英点券充值', sort: 0, createdAt: '', updatedAt: '' },
  { id: '10', name: '英雄联盟 100RP', price: 95, originalPrice: 100, image: 'https://picsum.photos/300/300?random=10', category: 'game', stock: 999, sold: 999, featured: false, status: 'active', description: 'LOL点券充值', sort: 0, createdAt: '', updatedAt: '' },
  { id: '11', name: '探探充值 60币', price: 55, originalPrice: 60, image: 'https://picsum.photos/300/300?random=11', category: 'tantan', stock: 999, sold: 888, featured: false, status: 'active', description: '探探充值 60探探币', sort: 0, createdAt: '', updatedAt: '' },
  { id: '12', name: '爱奇艺会员月卡', price: 15, originalPrice: 20, image: 'https://picsum.photos/300/300?random=12', category: 'video', stock: 999, sold: 777, featured: false, status: 'active', description: '爱奇艺VIP月卡', sort: 0, createdAt: '', updatedAt: '' },
];

function ShopContent() {
  const { language } = useApp();

  return (
    <div className="flex flex-1 pt-14">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[200px] min-h-screen">
        <div className="container-custom py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              全部商品
            </h1>
            <p className="text-text-muted">
              共 {sampleProducts.length} 件商品
            </p>
          </div>

          {/* Search Bar */}
          <div className="card-dark p-4 mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="搜索商品..."
                  className="input-dark w-full pl-10"
                />
              </div>
              <button className="btn-primary">
                搜索
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* No Results Message */}
          {sampleProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-text-muted mb-4">未找到匹配的商品</div>
              <button className="btn-primary">清空搜索</button>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}

function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="h-10 w-48 skeleton rounded mx-auto mb-3" />
      </div>
      <div className="product-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card-dark rounded-lg overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-4 skeleton rounded w-2/3" />
              <div className="h-6 skeleton rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<ShopLoading />}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
