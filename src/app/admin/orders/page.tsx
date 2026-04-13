'use client'

import { useState } from 'react'
import { Search, Eye, Download, CheckCircle, Clock, XCircle, Mail } from 'lucide-react'

interface Order {
  id: string
  orderId: string
  email: string
  productName: string
  quantity: number
  totalAmount: number
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  createdAt: string
  paidAt?: string
  cards: string[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderId: 'WY20240115001',
      email: 'user1@example.com',
      productName: '王者荣耀点卡 100元',
      quantity: 1,
      totalAmount: 95,
      status: 'completed',
      createdAt: '2024-01-15 10:30:00',
      paidAt: '2024-01-15 10:30:05',
      cards: ['WYRC-ABCD-1234-5678']
    },
    {
      id: '2',
      orderId: 'WY20240115002',
      email: 'user2@example.com',
      productName: '原神月卡 30元',
      quantity: 2,
      totalAmount: 56,
      status: 'paid',
      createdAt: '2024-01-15 11:00:00',
      paidAt: '2024-01-15 11:00:10'
    },
    {
      id: '3',
      orderId: 'WY20240115003',
      email: 'user3@example.com',
      productName: 'Steam充值卡 100美元',
      quantity: 1,
      totalAmount: 680,
      status: 'pending',
      createdAt: '2024-01-15 12:00:00'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  }

  const handleUpdateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status: newStatus, paidAt: newStatus === 'paid' ? new Date().toISOString() : o.paidAt } : o
    ))
  }

  const handleExport = () => {
    const csv = filteredOrders.map(o =>
      `${o.orderId},${o.email},${o.productName},${o.quantity},${o.totalAmount},${o.status},${o.createdAt}`
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-export-${Date.now()}.csv`
    a.click()
  }

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
          <p className="text-sm text-gray-500 mb-1">总收入</p>
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
            <option value="pending">待处理</option>
            <option value="paid">已支付</option>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-600' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {order.status === 'completed' ? '已完成' :
                       order.status === 'paid' ? '已支付' :
                       order.status === 'pending' ? '待处理' : '已取消'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.createdAt}</td>
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
                <XCircle className="w-6 h-6" />
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.status === 'completed' ? 'bg-green-100 text-green-600' :
                    selectedOrder.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {selectedOrder.status === 'completed' ? '已完成' :
                     selectedOrder.status === 'paid' ? '已支付' :
                     selectedOrder.status === 'pending' ? '待处理' : '已取消'}
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
                  <p className="font-medium">{selectedOrder.createdAt}</p>
                </div>
                {selectedOrder.paidAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">支付时间</p>
                    <p className="font-medium">{selectedOrder.paidAt}</p>
                  </div>
                )}
              </div>

              {/* Cards */}
              {selectedOrder.cards && selectedOrder.cards.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-3">卡密列表</p>
                  <div className="space-y-2">
                    {selectedOrder.cards.map((card, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'paid')
                      setSelectedOrder(null)
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    标记已支付
                  </button>
                )}
                {selectedOrder.status === 'paid' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'completed')
                      setSelectedOrder(null)
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    完成订单
                  </button>
                )}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'cancelled')
                      setSelectedOrder(null)
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
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
  )
}
