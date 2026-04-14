'use client';

import { useState } from 'react';
import { Gift, Ticket, Clock, ChevronRight, GiftIcon } from 'lucide-react';

interface Coupon {
  id: string;
  name: string;
  amount: string;
  minSpend: string;
  validUntil: string;
  isUsed: boolean;
}

const mockCoupons: Coupon[] = [
  {
    id: 'C001',
    name: '新人专享优惠券',
    amount: '20',
    minSpend: '100',
    validUntil: '2026-04-30',
    isUsed: false,
  },
  {
    id: 'C002',
    name: '限时满减券',
    amount: '50',
    minSpend: '300',
    validUntil: '2026-04-20',
    isUsed: false,
  },
  {
    id: 'C003',
    name: 'VIP专属优惠',
    amount: '100',
    minSpend: '500',
    validUntil: '2026-05-15',
    isUsed: true,
  },
];

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');
  const [exchangeCode, setExchangeCode] = useState('');
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  const filteredCoupons = mockCoupons.filter((coupon) => {
    if (activeTab === 'available') {
      return !coupon.isUsed;
    }
    return coupon.isUsed;
  });

  const handleExchange = () => {
    if (exchangeCode.trim()) {
      alert(`兑换码 ${exchangeCode} 兑换成功！`);
      setExchangeCode('');
      setShowExchangeModal(false);
    }
  };

  const getDaysRemaining = (dateStr: string) => {
    const validDate = new Date(dateStr);
    const today = new Date();
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的优惠券</h1>
        <p className="text-sm text-gray-500 mt-1">查看和管理您的所有优惠券</p>
      </div>

      {/* Exchange Button */}
      <button
        onClick={() => setShowExchangeModal(true)}
        className="w-full mb-6 p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-between text-white hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-200"
      >
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6" />
          <div className="text-left">
            <p className="font-semibold">兑换优惠券</p>
            <p className="text-sm text-orange-100">输入兑换码领取优惠券</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'available'
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            可使用 ({mockCoupons.filter((c) => !c.isUsed).length})
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'used'
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            已使用 ({mockCoupons.filter((c) => c.isUsed).length})
          </button>
        </div>
      </div>

      {/* Coupon List */}
      <div className="space-y-4">
        {filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Ticket className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {activeTab === 'available' ? '暂无可用优惠券' : '暂无已使用优惠券'}
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'available' ? '快去领取更多优惠券吧' : '您还没有使用过优惠券'}
            </p>
          </div>
        ) : (
          filteredCoupons.map((coupon) => {
            const daysRemaining = getDaysRemaining(coupon.validUntil);
            const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0;

            return (
              <div
                key={coupon.id}
                className={`relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                  coupon.isUsed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex">
                  {/* Left - Value */}
                  <div className={`w-28 p-4 flex flex-col items-center justify-center ${
                    coupon.isUsed ? 'bg-gray-300' : 'bg-gradient-to-br from-orange-500 to-orange-600'
                  } text-white`}>
                    <span className="text-3xl font-bold">¥{coupon.amount}</span>
                    <span className="text-xs mt-1">优惠券</span>
                  </div>

                  {/* Right - Details */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          满 {coupon.minSpend} 元可用
                        </p>
                        {!coupon.isUsed && (
                          <div className={`flex items-center gap-1 mt-2 ${isExpiringSoon ? 'text-red-500' : 'text-gray-400'}`}>
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {daysRemaining > 0 ? `剩余 ${daysRemaining} 天` : '已过期'}
                            </span>
                          </div>
                        )}
                        {coupon.isUsed && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">
                            已使用
                          </span>
                        )}
                      </div>
                      {!coupon.isUsed && daysRemaining > 0 && (
                        <button className="px-4 py-1.5 bg-orange-100 text-orange-600 text-sm rounded-full hover:bg-orange-200 transition-colors">
                          立即使用
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative circles */}
                {!coupon.isUsed && (
                  <>
                    <div className="absolute left-24 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-gray-50 rounded-full border-2 border-gray-200" />
                    <div className="absolute left-24 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-gray-50 rounded-full border-2 border-gray-200" />
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Exchange Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">兑换优惠券</h3>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兑换码
              </label>
              <input
                type="text"
                value={exchangeCode}
                onChange={(e) => setExchangeCode(e.target.value.toUpperCase())}
                placeholder="请输入兑换码"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg tracking-widest uppercase"
              />
            </div>

            <button
              onClick={handleExchange}
              disabled={!exchangeCode.trim()}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                exchangeCode.trim()
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              立即兑换
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              输入您获得的兑换码，验证后即可领取优惠券
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
