'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { Search, Filter, Grid, List, Package } from 'lucide-react';

// 模拟商品数据
const allProducts: Product[] = [
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
  }
];

const categories = [
  { id: 'all', name: '全部' },
  { id: 'game', name: '游戏点卡' },
  { id: 'gift', name: '礼品卡' },
  { id: 'recharge', name: '话费充值' },
  { id: 'other', name: '增值服务' }
];

const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'price-low', label: '价格从低到高' },
  { value: 'price-high', label: '价格从高到低' },
  { value: 'sales', label: '销量优先' }
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = allProducts
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'sales':
          return b.sold - a.sold;
        default:
          return a.sort - b.sort;
      }
    });

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">点卡商城</h1>
        <p className="text-gray-600">浏览我们精选的游戏点卡和充值服务</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        找到 {filteredProducts.length} 个商品
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">未找到相关商品</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-primary-500 hover:text-primary-600 font-medium"
          >
            清空筛选条件
          </button>
        </div>
      )}
    </div>
  );
}
