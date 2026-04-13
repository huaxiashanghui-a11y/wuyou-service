import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-purple-600">首页</Link>
            <Link href="/shop" className="hover:text-purple-600">商品</Link>
            <Link href="/query" className="hover:text-purple-600">订单</Link>
            <Link href="/help" className="hover:text-purple-600">帮助</Link>
          </div>
          <div className="text-center md:text-right">
            <p>© {new Date().getFullYear()} 94LIVES 版权所有</p>
            <p className="text-xs mt-1">24小时自动发货 | 安全支付 | 售后保障</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
