'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Mail, CheckCircle, Copy, AlertCircle } from 'lucide-react'

function QueryContent() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId && !email) {
      setError('请输入订单号或邮箱')
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await fetch(`/api/orders/query?orderId=${orderId}&email=${email}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.order)
      } else {
        setError(data.message || '未找到订单')
      }
    } catch (err) {
      setError('查询失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">订单查询</h1>
          <p className="text-gray-600">输入订单号或邮箱查询您的卡密</p>
        </div>

        {/* Search Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  订单号
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="请输入订单号"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  或邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入购买时填写的邮箱"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? '查询中...' : '查询订单'}</span>
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="glass rounded-2xl p-6 mb-8 border-2 border-red-200">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="glass rounded-2xl overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">订单详情</h2>
                  <p className="text-sm opacity-90">订单号: {order.orderId}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  order.status === 'completed'
                    ? 'bg-green-500'
                    : order.status === 'paid'
                    ? 'bg-blue-500'
                    : 'bg-yellow-500'
                }`}>
                  {order.status === 'completed' ? '已完成' : order.status === 'paid' ? '已支付' : '处理中'}
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">商品名称</p>
                  <p className="font-medium">{order.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">购买数量</p>
                  <p className="font-medium">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">总价</p>
                  <p className="font-medium text-primary-500">¥{order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">购买时间</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Cards */}
            {order.cards && order.cards.length > 0 && (
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-primary-500" />
                  您的卡密
                </h3>
                <div className="space-y-3">
                  {order.cards.map((card: any, index: number) => (
                    <div
                      key={card.id || index}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          卡密 #{index + 1}
                        </span>
                        <button
                          onClick={() => copyToClipboard(card.code, `${card.id || index}`)}
                          className="text-sm text-primary-500 hover:text-primary-600 flex items-center space-x-1"
                        >
                          <Copy className="w-4 h-4" />
                          <span>{copied === `${card.id || index}` ? '已复制' : '复制'}</span>
                        </button>
                      </div>
                      <p className="font-mono text-lg bg-white px-4 py-2 rounded-lg border border-gray-200 select-all">
                        {card.code}
                      </p>
                      {card.password && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">密码 (如有)</p>
                          <p className="font-mono text-lg bg-white px-4 py-2 rounded-lg border border-gray-200 select-all">
                            {card.password}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">卡密已发送至您的邮箱</p>
                      <p className="text-sm text-green-600 mt-1">
                        请妥善保管您的卡密，切勿泄露给他人。如有疑问请联系客服。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!order && !error && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">查询说明</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">1.</span>
                <span>输入订单号可快速查询您的订单和卡密</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">2.</span>
                <span>也可以输入购买时填写的邮箱地址查询所有订单</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">3.</span>
                <span>购买成功后，卡密会同时发送到您的邮箱</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500">4.</span>
                <span>如有疑问，请联系客服获取帮助</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QueryPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">加载中...</div>}>
      <QueryContent />
    </Suspense>
  )
}
