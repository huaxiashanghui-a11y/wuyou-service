'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserLayout from '@/components/user/UserLayout';
import {
  Wallet,
  Star,
  Crown,
  FileText,
  TrendingUp,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  ShoppingBag,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface UserStats {
  nickname: string;
  id: number;
  balance: number;
  points: number;
  member_level: string;
  pending_orders: number;
}

interface SpendingStats {
  monthly_spending: number;
  monthly_orders: number;
  total_points: number;
  total_discount: number;
}

export default function UserHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    nickname: '用户',
    id: 0,
    balance: 0,
    points: 0,
    member_level: 'VIP 1',
    pending_orders: 0,
  });
  const [spendingStats, setSpendingStats] = useState<SpendingStats>({
    monthly_spending: 0,
    monthly_orders: 0,
    total_points: 0,
    total_discount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // 获取用户信息
        const profileRes = await fetch('/api/user?action=profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();

        if (profileData.success) {
          setUserStats(prev => ({
            ...prev,
            nickname: profileData.data.nickname || profileData.data.username,
            id: profileData.data.id,
            balance: profileData.data.balance || 0,
            points: profileData.data.points || 0,
            member_level: profileData.data.member_level || 'VIP 1',
          }));
        }

        // 获取订单统计
        const ordersRes = await fetch('/api/user?action=orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();

        if (ordersData.success) {
          const pendingCount = ordersData.data.filter(
            (order: any) => order.status === 'pending' || order.status === 'processing'
          ).length;
          setUserStats(prev => ({ ...prev, pending_orders: pendingCount }));
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-account-primary animate-spin" />
        </div>
      </UserLayout>
    );
  }

  const accountStats = [
    { label: '账户余额', value: `¥${userStats.balance.toFixed(2)}`, icon: Wallet, color: 'from-account-primary to-blue-600', bg: 'bg-account-primary/20', text: 'text-account-primary', href: '/user/wallet' },
    { label: '我的积分', value: String(userStats.points), icon: Star, color: 'from-account-gold to-yellow-500', bg: 'bg-account-gold/20', text: 'text-account-gold', href: '/user/stats' },
    { label: '会员等级', value: userStats.member_level, icon: Crown, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20', text: 'text-purple-400', href: '/user/profile' },
    { label: '待处理订单', value: String(userStats.pending_orders), icon: FileText, color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/20', text: 'text-orange-400', href: '/user/orders' },
  ];

  const featureCards = [
    { id: 'wallet', icon: Wallet, label: '我的钱包', desc: '充值/提现', color: 'from-account-primary to-blue-600', href: '/user/wallet' },
    { id: 'orders', icon: FileText, label: '我的订单', desc: '查看全部', color: 'from-green-500 to-emerald-600', href: '/user/orders' },
    { id: 'coupons', icon: Gift, label: '优惠券', desc: '优惠券', color: 'from-orange-500 to-red-500', href: '/user/coupons' },
    { id: 'promotion', icon: TrendingUp, label: '我的推广', desc: '赚取佣金', color: 'from-purple-500 to-pink-500', href: '/user/promotion' },
    { id: 'security', icon: CreditCard, label: '账户安全', desc: '安全中心', color: 'from-cyan-500 to-blue-500', href: '/user/security' },
    { id: 'settings', icon: RefreshCw, label: '设置', desc: '偏好设置', color: 'from-gray-500 to-gray-600', href: '/user/settings' },
  ];

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto">
        {/* 顶部欢迎区域 */}
        <div className="bg-gradient-to-r from-account-primary/20 to-purple-500/10 rounded-2xl p-6 mb-6 border border-account-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-account-primary to-blue-700 flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-2xl">{userStats.nickname.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">欢迎回来，{userStats.nickname}</h1>
                <p className="text-account-secondary text-sm mt-1">ID: {userStats.id} · {userStats.member_level}</p>
              </div>
            </div>
            <Link
              href="/user/profile"
              className="px-5 py-2.5 bg-account-primary text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
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
              <Link
                key={index}
                href={stat.href || '#'}
                className="bg-account-card rounded-xl p-5 border border-account-border hover:border-account-primary/50 transition-all group"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-account-secondary text-sm">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        {/* 功能卡片网格 */}
        <div className="bg-account-card rounded-xl p-5 mb-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">快捷服务</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow`}>
                    <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-semibold text-sm mb-1">{card.label}</p>
                    <p className="text-white/70 text-xs">{card.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="bg-account-card rounded-xl p-5 border border-account-border">
          <h3 className="text-white font-bold mb-4">常用功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: CreditCard, label: '支付方式管理', desc: '添加/管理支付渠道', href: '/user/wallet' },
              { icon: ShoppingBag, label: '继续购物', desc: '浏览更多商品', href: '/shop' },
              { icon: Star, label: '积分商城', desc: '积分兑换好礼', href: '/shop' },
              { icon: RefreshCw, label: '常见问题', desc: '获取帮助', href: '/help' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-4 p-4 bg-account-bg rounded-xl hover:bg-account-border/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-account-primary/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-account-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-account-secondary text-sm">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-account-secondary" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
