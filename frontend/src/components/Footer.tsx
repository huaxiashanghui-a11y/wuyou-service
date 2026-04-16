import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-nav border-t border-dark-border mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">无</span>
              </div>
              <span className="font-bold text-text-primary">无忧服务</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              无忧服务是专业的虚拟充值服务平台，提供抖音、小红书、游戏点卡等充值服务，7x24小时在线，自动发货，安全可靠。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-accent">快捷链接</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/" className="hover:text-accent transition-colors">首页</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">全部商品</Link></li>
              <li><Link href="/games" className="hover:text-accent transition-colors">游戏充值</Link></li>
              <li><Link href="/recharge" className="hover:text-accent transition-colors">话费充值</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold mb-4 text-accent">帮助中心</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/help" className="hover:text-accent transition-colors">常见问题</Link></li>
              <li><Link href="/help#payment" className="hover:text-accent transition-colors">支付帮助</Link></li>
              <li><Link href="/help#delivery" className="hover:text-accent transition-colors">发货说明</Link></li>
              <li><Link href="/help#refund" className="hover:text-accent transition-colors">退款政策</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-accent">联系我们</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>客服邮箱：support@wuyou-service.com</li>
              <li>客服微信：wuyou_service</li>
              <li>工作时间：7x24小时</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-border bg-dark-primary/50">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap items-center justify-center gap-4 text-text-secondary">
              <Link href="/terms" className="hover:text-accent transition-colors">服务条款</Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">隐私政策</Link>
              <Link href="/agreement" className="hover:text-accent transition-colors">用户协议</Link>
            </div>
            <div className="text-center text-text-muted">
              <p>© {new Date().getFullYear()} 无忧服务 版权所有</p>
              <p className="text-xs mt-1">ICP备案号：XXXXXXXX-1</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
