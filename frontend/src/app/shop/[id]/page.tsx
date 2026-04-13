'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Star, Package, Shield, Zap, Minus, Plus } from 'lucide-react';
import { Product } from '@/lib/types';

// 模拟商品数据
const productsData: Record<string, Product> = {
  '1': {
    id: '1',
    name: '王者荣耀点卡 100元',
    description: '官方直充，快速到账，安全可靠。充值后可购买游戏内道具、皮肤等。',
    price: 95,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800&h=600&fit=crop',
    category: 'game',
    stock: 999,
    sold: 5200,
    featured: true,
    status: 'active',
    sort: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  '2': {
    id: '2',
    name: '原神月卡 30元',
    description: '原神祈月礼遇，快速充值。月卡包含每日赠送160原石，连续充值30天可获得4800原石。',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=600&fit=crop',
    category: 'game',
    stock: 999,
    sold: 3500,
    featured: true,
    status: 'active',
    sort: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  '3': {
    id: '3',
    name: 'Steam充值卡 100美元',
    description: 'Steam钱包充值码，全球通用。可用于购买Steam游戏、DLC、工具等。',
    price: 680,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop',
    category: 'game',
    stock: 50,
    sold: 1200,
    featured: true,
    status: 'active',
    sort: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = productsData[params.id as string];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-4">商品不存在</h2>
            <button
              onClick={() => router.push('/shop')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              返回商城
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-lg">
                  -{discountPercent}%
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  热门推荐
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary-600">¥{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">¥{product.originalPrice}</span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>库存：{product.stock}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  <span>已售：{product.sold}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">购买数量</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-primary-500 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-primary-500 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">小计</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ¥{(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-xl btn-hover flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入购物车
                </button>
                <button
                  onClick={() => {
                    addItem(product, quantity);
                    router.push('/checkout');
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl btn-hover"
                >
                  立即购买
                </button>
              </div>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">快速发货</p>
                    <p className="text-xs text-gray-600">支付后秒到账</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">安全可靠</p>
                    <p className="text-xs text-gray-600">官方渠道保障</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
