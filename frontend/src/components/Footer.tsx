import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-nav border-t border-dark-border mt-auto">
      {/* Main Footer - 3 Column Layout */}
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1: Brand Logo + Contact Us */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">WY</span>
              </div>
              <div>
                <span className="font-bold text-text-primary text-lg">无忧服务</span>
                <p className="text-xs text-text-muted">WY.ai</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              专业的虚拟充值服务平台，提供游戏点卡、视频会员、话费充值等服务。7x24小时在线，自动发货，安全可靠。
            </p>
            <h4 className="font-bold text-text-primary mb-3">联系我们</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-colors">
                <span className="text-lg">💬</span>
              </a>
              <a href="#" className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                <span className="text-lg">🐧</span>
              </a>
              <a href="#" className="w-9 h-9 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-colors">
                <span className="text-lg">✈️</span>
              </a>
              <a href="#" className="w-9 h-9 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-colors">
                <span className="text-lg">📧</span>
              </a>
            </div>
          </div>

          {/* Column 2: Payment Methods */}
          <div>
            <h4 className="font-bold text-text-primary mb-4">平台支持的付款方式</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-dark-card rounded-lg p-3 flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">微信</span>
                </div>
                <span className="text-xs text-text-muted">微信支付</span>
              </div>
              <div className="bg-dark-card rounded-lg p-3 flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">支</span>
                </div>
                <span className="text-xs text-text-muted">支付宝</span>
              </div>
              <div className="bg-dark-card rounded-lg p-3 flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">银</span>
                </div>
                <span className="text-xs text-text-muted">银联卡</span>
              </div>
              <div className="bg-dark-card rounded-lg p-3 flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">USDT</span>
                </div>
                <span className="text-xs text-text-muted">加密货币</span>
              </div>
            </div>
          </div>

          {/* Column 3: About Platform - 横排显示 */}
          <div>
            <h4 className="font-bold text-text-primary mb-4">关于平台</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h5 className="text-sm font-medium text-orange-500 mb-2">平台服务</h5>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li><Link href="/shop" className="hover:text-orange-500 transition-colors">全部商品</Link></li>
                  <li><Link href="/games" className="hover:text-orange-500 transition-colors">游戏充值</Link></li>
                  <li><Link href="/recharge" className="hover:text-orange-500 transition-colors">话费充值</Link></li>
                  <li><Link href="/shop" className="hover:text-orange-500 transition-colors">会员充值</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-orange-500 mb-2">购物指南</h5>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li><Link href="/help" className="hover:text-orange-500 transition-colors">常见问题</Link></li>
                  <li><Link href="/help#payment" className="hover:text-orange-500 transition-colors">支付帮助</Link></li>
                  <li><Link href="/help#delivery" className="hover:text-orange-500 transition-colors">发货说明</Link></li>
                  <li><Link href="/help#refund" className="hover:text-orange-500 transition-colors">退款政策</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-orange-500 mb-2">合作互动</h5>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li><Link href="/terms" className="hover:text-orange-500 transition-colors">服务条款</Link></li>
                  <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">隐私政策</Link></li>
                  <li><Link href="/agreement" className="hover:text-orange-500 transition-colors">用户协议</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - 版权居中 */}
      <div className="border-t border-dark-border bg-dark-primary/50">
        <div className="container-custom py-4">
          <div className="text-center text-text-muted text-sm">
            <p>© {new Date().getFullYear()} 无忧服务 版权所有</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
