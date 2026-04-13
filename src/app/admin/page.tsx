'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { Order, Product } from '@/lib/types';

// 模拟数据
const mockStats = {
  totalProducts: 8,
  totalOrders: 156,
  totalRevenue: 12890.50,
  totalCards: 2456,
  availableCards: 1890,
  todayOrders: 12,
  todayRevenue: 980.00
};

const mockRecentOrders: Order[] = [
  {
    id: '1',
    orderId: 'WY20240115001',
    email: 'user1@example.com',
    productId: '1',
    productName: '王者荣耀点卡 100元',
    quantity: 1,
    unitPrice: 95,
    totalAmount: 95,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    orderId: 'WY20240115002',
    email: 'user2@example.com',
    productId: '2',
    productName: '原神月卡 30元',
    quantity: 2,
    unitPrice: 28,
    totalAmount: 56,
    status: 'paid',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    orderId: 'WY20240115003',
    email: 'user3@example.com',
    productId: '3',
    productName: 'Steam充值卡 100美元',
    quantity: 1,
    unitPrice: 680,
    totalAmount: 680,
    status: 'delivered',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    orderId: 'WY20240115004',
    email: 'user4@example.com',
    productId: '4',
    productName: '腾讯视频VIP月卡',
    quantity: 1,
    unitPrice: 20,
    totalAmount: 20,
    status: 'completed',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    orderId: 'WY20240115005',
    email: 'user5@example.com',
    productId: '5',
    productName: '网易云音乐VIP年卡',
    quantity: 1,
    unitPrice: 158,
    totalAmount: 158,
    status: 'pending',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);

  const statCards = [
    {
      title: '商品总数',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: '订单总数',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: '可用卡密',
      value: `${stats.availableCards}/${stats.totalCards}`,
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: '总收入',
      value: `¥${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-primary-500 to-secondary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    }
  ];

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

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
          <p className="text-gray-500">欢迎回来！以下是今日概览</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">今日数据</p>
          <p className="text-2xl font-bold text-primary-500">
            {stats.todayOrders} 订单 / ¥{stats.todayRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">最近订单</h2>
            <Link href="/admin/orders" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              查看全部
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockRecentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.productName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary-500">¥{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{getTimeAgo(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary-500 hover:text-primary-600">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-500 transition-colors">商品管理</h3>
              <p className="text-sm text-gray-500">添加、编辑、删除商品</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/cards"
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-800 group-hover:text-purple-500 transition-colors">卡密管理</h3>
              <p className="text-sm text-gray-500">批量导入、查看卡密</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-800 group-hover:text-green-500 transition-colors">订单管理</h3>
              <p className="text-sm text-gray-500">查看和处理订单</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
