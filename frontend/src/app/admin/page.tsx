'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Store,
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';

interface Stats {
  total_users: number;
  total_merchants: number;
  pending_applies: number;
  total_orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_merchants: 0,
    pending_applies: 0,
    total_orders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // 获取用户信息
        const profileRes = await fetch('/api/user?action=profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 获取商家申请列表
        const merchantsRes = await fetch('/api/admin/merchants?status=pending', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const merchantsData = await merchantsRes.json();

        setStats({
          total_users: 0,
          total_merchants: merchantsData.data?.total || 0,
          pending_applies: merchantsData.data?.list?.length || 0,
          total_orders: 0,
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: '平台用户',
      value: stats.total_users || '-',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
    },
    {
      label: '认证商家',
      value: stats.total_merchants || '-',
      icon: Store,
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
    },
    {
      label: '待审申请',
      value: stats.pending_applies || '-',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
    },
    {
      label: '总订单数',
      value: stats.total_orders || '-',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/20',
      text: 'text-green-400',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">后台概览</h1>
          <p className="text-account-secondary mt-1">欢迎回来，查看平台运营数据</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-account-card rounded-xl p-5 border border-account-border"
              >
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${card.text}`} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                <p className="text-account-secondary text-sm">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* 快捷操作 */}
        <div className="bg-account-card rounded-xl p-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">快捷操作</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/admin/merchants"
              className="flex items-center gap-4 p-4 bg-account-bg rounded-xl hover:bg-account-border/50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">商家审核</p>
                <p className="text-account-secondary text-sm">审核商家入驻申请</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-4 p-4 bg-account-bg rounded-xl hover:bg-account-border/50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">用户管理</p>
                <p className="text-account-secondary text-sm">管理平台用户</p>
              </div>
            </a>
            <a
              href="/admin/orders"
              className="flex items-center gap-4 p-4 bg-account-bg rounded-xl hover:bg-account-border/50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">订单管理</p>
                <p className="text-account-secondary text-sm">查看处理订单</p>
              </div>
            </a>
          </div>
        </div>

        {/* 系统信息 */}
        <div className="mt-6 bg-account-card rounded-xl p-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">系统信息</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-account-bg rounded-xl p-4">
              <p className="text-account-secondary text-sm mb-1">系统版本</p>
              <p className="text-white font-medium">wysz88.com v1.0.0</p>
            </div>
            <div className="bg-account-bg rounded-xl p-4">
              <p className="text-account-secondary text-sm mb-1">数据库状态</p>
              <p className="text-account-success font-medium">已连接</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}