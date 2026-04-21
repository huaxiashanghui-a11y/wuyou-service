'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, MapPin, Clock, Package, Truck, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

const ACCENT_COLOR = '#9c27b0';

const buyTypes = [
  { id: 1, name: '帮我买', icon: '🛒', description: '代买商品送到家' },
  { id: 2, name: '帮送', icon: '📦', description: '物品同城送达' },
  { id: 3, name: '帮我取', icon: '🏃', description: '代取快递物品' },
];

const orderList = [
  { id: '1', title: '代买饮料零食', status: 'purchasing', statusText: '采购中', statusColor: 'bg-yellow-500', price: 35, createTime: '10:30' },
  { id: '2', title: '代取快递', status: 'delivering', statusText: '配送中', statusColor: 'bg-blue-500', price: 15, createTime: '09:15' },
  { id: '3', title: '代买药品', status: 'delivered', statusText: '已送达', statusColor: 'bg-green-500', price: 68, createTime: '昨天 15:20' },
];

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState('order');
  const [selectedType, setSelectedType] = useState<number | null>(1);

  return (
    <CategoryLayout accentColor={ACCENT_COLOR} title="帮买帮送">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
          <span className="text-3xl">📦</span>
          帮买帮送
          <span className="text-sm font-normal text-text-muted ml-2">代买代送</span>
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-dark-border">
        <button
          onClick={() => setActiveTab('order')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'order' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-text-secondary hover:text-text-primary'}`}
        >
          我要下单
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'my' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-text-secondary hover:text-text-primary'}`}
        >
          我的订单
        </button>
      </div>

      {/* Order Form */}
      {activeTab === 'order' && (
        <div className="max-w-2xl">
          {/* Service Type Selection */}
          <div className="mb-6">
            <h3 className="text-sm text-text-muted mb-3">选择服务类型</h3>
            <div className="grid grid-cols-3 gap-3">
              {buyTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`bg-dark-card rounded-xl p-4 text-center cursor-pointer transition-all duration-300 border-2 ${
                    selectedType === type.id ? 'border-purple-500 shadow-lg' : 'border-dark-border hover:border-purple-500/50'
                  }`}
                  style={selectedType === type.id ? { backgroundColor: `${ACCENT_COLOR}15` } : {}}
                >
                  <span className="text-3xl block mb-2">{type.icon}</span>
                  <h4 className="font-medium text-text-primary text-sm">{type.name}</h4>
                  <p className="text-xs text-text-muted mt-1">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">购买物品描述</label>
                <textarea
                  placeholder="请详细描述需要购买的物品，如：品牌、数量、规格等"
                  rows={4}
                  className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 px-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">送达地址</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <input
                    type="text"
                    placeholder="请输入送达地址"
                    className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">期望送达时间</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <select className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                    <option>尽快送达</option>
                    <option>今日 12:00 前</option>
                    <option>今日 18:00 前</option>
                    <option>指定时间</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">备注信息</label>
                <input
                  type="text"
                  placeholder="其他要求（可选）"
                  className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 px-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-dark-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-text-muted">服务费</span>
                  <span className="text-purple-500 font-bold text-lg">¥15.00</span>
                </div>
                <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
                  提交订单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Orders */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          {orderList.map((order) => (
            <div key={order.id} className="bg-dark-card rounded-xl p-4 border border-dark-border hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.statusColor}`}>
                    {order.status === 'purchasing' && <ShoppingBag className="w-4 h-4 text-white" />}
                    {order.status === 'delivering' && <Truck className="w-4 h-4 text-white" />}
                    {order.status === 'delivered' && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{order.title}</h4>
                    <p className="text-xs text-text-muted">下单时间：{order.createTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`${order.statusColor} text-white text-xs px-3 py-1 rounded-full`}>
                    {order.statusText}
                  </span>
                  <p className="text-purple-500 font-bold mt-2">¥{order.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-purple-500 text-purple-500 rounded-lg text-sm font-medium hover:bg-purple-500 hover:text-white transition-colors">
                  查看详情
                </button>
                <button className="flex-1 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                  联系客服
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CategoryLayout>
  );
}
