import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">无</span>
              </div>
              <span className="text-xl font-bold text-white">无忧服务</span>
            </div>
            <p className="text-gray-400 mb-4">
              专业游戏点卡商城，提供王者荣耀、原神、Steam等游戏点卡充值服务。
              安全快速，自动发货，让您购物无忧。
            </p>
            <div className="flex space-x-4">
              <span className="text-sm text-gray-500">24小时自动发货</span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-500">安全支付</span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-500">售后保障</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快捷链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="hover:text-primary-400 transition-colors">
                  点卡商城
                </Link>
              </li>
              <li>
                <Link href="/query" className="hover:text-primary-400 transition-colors">
                  订单查询
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary-400 transition-colors">
                  帮助中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">售后服务</h3>
            <ul className="space-y-2">
              <li className="text-sm">
                客服邮箱：support@wuyou.com
              </li>
              <li className="text-sm">
                客服热线：400-888-8888
              </li>
              <li className="text-sm">
                工作时间：9:00 - 21:00
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 无忧服务 版权所有</p>
          <p className="mt-2">
            本商城仅提供数字商品充值服务，不支持退换货
          </p>
        </div>
      </div>
    </footer>
  );
}
