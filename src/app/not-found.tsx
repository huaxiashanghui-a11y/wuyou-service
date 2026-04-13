import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
          <span className="text-6xl">?</span>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">页面未找到</h2>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
