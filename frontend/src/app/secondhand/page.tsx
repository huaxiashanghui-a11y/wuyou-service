'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Star, User, MapPin, Clock, Heart, Share2, MessageCircle } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

const ACCENT_COLOR = '#ff9800';

const products = [
  { id: 1, title: 'iPhone 14 Pro Max 256G', price: 5999, originalPrice: 8999, condition: '99新', conditionColor: 'bg-green-500', seller: '数码达人', sellerRating: 4.9, location: '深圳南山', time: '1小时前', image: 'https://picsum.photos/300/300?random=51', sold: false },
  { id: 2, title: 'MacBook Air M2 8+256', price: 6500, originalPrice: 9499, condition: '95新', conditionColor: 'bg-blue-500', seller: '果粉之家', sellerRating: 4.8, location: '广州天河', time: '3小时前', image: 'https://picsum.photos/300/300?random=52', sold: false },
  { id: 3, title: '索尼WH-1000XM5耳机', price: 1800, originalPrice: 2699, condition: '全新', conditionColor: 'bg-orange-500', seller: '音乐发烧友', sellerRating: 5.0, location: '深圳福田', time: '5小时前', image: 'https://picsum.photos/300/300?random=53', sold: true },
  { id: 4, title: 'Switch OLED 日版', price: 1800, originalPrice: 2599, condition: '9成新', conditionColor: 'bg-yellow-500', seller: '游戏玩家', sellerRating: 4.7, location: '深圳宝安', time: '昨天', image: 'https://picsum.photos/300/300?random=54', sold: false },
  { id: 5, title: '戴森V15吸尘器', price: 2800, originalPrice: 5499, condition: '95新', conditionColor: 'bg-blue-500', seller: '家居达人', sellerRating: 4.9, location: '广州越秀', time: '2天前', image: 'https://picsum.photos/300/300?random=55', sold: false },
  { id: 6, title: '小米13 Ultra 512G', price: 3500, originalPrice: 4999, condition: '99新', conditionColor: 'bg-green-500', seller: '数码玩家', sellerRating: 4.6, location: '深圳龙岗', time: '3天前', image: 'https://picsum.photos/300/300?random=56', sold: false },
  { id: 7, title: 'AirPods Pro 2代', price: 1200, originalPrice: 1899, condition: '全新', conditionColor: 'bg-orange-500', seller: '苹果粉', sellerRating: 4.8, location: '广州海珠', time: '1周前', image: 'https://picsum.photos/300/300?random=57', sold: true },
  { id: 8, title: 'iPad Pro 12.9 2022', price: 5500, originalPrice: 9299, condition: '98新', conditionColor: 'bg-green-500', seller: '设计师', sellerRating: 4.9, location: '深圳南山', time: '1周前', image: 'https://picsum.photos/300/300?random=58', sold: false },
];

const categories = ['全部', '数码电子', '家居用品', '服饰箱包', '图书文具', '运动户外'];

export default function SecondhandPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('latest');

  return (
    <CategoryLayout accentColor={ACCENT_COLOR} title="二手商品">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
          <span className="text-3xl">🔄</span>
          二手商品
          <span className="text-sm font-normal text-text-muted ml-2">闲置交易</span>
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="搜索二手商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-orange-500 text-white' : 'bg-dark-card text-text-secondary hover:bg-dark-card border border-dark-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">共 {products.length} 件商品</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none"
          >
            <option value="latest">最新发布</option>
            <option value="price_low">价格从低到高</option>
            <option value="price_high">价格从高到低</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-dark-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-dark-border hover:border-orange-500/50 ${product.sold ? 'opacity-70' : ''}`}
          >
            <div className="relative h-40">
              <Image src={product.image} alt={product.title} fill className="object-cover" />
              <div className={`absolute top-2 left-2 ${product.conditionColor} text-white text-xs px-2 py-1 rounded`}>
                {product.condition}
              </div>
              {product.sold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold">已售出</span>
                </div>
              )}
              <button className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-text-primary text-sm mb-2 line-clamp-2">{product.title}</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-500 font-bold">¥{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-text-muted text-xs line-through">¥{product.originalPrice}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="flex text-orange-500">
                    {Array.from({ length: Math.floor(product.sellerRating) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-orange-500" />
                    ))}
                  </div>
                  <span className="text-text-muted">{product.sellerRating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted mt-2 pt-2 border-t border-dark-border">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{product.seller}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Button */}
      <div className="fixed bottom-6 right-6 lg:right-24">
        <button className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
          <span className="text-2xl">+</span>
        </button>
      </div>
    </CategoryLayout>
  );
}
