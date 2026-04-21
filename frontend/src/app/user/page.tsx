'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserLayout from '@/components/user/UserLayout';
import {
  FileText,
  Wallet,
  Gift,
  Star,
  Heart,
  MapPin,
  Headphones,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function UserHomePage() {
  const [showNotify, setShowNotify] = useState(false);

  // 功能卡片数据
  const featureCards = [
    { id: 'orders', icon: FileText, label: '订单管理', color: 'from-blue-500 to-blue-600', href: '/user/orders' },
    { id: 'wallet', icon: Wallet, label: '我的钱包', color: 'from-green-500 to-green-600', href: '/user/wallet' },
    { id: 'coupons', icon: Gift, label: '优惠券', color: 'from-orange-500 to-orange-600', href: '/user/coupons' },
    { id: 'points', icon: Star, label: '我的积分', color: 'from-yellow-500 to-yellow-600', href: '/user/stats', badge: '580' },
    { id: 'favorites', icon: Heart, label: '我的收藏', color: 'from-pink-500 to-pink-600', href: '/user/favorites' },
    { id: 'address', icon: MapPin, label: '收货地址', color: 'from-purple-500 to-purple-600', href: '/user/address' },
    { id: 'service', icon: Headphones, label: '售后中心', color: 'from-cyan-500 to-cyan-600', href: '/user/service' },
    { id: 'settings', icon: Settings, label: '设置', color: 'from-gray-500 to-gray-600', href: '/user/security' },
  ];

  // 账户概览数据
  const accountStats = [
    { label: '账户余额', value: '¥1,280.00', icon: Wallet, color: 'text-green-500', bg: 'bg-green-500/20' },
    { label: '我的积分', value: '580', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
    { label: '优惠券', value: '3张', icon: Gift, color: 'text-orange-500', bg: 'bg-orange-500/20' },
    { label: '待处理订单', value: '2笔', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/20' },
  ];

  // 快捷入口数据
  const quickLinks = [
    { id: 'payment', icon: CreditCard, label: '支付方式', href: '/user/wallet' },
    { id: 'notifications', icon: Bell, label: '消息通知', href: '/user/notifications' },
    { id: 'help', icon: HelpCircle, label: '帮助中心', href: '/user/service' },
  ];

  // 待处理事项
  const pendingItems = [
    { id: 1, type: 'order', title: '待付款订单', desc: '您有1笔订单待付款', action: '立即付款', href: '/user/orders?tab=unpaid' },
    { id: 2, type: 'review', title: '待评价订单', desc: '您有1笔订单待评价', action: '去评价', href: '/user/orders?tab=completed' },
  ];

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto">
        {/* 顶部欢迎区域 */}
        <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">优</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">欢迎回来，无忧用户</h1>
                <p className="text-[#ccc] text-sm mt-1">ID: 51966932 · 普通会员</p>
              </div>
            </div>
            <Link
              href="/user/profile"
              className="px-4 py-2 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors text-sm font-medium"
            >
              编辑资料
            </Link>
          </div>
        </div>

        {/* 账户概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {accountStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-[#252525] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-[#888] text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* 待处理事项 */}
        {pendingItems.length > 0 && (
          <div className="bg-[#252525] rounded-xl p-4 mb-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              待处理事项
            </h3>
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-[#1e1e1e] rounded-lg p-4">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-[#888] text-sm mt-1">{item.desc}</p>
                  </div>
                  <Link
                    href={item.href}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    {item.action}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 功能卡片网格 */}
        <div className="bg-[#252525] rounded-xl p-4 mb-6">
          <h3 className="text-white font-bold mb-4">快捷服务</h3>
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${card.color} rounded-xl p-3 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                    <div className="w-10 h-10 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-xs font-medium">{card.label}</p>
                    {card.badge && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-white/30 rounded text-white text-xs">
                        {card.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="bg-[#252525] rounded-xl p-4 mb-6">
          <h3 className="text-white font-bold mb-4">快捷入口</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-xl hover:bg-[#2a2a2a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-white font-medium">{link.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#666]" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* 会员权益 */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              会员专属权益
            </h3>
            <Link href="/user/stats" className="text-orange-500 text-sm hover:underline">
              查看详情
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: CheckCircle, text: '专属客服优先接待' },
              { icon: CheckCircle, text: '生日专属优惠券' },
              { icon: CheckCircle, text: '积分翻倍特权' },
              { icon: CheckCircle, text: '新品优先购买权' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-[#ccc] text-sm">
                  <Icon className="w-4 h-4 text-green-500" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
