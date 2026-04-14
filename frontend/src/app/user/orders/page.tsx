'use client';

import { useState } from 'react';
import { Package, Clock, CreditCard, Shield, Truck, CheckCircle, Search } from 'lucide-react';

type TabType = 'all' | 'unpaid' | 'pending' | 'authenticating' | 'failed' | 'completed';

interface Order {
  id: string;
  productName: string;
  productType: string;
  amount: string;
  status: TabType;
  date: string;
}

const mockOrders: Order[] = [];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: '全部', icon: <Package className="w-4 h-4" /> },
    { id: 'unpaid', label: '未付款', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'pending', label: '待审核', icon: <Clock className="w-4 h-4" /> },
    { id: 'authenticating', label: '认证中', icon: <Shield className="w-4 h-4" /> },
    { id: 'failed', label: '发货失败', icon: <Truck className="w-4 h-4" /> },
    { id: 'completed', label: '发货完成', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const getStatusBadge = (status: TabType) => {
    const badges: Record<TabType, { bg: string; text: string; label: string }> = {
      all: { bg: 'bg-gray-100', text: 'text-gray-600', label: '全部' },
      unpaid: { bg: 'bg-orange-100', text: 'text-orange-600', label: '未付款' },
      pending: { bg: 'bg-blue-100', text: 'text-blue-600', label: '待审核' },
      authenticating: { bg: 'bg-purple-100', text: 'text-purple-600', label: '认证中' },
      failed: { bg: 'bg-red-100', text: 'text-red-600', label: '发货失败' },
      completed: { bg: 'bg-green-100', text: 'text-green-600', label: '已完成' },
    };
    return badges[status];
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的订单</h1>
        <p className="text-sm text-gray-500 mt-1">查看和管理您的所有订单</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索订单号或商品名称..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl mb-6 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">暂无订单</h3>
            <p className="text-sm text-gray-500">您还没有相关的订单记录</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">订单号: {order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{order.productName}</h4>
                      <p className="text-sm text-gray-500">{order.productType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">¥{order.amount}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
