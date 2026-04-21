'use client';

import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

type TabType = 'all' | 'unpaid' | 'pending' | 'shipped' | 'completed' | 'refund';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: 'all', label: '全部', count: 0 },
    { id: 'unpaid', label: '待付款', count: 1 },
    { id: 'pending', label: '待发货', count: 0 },
    { id: 'shipped', label: '待收货', count: 1 },
    { id: 'completed', label: '已完成', count: 0 },
    { id: 'refund', label: '售后退款', count: 0 },
  ];

  // 示例订单数据
  const orders = [
    {
      id: 'ORD20260421001',
      shop: '抖音旗舰店',
      product: '抖音充值 100币',
      price: 98,
      status: 'unpaid',
      time: '2026-04-21 10:30',
      image: 'https://picsum.photos/80/80?random=1'
    },
    {
      id: 'ORD20260420002',
      shop: '王者荣耀官方',
      product: '648点券直充',
      price: 618,
      status: 'shipped',
      time: '2026-04-20 15:20',
      image: 'https://picsum.photos/80/80?random=2'
    },
  ];

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      unpaid: { label: '待付款', color: 'text-orange-500', bg: 'bg-orange-500/20' },
      pending: { label: '待发货', color: 'text-blue-500', bg: 'bg-blue-500/20' },
      shipped: { label: '待收货', color: 'text-purple-500', bg: 'bg-purple-500/20' },
      completed: { label: '已完成', color: 'text-green-500', bg: 'bg-green-500/20' },
      refund: { label: '售后退款', color: 'text-red-500', bg: 'bg-red-500/20' },
    };
    return statusMap[status] || statusMap.completed;
  };

  const getActionButton = (status: string) => {
    switch (status) {
      case 'unpaid':
        return (
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
            立即付款
          </button>
        );
      case 'shipped':
        return (
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
            确认收货
          </button>
        );
      case 'completed':
        return (
          <button className="px-4 py-2 bg-[#444] text-white rounded-lg hover:bg-[#555] transition-colors text-sm font-medium">
            申请售后
          </button>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">我的订单</h1>

        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索订单号或商品名称..."
            className="w-full pl-12 pr-4 py-3 bg-[#252525] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* 标签页 */}
        <div className="bg-[#252525] rounded-xl mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-orange-500 border-b-2 border-orange-500 bg-[#1e1e1e]'
                    : 'text-[#ccc] hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 订单列表 */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[#252525] rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-[#666]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">暂无订单</h3>
            <p className="text-[#888] text-sm mb-4">您暂时没有相关订单</p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-[#252525] rounded-xl overflow-hidden">
                  {/* 订单头部 */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#ccc] text-sm">{order.shop}</span>
                      <ChevronRight className="w-4 h-4 text-[#666]" />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* 订单内容 */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={order.image}
                        alt={order.product}
                        className="w-20 h-20 rounded-lg object-cover bg-[#333]"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium mb-1">{order.product}</h4>
                        <p className="text-[#888] text-sm mb-2">订单号: {order.id}</p>
                        <p className="text-[#666] text-xs">{order.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-bold text-lg">¥{order.price}</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#333]">
                      {getActionButton(order.status)}
                      <button className="px-4 py-2 bg-[#333] text-[#ccc] rounded-lg hover:bg-[#444] transition-colors text-sm font-medium">
                        订单详情
                      </button>
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
