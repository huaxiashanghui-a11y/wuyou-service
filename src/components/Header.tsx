'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/shop', label: '点卡商城' },
    { href: '/query', label: '订单查询' },
    { href: '/help', label: '帮助中心' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : 'bg-white/80'}`}>
      <div className="container mx-auto px-4">
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-300 hover:text-primary-500 ${
                  pathname === item.href ? 'text-primary-500' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/admin"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span>管理后台</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-medium"
              >
                <User className="w-4 h-4" />
                <span>管理后台</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
