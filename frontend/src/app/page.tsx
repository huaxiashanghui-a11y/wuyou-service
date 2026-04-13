'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';

const navLinks = [
  { name: '首页', href: '/' },
  { name: '商品', href: '/shop' },
  { name: '订单', href: '/query' },
  { name: '帮助', href: '/help' },
];

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
  const { addItem } = useCartStore();

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 pt-16 pb-16">
        {/* Hero Banner - replaces left sidebar */}
        <div className="relative rounded-none overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 h-48 md:h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl md:text-4xl font-bold mb-2">
                  充小红书薯币
                </div>
                <div className="text-lg md:text-xl mb-4 opacity-90">
                  享更多优惠
                </div>
                <button className="bg-green-500 hover:bg-green-600 inline-block px-6 py-2 rounded-full text-sm font-medium transition-colors">
                  立即充值 &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-4 md:px-6">
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
        </div>

        {/* Bottom Navigation Tabs - replaces "更多充值" */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex flex-col items-center justify-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
