import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const quickLinks = [
  { href: '/', label: '首页' },
  { href: '/shop', label: '点卡商城' },
  { href: '/query', label: '订单查询' },
  { href: '/help', label: '帮助中心' },
];

const categories = [
  { href: '/shop?category=game', label: '游戏点卡' },
  { href: '/shop?category=gift', label: '礼品卡' },
  { href: '/shop?category=recharge', label: '话费充值' },
  { href: '/shop?category=other', label: '其他服务' },
];

export default function Footer() {
  return (
    <footer className="glass mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">无</span>
              </div>
              <span className="text-2xl font-bold gradient-text">无忧服务</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              专业提供各类游戏点卡、充值服务的平台。安全可靠，快速到账，7x24小时在线服务。
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>support@wuyou.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>400-888-8888</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>服务时间: 7x24小时</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">快速链接</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-600 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">商品分类</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-gray-600 hover:text-primary-500 transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} 无忧服务. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
