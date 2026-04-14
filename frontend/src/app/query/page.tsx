'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Order } from '@/lib/types';

export default function QueryPage() {
  const [searchType, setSearchType] = useState<'orderNo' | 'email' | 'phone'>('orderNo');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setSearched(true);

    // 模拟搜索
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 模拟返回结果
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNo: 'WY202401150001',
        productId: '1',
        productName: '王者荣耀点卡 100元',
        productImage: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=100&h=100&fit=crop',
        quantity: 1,
        price: 95,
        totalPrice: 95,
        status: 'completed',
        paymentMethod: 'alipay',
        paidAt: '2024-01-15 10:30:00',
        deliveredAt: '2024-01-15 10:30:05',
        completedAt: '2024-01-15 10:30:10',
        cards: [
          { code: 'WK-ABCD-1234-5678-9012', password: 'pass1234' },
        ],
        buyerEmail: searchType === 'email' ? searchValue : 'customer@example.com',
        createdAt: '2024-01-15 10:30:00',
        updatedAt: '2024-01-15 10:30:10',
      },
    ];

    setOrders(mockOrders);
    setLoading(false);
  };

  const getStatusInfo = (status: Order['status']) => {
    const statusMap = {
      pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      paid: { label: '已支付', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { label: '处理中', color: 'bg-orange-100 text-orange-800', icon: Clock },
      delivered: { label: '已发货', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      refunded: { label: '已退款', color: 'bg-red-100 text-red-800', icon: AlertCircle },
    };
    return statusMap[status];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">订单查询</h1>
            <p className="text-gray-600">输入订单号或联系方式查询您的订单</p>
          </div>

          {/* Search Form */}
          <div className="glass rounded-2xl p-6 mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Type Tabs */}
                <div className="flex gap-2 md:w-64">
                  <button
                    type="button"
                    onClick={() => setSearchType('orderNo')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'orderNo'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    订单号
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('email')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'email'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    邮箱
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('phone')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'phone'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    手机
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex-grow relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={searchType === 'email' ? 'email' : searchType === 'phone' ? 'tel' : 'text'}
                    placeholder={
                      searchType === 'orderNo'
                        ? '请输入订单号'
                        : searchType === 'email'
                        ? '请输入邮箱地址'
                        : '请输入手机号码'
                    }
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !searchValue.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-orange-600 text-white font-semibold rounded-xl btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '查询中...' : '查询'}
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6">
                  <div className="h-32 skeleton rounded" />
                </div>
              ))}
            </div>
          ) : searched && orders.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">未找到相关订单</p>
              <p className="text-gray-400 mt-2">请检查您的输入是否正确</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div key={order.id} className="glass rounded-2xl overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">订单号：</span>
                        <span className="font-mono font-semibold">{order.orderNo}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{order.productName}</h3>
                          <p className="text-gray-500 mt-1">
                            数量：{order.quantity} × ¥{order.price}
                          </p>
                          <p className="text-xl font-bold text-primary-600 mt-2">
                            ¥{order.totalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Cards */}
                      {order.cards && order.cards.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-3">您的卡密</h4>
                          <div className="space-y-2">
                            {order.cards.map((card, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-sm">{card.code}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(card.code);
                                    }}
                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                  >
                                    复制
                                  </button>
                                </div>
                                {card.password && (
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                    <span className="font-mono text-sm text-gray-600">
                                      密码：{card.password}
                                    </span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(card.password || '');
                                      }}
                                      className="text-primary-600 hover:text-primary-700 text-sm"
                                    >
                                      复制
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Time Info */}
                      <div className="mt-4 text-sm text-gray-500">
                        下单时间：{order.createdAt}
                        {order.paidAt && (
                          <span className="ml-4">支付时间：{order.paidAt}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
