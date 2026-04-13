import Link from 'next/link'
import { Github, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="glass mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">无</span>
              </div>
              <span className="text-2xl font-bold gradient-text">无忧服务</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              专业提供各类游戏点卡、充值服务的平台，安全可靠，快速到账。
              7x24小时在线服务，为您提供最佳购物体验。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-500 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-primary-500 transition-colors">
                  点卡商城
                </Link>
              </li>
              <li>
                <Link href="/query" className="text-gray-600 hover:text-primary-500 transition-colors">
                  订单查询
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-primary-500 transition-colors">
                  帮助中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">联系我们</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>support@wuyou.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>400-888-8888</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">服务时间: 7x24小时</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 无忧服务. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
