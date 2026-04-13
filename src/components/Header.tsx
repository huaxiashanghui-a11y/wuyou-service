'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingCart, Home, Grid3X3, Search, HelpCircle } from 'lucide-react';
import { useUIStore, useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/shop', label: '点卡商城', icon: Grid3X3 },
  { href: '/query', label: '订单查询', icon: Search },
  { href: '/help', label: '帮助中心', icon: HelpCircle },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart } = useUIStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-lg' : 'bg-white/80'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">无</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold gradient-text hidden sm:block">无忧服务</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 font-medium transition-colors duration-300 hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Admin Link */}
            <Link
              href="/admin/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium hover:shadow-lg transition-all"
            >
              <User className="w-4 h-4" />
              <span>管理后台</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium"
              >
                <User className="w-5 h-5" />
                <span>管理后台</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
