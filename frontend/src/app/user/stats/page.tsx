'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  Wallet,
  Star,
  Gift,
  Heart,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  BarChart3,
  PieChart
} from 'lucide-react';

// 统计数据
const statsData = {
  totalBalance: 1280.00,
  totalPoints: 580,
  couponsCount: 3,
  favoritesCount: 12,
  reviewsCount: 5,
  pendingOrders: 2,
  monthlySpending: 2500,
  totalOrders: 45,
};

// 消费趋势数据（简化版柱状图）
const spendingData = [
  { month: '1月', amount: 1200 },
  { month: '2月', amount: 1800 },
  { month: '3月', amount: 1500 },
  { month: '4月', amount: 2500 },
];

// 订单分类统计
const categoryData = [
  { name: '充值服务', percentage: 45, color: 'bg-orange-500' },
  { name: '外卖订餐', percentage: 30, color: 'bg-blue-500' },
  { name: '跑腿服务', percentage: 15, color: 'bg-green-500' },
  { name: '其他服务', percentage: 10, color: 'bg-purple-500' },
];

export default function StatsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const maxSpending = Math.max(...spendingData.map(d => d.amount));

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">数据统计</h1>

        {/* 时间范围选择 */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#252525] text-[#ccc] hover:bg-[#333]'
              }`}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '本年'}
            </button>
          ))}
        </div>

        {/* 账户总览 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Wallet, label: '账户余额', value: `¥${statsData.totalBalance.toLocaleString()}`, color: 'text-green-500', bg: 'bg-green-500/20' },
            { icon: Star, label: '我的积分', value: statsData.totalPoints.toString(), color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
            { icon: Gift, label: '优惠券', value: `${statsData.couponsCount}张`, color: 'text-orange-500', bg: 'bg-orange-500/20' },
            { icon: Heart, label: '我的收藏', value: `${statsData.favoritesCount}个`, color: 'text-pink-500', bg: 'bg-pink-500/20' },
            { icon: MessageSquare, label: '我的评价', value: `${statsData.reviewsCount}条`, color: 'text-blue-500', bg: 'bg-blue-500/20' },
            { icon: TrendingUp, label: '待处理订单', value: `${statsData.pendingOrders}笔`, color: 'text-purple-500', bg: 'bg-purple-500/20' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-[#252525] rounded-xl p-4">
                <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
                <p className="text-[#888] text-sm">{item.label}</p>
              </div>
            );
          })}
        </div>

        {/* 消费趋势图表 */}
        <div className="bg-[#252525] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              消费趋势
            </h3>
            <span className="text-[#888] text-sm">单位: 元</span>
          </div>

          {/* 简化柱状图 */}
          <div className="flex items-end justify-between gap-4 h-48">
            {spendingData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-end justify-center flex-1">
                  <div
                    className="w-full max-w-12 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-orange-500"
                    style={{ height: `${(item.amount / maxSpending) * 100}%` }}
                  />
                </div>
                <p className="text-[#888] text-xs mt-2">{item.month}</p>
                <p className="text-white text-sm font-medium">{item.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 订单分类统计 */}
        <div className="bg-[#252525] rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-500" />
            订单分类统计
          </h3>

          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#ccc] text-sm">{item.name}</span>
                  <span className="text-white font-medium">{item.percentage}%</span>
                </div>
                <div className="h-3 bg-[#333] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="bg-[#252525] rounded-xl p-4">
          <h3 className="text-white font-bold mb-4">快捷入口</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: '我的余额', icon: Wallet, href: '/user/wallet' },
              { label: '我的积分', icon: Star, href: '/user/stats' },
              { label: '优惠券', icon: Gift, href: '/user/coupons' },
              { label: '我的收藏', icon: Heart, href: '/user/favorites' },
              { label: '我的评价', icon: MessageSquare, href: '/user/reviews' },
              { label: '推广中心', icon: TrendingUp, href: '/user/promotion' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 p-3 bg-[#1e1e1e] rounded-xl hover:bg-[#2a2a2a] transition-colors"
                >
                  <Icon className="w-5 h-5 text-orange-500" />
                  <span className="text-white text-sm font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#666] ml-auto" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
