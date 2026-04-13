'use client';

import { useState } from 'react';
import { Search, Eye, Download, CheckCircle, Clock, XCircle, Mail, X, RefreshCw } from 'lucide-react';
import { Order } from '@/lib/types';

// 模拟订单数据
const initialOrders: Order[] = [
  {
    id: '1',
    orderId: 'WY20240115001',
    email: 'user1@example.com',
    productId: '1',
    productName: '王者荣耀点卡 100元',
    productImage: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=100&h=100&fit=crop',
    quantity: 1,
    unitPrice: 95,
    totalAmount: 95,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:05Z',
    paymentTime: '2024-01-15T10:30:05Z'
  },
  {
    id: '2',
    orderId: 'WY20240115002',
    email: 'user2@example.com',
    productId: '2',
    productName: '原神月卡 30元',
    productImage: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=100&h=100&fit=crop',
    quantity: 2,
    unitPrice: 28,
    totalAmount: 56,
    status: 'paid',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:10Z',
    paymentTime: '2024-01-15T11:00:10Z'
  },
  {
    id: '3',
    orderId: 'WY20240115003',
    email: 'user3@example.com',
    productId: '3',
    productName: 'Steam充值卡 100美元',
    productImage: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=100&h=100&fit=crop',
    quantity: 1,
    unitPrice: 680,
    totalAmount: 680,
    status: 'delivered',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:15Z',
    paymentTime: '2024-01-15T12:00:15Z',
    cards: [
      { code: 'STMC-IJKL-2468-1357', password: 'PWD123' }
    ]
  },
  {
    id: '4',
    orderId: 'WY20240115004',
    email: 'user4@example.com',
    productId: '4',
    productName: '腾讯视频VIP月卡',
    productImage: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&h=100&fit=crop',
    quantity: 1,
    unitPrice: 20,
    totalAmount: 20,
    status: 'completed',
    createdAt: '2024-01-15T13:00:00Z',
    updatedAt: '2024-01-15T13:00:05Z',
    paymentTime: '2024-01-15T13:00:05Z'
  },
  {
    id: '5',
    orderId: 'WY20240115005',
    email: 'user5@example.com',
    productId: '5',
    productName: '网易云音乐VIP年卡',
    productImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    quantity: 1,
    unitPrice: 158,
    totalAmount: 158,
    status: 'pending',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'paid').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  const handleUpdateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    ));
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleExport = () => {
    const csv = filteredOrders.map(o =>
      `${o.orderId},${o.email},${o.productName},${o.quantity},${o.totalAmount},${getStatusLabel(o.status)},${o.createdAt}`
    ).join('\n');

    const blob = new Blob([`订单号,邮箱,商品,数量,金额,状态,时间\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${Date.now()}.csv`;
    a.click();
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<string, string> = {
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
    const colors: Record<string, string> = {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
          <p className="text-gray-500">查看和管理所有订单</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>导出订单</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">总订单数</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">已完成</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">待处理</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">已完成收入</p>
          <p className="text-2xl font-bold text-primary-500">¥{stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号或邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          >
            <option value="all">全部状态</option>
            <option value="pending">待支付</option>
            <option value="paid">已支付</option>
            <option value="delivered">已发卡</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>
                      <p>{order.productName}</p>
                      <p className="text-xs text-gray-400">x{order.quantity}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{order.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-primary-500">
                    ¥{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'paid')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="标记已支付"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="发货"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="完成订单"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">订单详情</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">订单号</p>
                  <p className="font-medium">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">状态</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">邮箱</p>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">金额</p>
                  <p className="font-medium text-primary-500">¥{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">商品</p>
                  <p className="font-medium">{selectedOrder.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">数量</p>
                  <p className="font-medium">x{selectedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">创建时间</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                {selectedOrder.paymentTime && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">支付时间</p>
                    <p className="font-medium">{new Date(selectedOrder.paymentTime).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Cards */}
              {selectedOrder.cards && selectedOrder.cards.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">卡密列表</p>
                  <div className="space-y-2">
                    {selectedOrder.cards.map((card, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-mono text-sm">卡密: {card.code}</p>
                        {card.password && (
                          <p className="font-mono text-sm text-gray-600">密码: {card.password}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'paid');
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    标记已支付
                  </button>
                )}
                {selectedOrder.status === 'paid' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'delivered');
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    发货
                  </button>
                )}
                {selectedOrder.status === 'delivered' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'completed');
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    完成订单
                  </button>
                )}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && selectedOrder.status !== 'refunded' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    取消订单
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
