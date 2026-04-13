'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/store';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">无</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">无忧服务</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                首页
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                点卡商城
              </Link>
              <Link href="/query" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                订单查询
              </Link>
              <Link href="/help" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                帮助中心
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={toggleMobileMenu}
                >
                  首页
                </Link>
                <Link
                  href="/shop"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={toggleMobileMenu}
                >
                  点卡商城
                </Link>
                <Link
                  href="/query"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={toggleMobileMenu}
                >
                  订单查询
                </Link>
                <Link
                  href="/help"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={toggleMobileMenu}
                >
                  帮助中心
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
