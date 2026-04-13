'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingCart, User, Bell } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartDrawer from './CartDrawer';

const tabs = ['全部', '热门', '新品', '推荐', '折扣'];
const navLinks = ['首页', '商品', '订单', '帮助'];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('全部');
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        {/* Top Navigation Bar */}
        <div className="bg-gray-100 border-b">
          <div className="flex items-center px-4 md:px-6 h-9">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={link === '首页' ? '/' : link === '商品' ? '/shop' : link === '订单' ? '/query' : '/help'}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">无</span>
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:block">无忧服务</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索商品"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <div className="bg-gray-100 border-b">
          <div className="flex items-center px-4 md:px-6 h-10">
            {navLinks.map((link) => (
              <Link
                key={link}
                href={link === '首页' ? '/' : link === '商品' ? '/shop' : link === '订单' ? '/query' : '/help'}
                className="px-4 py-1 text-sm text-gray-700 hover:text-purple-600 transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
