'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Home, ShoppingBag, FileText, User, Settings } from 'lucide-react';

interface Product {
  id: string;
  price: number;
  coins: number;
  label?: string;
  soldOut?: boolean;
  featured?: boolean;
}

const products: Product[] = [
  { id: '1', price: 100, coins: 10000, featured: true },
  { id: '2', price: 200, coins: 20000, featured: true },
  { id: '3', price: 500, coins: 50000, featured: true },
  { id: '4', price: 1000, coins: 100000, featured: true },
  { id: '5', price: 2000, coins: 200000, label: '限时', featured: true },
  { id: '6', price: 5000, coins: 500000, featured: true },
  { id: '7', price: 10000, coins: 1000000, soldOut: true },
  { id: '8', price: 66, coins: 6666, label: '爆款' },
  { id: '9', price: 128, coins: 12800, label: '新品' },
  { id: '10', price: 328, coins: 32800 },
  { id: '11', price: 648, coins: 64800, label: '推荐' },
  { id: '12', price: 98, coins: 9800 },
];

export default function HomePage() {
  const { addItem, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const handleAddToCart = (product: Product) => {
    if (product.soldOut) return;
    addItem({
      id: product.id,
      name: `${product.coins} 薯币`,
      description: '小红书薯币充值',
      price: product.price,
      originalPrice: product.price * 1.25,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-32">
        {/* Main Content */}
        <div className="flex-1 px-4 md:px-6 py-6">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 h-64 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl md:text-5xl font-bold mb-2">
                    充小红书薯币
                  </div>
                  <div className="text-xl md:text-2xl mb-4 opacity-90">
                    即享 <span className="text-yellow-300 font-bold">8折</span> 优惠
                  </div>
                  <div className="bg-green-500 inline-block px-6 py-2 rounded-full text-sm">
                    ¥100 全部最低（可叠加）
                  </div>
                </div>
              </div>
              {/* Left decoration */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-purple-800/50 to-transparent" />
              {/* Right decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-pink-500/50 to-transparent" />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow ${
                  product.soldOut ? 'opacity-60' : ''
                }`}
              >
                {product.label && (
                  <div className="inline-block px-2 py-0.5 bg-red-500 text-white text-xs rounded mb-2">
                    {product.label}
                  </div>
                )}
                {product.soldOut && (
                  <div className="inline-block px-2 py-0.5 bg-gray-400 text-white text-xs rounded mb-2">
                    已售罄
                  </div>
                )}
                <div className="text-2xl font-bold text-red-500 mb-1">
                  ¥{product.price}
                </div>
                <div className="text-gray-600 text-sm mb-3">
                  {product.coins.toLocaleString()} 币
                </div>
                {product.soldOut ? (
                  <button
                    disabled
                    className="w-full py-2 bg-gray-200 text-gray-400 text-sm rounded-lg cursor-not-allowed"
                  >
                    已售罄
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                  >
                    购买
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* More Products Section */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-bold">更多充值</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Genshin Banner */}
              <div className="relative rounded-xl overflow-hidden h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="text-white">
                    <div className="text-xs opacity-80">游戏充值</div>
                    <div className="font-bold text-lg">原神</div>
                    <div className="text-xs opacity-80">2024年最火</div>
                  </div>
                  <button className="px-4 py-1.5 bg-yellow-500 text-black text-sm font-medium rounded-full">
                    立即充值
                  </button>
                </div>
              </div>

              {/* League Banner */}
              <div className="relative rounded-xl overflow-hidden h-32 bg-gradient-to-r from-orange-500 to-red-500">
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="text-white">
                    <div className="text-xs opacity-80">游戏充值</div>
                    <div className="font-bold text-lg">英雄联盟</div>
                    <div className="text-xs opacity-80">全球电竞</div>
                  </div>
                  <button className="px-4 py-1.5 bg-white text-orange-600 text-sm font-medium rounded-full">
                    立即充值
                  </button>
                </div>
              </div>

              {/* Honor Banner */}
              <div className="relative rounded-xl overflow-hidden h-32 bg-gradient-to-r from-green-500 to-teal-500">
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <div className="text-white">
                    <div className="text-xs opacity-80">游戏充值</div>
                    <div className="font-bold text-lg">王者荣耀</div>
                    <div className="text-xs opacity-80">国战手游</div>
                  </div>
                  <button className="px-4 py-1.5 bg-white text-green-600 text-sm font-medium rounded-full">
                    立即充值
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-16 bg-white border-l">
          <div className="sticky top-24 p-2 space-y-2">
            <div className="w-10 h-10 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <button className="w-10 h-10 mx-auto bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 hover:bg-purple-200 transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <FileText className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
