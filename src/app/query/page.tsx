'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Mail, CheckCircle, Copy, AlertCircle, Package } from 'lucide-react';
import { Order } from '@/lib/types';

// 模拟订单数据
const mockOrders: Record<string, Order> = {
  'WY20240115001': {
    id: '1',
    orderId: 'WY20240115001',
    email: 'user@example.com',
    productId: '1',
    productName: '王者荣耀点卡 100元',
    productImage: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=100&h=100&fit=crop',
    quantity: 1,
    unitPrice: 95,
    totalAmount: 95,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:05Z',
    paymentTime: '2024-01-15T10:30:05Z',
    cards: [
      { code: 'WYRC-ABCD-1234-5678' },
      { code: 'WYRC-EFGH-9876-5432' }
    ]
  }
};

function QueryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOrderId = searchParams.get('orderId') || '';
  
  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId && !email) {
      setError('请输入订单号或邮箱');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundOrder = mockOrders[orderId];
      
      if (foundOrder) {
        if (email && foundOrder.email !== email) {
          setError('订单邮箱不匹配');
        } else {
          setOrder(foundOrder);
        }
      } else {
        setError('未找到订单，请检查订单号或邮箱');
      }
    } catch (err) {
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: '待支付',
      paid: '已支付',
      delivered: '已发卡',
      completed: '已完成',
      cancelled: '已取消',
      refunded: '已退款'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-blue-100 text-blue-700',
      delivered: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-700',
      refunded: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="container-custom py-8">
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
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
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
          <div className="glass rounded-2xl overflow-hidden animate-fade-in">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">订单详情</h2>
                  <p className="text-sm opacity-90">订单号: {order.orderId}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{order.productName}</h3>
                  <p className="text-gray-500 text-sm">
                    数量: {order.quantity} | 单价: ¥{order.unitPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-500">
                    ¥{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">购买邮箱</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">下单时间</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                {order.paymentTime && (
                  <div>
                    <p className="text-gray-500">支付时间</p>
                    <p className="font-medium">{new Date(order.paymentTime).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cards */}
            {order.cards && order.cards.length > 0 && (
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary-500" />
                  您的卡密
                </h3>
                <div className="space-y-3">
                  {order.cards.map((card, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          卡密 #{index + 1}
                        </span>
                        <button
                          onClick={() => copyToClipboard(card.code, `card-${index}`)}
                          className="text-sm text-primary-500 hover:text-primary-600 flex items-center space-x-1"
                        >
                          <Copy className="w-4 h-4" />
                          <span>{copiedId === `card-${index}` ? '已复制' : '复制'}</span>
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
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-3">
                <span className="text-primary-500 font-bold">1.</span>
                <span>输入订单号可快速查询您的订单和卡密</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-500 font-bold">2.</span>
                <span>也可以输入购买时填写的邮箱地址查询所有订单</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-500 font-bold">3.</span>
                <span>购买成功后，卡密会同时发送到您的邮箱</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary-500 font-bold">4.</span>
                <span>如有疑问，请联系客服获取帮助</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QueryPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      </div>
    }>
      <QueryContent />
    </Suspense>
  );
}
