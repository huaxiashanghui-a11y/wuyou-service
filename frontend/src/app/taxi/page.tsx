'use client';

import { useState } from 'react';
import { MapPin, Clock, User, Car, Navigation, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

const ACCENT_COLOR = '#4caf50';

const carTypes = [
  { id: 1, name: '快车', icon: '🚗', description: '经济实惠', price: '8元起', time: '2分钟接单' },
  { id: 2, name: '专车', icon: '🚙', description: '舒适宽敞', price: '25元起', time: '3分钟接单' },
  { id: 3, name: '豪华车', icon: '🚘', description: '高端出行', price: '50元起', time: '5分钟接单' },
  { id: 4, name: '出租车', icon: '🚕', description: '传统计价', price: '起步价10元', time: '随时可约' },
];

const nearbyDrivers = [
  { id: 1, name: '李师傅', rating: 4.9, distance: '0.8km', car: '比亚迪汉', plate: '粤B12345', completed: 3280 },
  { id: 2, name: '王师傅', rating: 4.8, distance: '1.2km', car: '特斯拉Model3', plate: '粤B67890', completed: 2156 },
  { id: 3, name: '张师傅', rating: 4.7, distance: '1.5km', car: '小鹏P7', plate: '粤B11111', completed: 1890 },
];

export default function TaxiPage() {
  const [selectedCar, setSelectedCar] = useState<number | null>(1);
  const [fromAddress, setFromAddress] = useState('当前位置');
  const [toAddress, setToAddress] = useState('');

  return (
    <CategoryLayout accentColor={ACCENT_COLOR} title="同城滴滴车">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
          <span className="text-3xl">🚗</span>
          同城滴滴车
          <span className="text-sm font-normal text-text-muted ml-2">打车出行</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Map Placeholder & Address Input */}
        <div>
          {/* Map Placeholder */}
          <div className="bg-dark-card rounded-xl overflow-hidden mb-4 border border-dark-border">
            <div className="relative h-64 bg-gradient-to-br from-dark-card to-dark-primary flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-16 h-16 text-green-500 mx-auto mb-2" />
                <p className="text-text-muted">地图区域</p>
                <p className="text-sm text-text-muted">起点/终点选点</p>
              </div>
              {/* Map markers */}
              <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg">
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-500 whitespace-nowrap">起点</div>
              </div>
              <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg">
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">终点</div>
              </div>
            </div>
          </div>

          {/* Address Input */}
          <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-0.5 h-8 bg-dark-border"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="w-full bg-dark-primary border border-dark-border rounded-lg py-2.5 px-3 text-text-primary text-sm focus:outline-none focus:border-green-500 transition-colors"
                />
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="请输入目的地"
                  className="w-full bg-dark-primary border border-dark-border rounded-lg py-2.5 px-3 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Nearby Drivers */}
          <div className="bg-dark-card rounded-xl p-4 border border-dark-border mt-4">
            <h3 className="font-bold text-text-primary mb-3">附近司机</h3>
            <div className="space-y-3">
              {nearbyDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 bg-dark-primary rounded-lg hover:bg-dark-card transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">{driver.name}</p>
                      <p className="text-xs text-text-muted">{driver.car} · {driver.plate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 text-sm font-medium">{driver.distance}</p>
                    <p className="text-xs text-text-muted">⭐ {driver.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Car Type Selection */}
        <div>
          <h3 className="font-bold text-text-primary mb-4">选择车型</h3>
          <div className="space-y-3">
            {carTypes.map((car) => (
              <div
                key={car.id}
                onClick={() => setSelectedCar(car.id)}
                className={`bg-dark-card rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                  selectedCar === car.id ? 'border-green-500 shadow-lg' : 'border-dark-border hover:border-green-500/50'
                }`}
                style={selectedCar === car.id ? { backgroundColor: `${ACCENT_COLOR}10` } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{car.icon}</span>
                    <div>
                      <h4 className="font-bold text-text-primary">{car.name}</h4>
                      <p className="text-sm text-text-muted">{car.description}</p>
                      <p className="text-xs text-green-500 mt-1">{car.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 font-bold text-lg">{car.price}</p>
                    {selectedCar === car.id && (
                      <div className="mt-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">已选</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estimated Price */}
          <div className="bg-dark-card rounded-xl p-4 border border-dark-border mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-text-muted">预计里程</span>
              <span className="text-text-primary">8.5km</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-muted">预计时间</span>
              <span className="text-text-primary">约25分钟</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dark-border">
              <span className="text-text-muted">预计费用</span>
              <span className="text-green-500 font-bold text-xl">¥28.00</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button className="w-full mt-4 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-lg">
            确认呼叫
          </button>
        </div>
      </div>
    </CategoryLayout>
  );
}
