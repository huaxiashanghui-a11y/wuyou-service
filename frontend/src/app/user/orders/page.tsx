'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserLayout from '@/components/user/UserLayout';
import {
  Package,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  RefreshCw,
  Search,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

type TabType = 'all' | 'unpaid' | 'pending' | 'shipped' | 'completed' | 'refund';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'all', label: '全部', count: 3 },
    { id: 'unpaid', label: '待付款', count: 1 },
    { id: 'pending', label: '待发货', count: 0 },
    { id: 'shipped', label: '待收货', count: 1 },
    { id: 'completed', label: '已完成', count: 1 },
    { id: 'refund', label: '售后退款', count: 0 },
  ];

  // 示例订单数据
  const orders = [
    {
      id: '1',
      orderNo: 'ORD20260421001',
      shop: '抖音旗舰店',
      product: '抖音充值 100币',
      price: 98,
      status: 'unpaid',
      time: '2026-04-21 10:30',
      image: 'https://picsum.photos/80/80?random=1'
    },
    {
      id: '2',
      orderNo: 'ORD20260420002',
      shop: '王者荣耀官方',
      product: '648点券直充',
      price: 618,
      status: 'shipped',
      time: '2026-04-20 15:20',
      image: 'https://picsum.photos/80/80?random=2'
    },
    {
      id: '3',
      orderNo: 'ORD20260419003',
      shop: 'B站会员购',
      product: 'B站大会员年卡',
      price: 168,
      status: 'completed',
      time: '2026-04-19 09:15',
      image: 'https://picsum.photos/80/80?random=3'
    },
  ];

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      unpaid: { label: '待付款', color: 'text-orange-400', bg: 'bg-orange-400/20' },
      pending: { label: '待发货', color: 'text-blue-400', bg: 'bg-blue-400/20' },
      shipped: { label: '待收货', color: 'text-purple-400', bg: 'bg-purple-400/20' },
      completed: { label: '已完成', color: 'text-account-success', bg: 'bg-account-success/20' },
      refund: { label: '售后退款', color: 'text-account-danger', bg: 'bg-account-danger/20' },
    };
    return statusMap[status] || statusMap.completed;
  };

  const getActionButton = (status: string) => {
    switch (status) {
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

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-account-primary text-white text-xs rounded-full">
                    {tab.count}
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
            <button
              onClick={() => window.location.href = '/shop'}
              className="px-6 py-2.5 bg-account-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              去逛逛
            </button>
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
                      <span className="text-account-secondary text-sm">{order.shop}</span>
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
                        src={order.image}
                        alt={order.product}
                        className="w-20 h-20 rounded-xl object-cover bg-account-bg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium mb-1">{order.product}</h4>
                        <p className="text-account-secondary text-sm mb-2">订单号: {order.orderNo}</p>
                        <p className="text-account-secondary/60 text-xs">{order.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-account-primary font-bold text-lg">¥{order.price}</p>
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
