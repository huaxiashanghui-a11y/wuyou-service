'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserLayout from '@/components/user/UserLayout';
import {
  Package,
  Search,
  ChevronRight,
  ShoppingBag,
  Loader2
} from 'lucide-react';

type TabType = 'all' | 'unpaid' | 'pending' | 'shipped' | 'completed' | 'refund';

interface Order {
  id: number;
  order_no: string;
  product_name: string;
  product_image: string;
  total_amount: number;
  status: string;
  created_at: string;
  [key: string]: any;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/user?action=orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error('获取订单失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      pending: { label: '待付款', color: 'text-orange-400', bg: 'bg-orange-400/20' },
      unpaid: { label: '待付款', color: 'text-orange-400', bg: 'bg-orange-400/20' },
      processing: { label: '处理中', color: 'text-blue-400', bg: 'bg-blue-400/20' },
      shipped: { label: '待收货', color: 'text-purple-400', bg: 'bg-purple-400/20' },
      completed: { label: '已完成', color: 'text-account-success', bg: 'bg-account-success/20' },
      refunded: { label: '已退款', color: 'text-account-danger', bg: 'bg-account-danger/20' },
      refund: { label: '售后退款', color: 'text-account-danger', bg: 'bg-account-danger/20' },
    };
    return statusMap[status] || { label: status, color: 'text-account-secondary', bg: 'bg-account-bg' };
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'pending':
      case 'unpaid':
        return (
          <button className="px-5 py-2 bg-account-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
            立即付款
          </button>
        );
      case 'shipped':
        return (
          <button className="px-5 py-2 bg-account-success text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium">
            确认收货
          </button>
        );
      case 'completed':
        return (
          <button className="px-5 py-2 bg-account-bg text-account-secondary rounded-lg hover:bg-account-border transition-colors text-sm font-medium">
            申请售后
          </button>
        );
      default:
        return null;
    }
  };

  const getTabCounts = () => {
    const counts: Record<string, number> = {
      all: orders.length,
      unpaid: 0,
      pending: 0,
      shipped: 0,
      completed: 0,
      refund: 0,
    };

    orders.forEach(order => {
      if (order.status === 'pending' || order.status === 'unpaid') counts.unpaid++;
      else if (order.status === 'processing') counts.pending++;
      else if (order.status === 'shipped') counts.shipped++;
      else if (order.status === 'completed') counts.completed++;
      else counts.refund++;
    });

    return counts;
  };

  const counts = getTabCounts();

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'unpaid', label: '待付款' },
    { id: 'pending', label: '待发货' },
    { id: 'shipped', label: '待收货' },
    { id: 'completed', label: '已完成' },
    { id: 'refund', label: '售后退款' },
  ];

  const filteredOrders = orders.filter(order => {
    const statusMap: Record<string, string[]> = {
      unpaid: ['pending', 'unpaid'],
      pending: ['processing'],
      shipped: ['shipped'],
      completed: ['completed'],
      refund: ['refunded', 'refund'],
    };

    const matchesTab = activeTab === 'all' || (statusMap[activeTab]?.includes(order.status));
    const matchesSearch = order.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-account-primary animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">我的订单</h1>

        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-account-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索订单号或商品名称..."
            className="w-full pl-12 pr-4 py-3.5 bg-account-card text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
          />
        </div>

        {/* 标签页 */}
        <div className="bg-account-card rounded-xl mb-6 overflow-hidden border border-account-border">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-account-primary border-b-2 border-account-primary bg-account-primary/10'
                    : 'text-account-secondary hover:text-white hover:bg-account-bg'
                }`}
              >
                {tab.label}
                {counts[tab.id] > 0 && (
                  <span className="px-2 py-0.5 bg-account-primary text-white text-xs rounded-full">
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 订单列表 */}
        {filteredOrders.length === 0 ? (
          <div className="bg-account-card rounded-xl p-12 text-center border border-account-border">
            <div className="w-20 h-20 bg-account-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-account-secondary" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">暂无订单</h3>
            <p className="text-account-secondary text-sm mb-4">您暂时没有相关订单</p>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-account-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium inline-block"
            >
              去逛逛
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-account-card rounded-xl overflow-hidden border border-account-border">
                  {/* 订单头部 */}
                  <div className="flex items-center justify-between px-4 py-3 bg-account-bg">
                    <div className="flex items-center gap-2">
                      <span className="text-account-secondary text-sm">无忧服务</span>
                      <ChevronRight className="w-4 h-4 text-account-secondary" />
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* 订单内容 */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={order.product_image || 'https://picsum.photos/80/80?random=1'}
                        alt={order.product_name}
                        className="w-20 h-20 rounded-xl object-cover bg-account-bg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium mb-1">{order.product_name}</h4>
                        <p className="text-account-secondary text-sm mb-2">订单号: {order.order_no}</p>
                        <p className="text-account-secondary/60 text-xs">{order.created_at}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-account-primary font-bold text-lg">¥{order.total_amount}</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-account-border">
                      {getActionButton(order.status)}
                      <Link
                        href={`/user/orders/${order.id}`}
                        className="px-5 py-2 bg-account-bg text-account-secondary rounded-lg hover:bg-account-border transition-colors text-sm font-medium"
                      >
                        订单详情
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
