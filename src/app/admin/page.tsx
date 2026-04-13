'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalCards: number
  totalRevenue: number
  todayOrders: number
  todayRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCards: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  })

  useEffect(() => {
    // Demo data
    setStats({
      totalProducts: 8,
      totalOrders: 156,
      totalCards: 2456,
      totalRevenue: 12890.50,
      todayOrders: 12,
      todayRevenue: 980.00
    })
  }, [])

  const statCards = [
    {
      title: '商品总数',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up'
    },
    {
      title: '订单总数',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      trend: 'up'
    },
    {
      title: '卡密总数',
      value: stats.totalCards,
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      change: '-3%',
      trend: 'down'
    },
    {
      title: '总收入',
      value: `¥${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-primary-500 to-secondary-500',
      change: '+15%',
      trend: 'up'
    }
  ]

  const recentOrders = [
    { id: 'ORD001', product: '王者荣耀点卡 100元', amount: 95, status: 'completed', time: '2分钟前' },
    { id: 'ORD002', product: '原神月卡 30元', amount: 28, status: 'completed', time: '5分钟前' },
    { id: 'ORD003', product: 'Steam充值卡 100美元', amount: 680, status: 'pending', time: '10分钟前' },
    { id: 'ORD004', product: '腾讯视频VIP月卡', amount: 20, status: 'completed', time: '15分钟前' },
    { id: 'ORD005', product: '网易云音乐VIP年卡', amount: 158, status: 'completed', time: '20分钟前' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
          <p className="text-gray-500">欢迎回来！以下是今日概览</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">今日数据</p>
          <p className="text-2xl font-bold text-primary-500">
            {stats.todayOrders} 订单 / ¥{stats.todayRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          )
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary-500">¥{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.status === 'completed' ? '已完成' : '处理中'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
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
  )
}
