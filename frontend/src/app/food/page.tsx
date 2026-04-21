'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Truck, MapPin, Phone, Search, Filter, ShoppingCart } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

const ACCENT_COLOR = '#ff5722';

// Sample restaurants
const restaurants = [
  { id: 1, name: '川香麻辣烫', avatar: '🍲', rating: 4.8, sales: 9999, deliveryFee: 2, time: '25分钟', tags: ['川菜', '麻辣'], image: 'https://picsum.photos/300/200?random=21' },
  { id: 2, name: '老北京炸酱面', avatar: '🍜', rating: 4.9, sales: 8888, deliveryFee: 0, time: '30分钟', tags: ['面食', '北京'], image: 'https://picsum.photos/300/200?random=22' },
  { id: 3, name: '粤式早茶', avatar: '🥟', rating: 4.7, sales: 7777, deliveryFee: 3, time: '35分钟', tags: ['粤菜', '早茶'], image: 'https://picsum.photos/300/200?random=23' },
  { id: 4, name: '日式寿司', avatar: '🍣', rating: 4.6, sales: 6666, deliveryFee: 5, time: '40分钟', tags: ['日料', '寿司'], image: 'https://picsum.photos/300/200?random=24' },
  { id: 5, name: '汉堡快餐', avatar: '🍔', rating: 4.5, sales: 5555, deliveryFee: 1, time: '20分钟', tags: ['快餐', '汉堡'], image: 'https://picsum.photos/300/200?random=25' },
  { id: 6, name: '奶茶甜品', avatar: '🧋', rating: 4.8, sales: 4444, deliveryFee: 0, time: '15分钟', tags: ['饮品', '甜品'], image: 'https://picsum.photos/300/200?random=26' },
];

// Sample dishes
const dishes = [
  { id: 1, name: '招牌麻辣香锅', price: 35, originalPrice: 45, restaurant: '川香麻辣烫', image: 'https://picsum.photos/300/160?random=31', sold: 999 },
  { id: 2, name: '北京炸酱面', price: 18, originalPrice: 22, restaurant: '老北京炸酱面', image: 'https://picsum.photos/300/160?random=32', sold: 888 },
  { id: 3, name: '虾饺皇', price: 28, originalPrice: 35, restaurant: '粤式早茶', image: 'https://picsum.photos/300/160?random=33', sold: 777 },
  { id: 4, name: '三文鱼刺身', price: 68, originalPrice: 88, restaurant: '日式寿司', image: 'https://picsum.photos/300/160?random=34', sold: 666 },
  { id: 5, name: '双层牛肉堡', price: 25, originalPrice: 30, restaurant: '汉堡快餐', image: 'https://picsum.photos/300/160?random=35', sold: 555 },
  { id: 6, name: '珍珠奶茶大杯', price: 12, originalPrice: 15, restaurant: '奶茶甜品', image: 'https://picsum.photos/300/160?random=36', sold: 444 },
  { id: 7, name: '水煮鱼片', price: 48, originalPrice: 58, restaurant: '川香麻辣烫', image: 'https://picsum.photos/300/160?random=37', sold: 333 },
  { id: 8, name: '菠萝咕噜肉', price: 38, originalPrice: 48, restaurant: '粤式早茶', image: 'https://picsum.photos/300/160?random=38', sold: 222 },
];

export default function FoodPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('restaurants');

  return (
    <CategoryLayout accentColor={ACCENT_COLOR} title="同城外卖">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
          <span className="text-3xl">🍜</span>
          同城外卖
          <span className="text-sm font-normal text-text-muted ml-2">美食外卖</span>
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="搜索商家或美食..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-dark-border">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'restaurants' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-text-secondary hover:text-text-primary'}`}
          >
            商家列表
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'dishes' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-text-secondary hover:text-text-primary'}`}
          >
            美食推荐
          </button>
        </div>
      </div>

      {/* Restaurants Grid */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-dark-card rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer border border-dark-border hover:border-orange-500/50"
            >
              <div className="relative h-36">
                <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {restaurant.deliveryFee === 0 ? '免配送费' : `配送¥${restaurant.deliveryFee}`}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{restaurant.avatar}</span>
                  <div>
                    <h3 className="font-bold text-text-primary">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-orange-500 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-orange-500" /> {restaurant.rating}
                      </span>
                      <span className="text-text-muted">已售{restaurant.sales}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.time}</span>
                  <MapPin className="w-4 h-4 ml-2" />
                  <span>2.5km</span>
                </div>
                <div className="flex gap-2">
                  {restaurant.tags.map((tag, idx) => (
                    <span key={idx} className="bg-orange-500/20 text-orange-500 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dishes Grid */}
      {activeTab === 'dishes' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-dark-card rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer border border-dark-border hover:border-orange-500/50"
            >
              <div className="relative h-40">
                <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                {dish.originalPrice > dish.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{Math.round((1 - dish.price / dish.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-text-primary text-sm mb-1 truncate">{dish.name}</h3>
                <p className="text-text-muted text-xs mb-2">{dish.restaurant}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-orange-500 font-bold">¥{dish.price}</span>
                    {dish.originalPrice > dish.price && (
                      <span className="text-text-muted text-xs line-through ml-1">¥{dish.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-text-muted text-xs">已售{dish.sold}</span>
                </div>
                <button className="w-full mt-2 py-2 border-2 border-orange-500 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors">
                  加入购物车
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CategoryLayout>
  );
}
