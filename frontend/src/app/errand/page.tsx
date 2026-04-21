'use client';

import { useState } from 'react';
import { MapPin, Clock, User, CheckCircle, Circle, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

const ACCENT_COLOR = '#2196f3';

const serviceTypes = [
  { id: 1, name: '帮我送', icon: '📦', description: '文件、物品即时配送', price: '8元起' },
  { id: 2, name: '帮我买', icon: '🛒', description: '代买商品送到家', price: '5元起' },
  { id: 3, name: '帮我排队', icon: '🎫', description: '代排热门店铺', price: '10元起' },
  { id: 4, name: '万能跑腿', icon: '🏃', description: '各类跑腿服务', price: '面议' },
];

const orderStatuses = [
  { step: 1, name: '提交订单', time: '10:30', completed: true },
  { step: 2, name: '骑手接单', time: '10:32', completed: true },
  { step: 3, name: '前往取货', time: '10:35', completed: true },
  { step: 4, name: '配送中', time: '10:40', completed: true },
  { step: 5, name: '已完成', time: '10:55', completed: false },
];

export default function ErrandPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <CategoryLayout accentColor={ACCENT_COLOR} title="同城跑腿">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
          <span className="text-3xl">🏃</span>
          同城跑腿
          <span className="text-sm font-normal text-text-muted ml-2">帮我跑腿</span>
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-dark-border">
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'services' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-text-secondary hover:text-text-primary'}`}
        >
          服务类型
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'order' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-text-secondary hover:text-text-primary'}`}
        >
          下单服务
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === 'track' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-text-secondary hover:text-text-primary'}`}
        >
          订单追踪
        </button>
      </div>

      {/* Services Grid */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {serviceTypes.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`bg-dark-card rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-2 ${
                selectedService === service.id ? 'border-blue-500 shadow-lg' : 'border-dark-border hover:border-blue-500/50'
              }`}
              style={selectedService === service.id ? { backgroundColor: `${ACCENT_COLOR}15` } : {}}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${ACCENT_COLOR}20` }}
              >
                {service.icon}
              </div>
              <h3 className="font-bold text-text-primary mb-2">{service.name}</h3>
              <p className="text-sm text-text-muted mb-3">{service.description}</p>
              <div className="text-blue-500 font-bold">{service.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* Order Form */}
      {activeTab === 'order' && (
        <div className="max-w-2xl">
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <h3 className="font-bold text-text-primary mb-4">填写订单信息</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">取货地址</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                  <input
                    type="text"
                    placeholder="请输入取货地址"
                    className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">送达地址</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  <input
                    type="text"
                    placeholder="请输入送达地址"
                    className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">备注信息</label>
                <textarea
                  placeholder="请输入备注信息（可选）"
                  rows={3}
                  className="w-full bg-dark-primary border border-dark-border rounded-lg py-3 px-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
                  立即下单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking */}
      {activeTab === 'track' && (
        <div className="max-w-2xl">
          <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-text-primary">订单号：20240419001</h3>
                <p className="text-sm text-text-muted">预计送达 10:55</p>
              </div>
              <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm">配送中</span>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="absolute top-4 left-0 right-0 h-1 bg-dark-border"></div>
              <div className="absolute top-4 left-0 w-3/4 h-1 bg-blue-500"></div>
              <div className="relative flex justify-between">
                {orderStatuses.map((status, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        status.completed ? 'bg-blue-500 text-white' : 'bg-dark-border text-text-muted'
                      }`}
                    >
                      {status.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs ${status.completed ? 'text-blue-500' : 'text-text-muted'}`}>
                      {status.name}
                    </span>
                    <span className="text-xs text-text-muted">{status.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rider Info */}
            <div className="bg-dark-primary rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">骑手：张师傅</p>
                  <p className="text-sm text-text-muted">正在为您配送</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CategoryLayout>
  );
}
