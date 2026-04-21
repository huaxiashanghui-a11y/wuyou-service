'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { Gift, Ticket, Clock, ChevronRight, GiftIcon } from 'lucide-react';

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');

  const coupons = [
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

  const filteredCoupons = coupons.filter((coupon) => {
    if (activeTab === 'available') {
      return !coupon.isUsed;
    }
    return coupon.isUsed;
  });

  const getDaysRemaining = (dateStr: string) => {
    const validDate = new Date(dateStr);
    const today = new Date();
    const diffTime = validDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">我的优惠券</h1>

        {/* 标签页 */}
        <div className="bg-account-card rounded-xl mb-6 border border-account-border overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === 'available'
                  ? 'text-account-primary border-b-2 border-account-primary'
                  : 'text-account-secondary hover:text-white'
              }`}
            >
              可使用 ({coupons.filter((c) => !c.isUsed).length})
            </button>
            <button
              onClick={() => setActiveTab('used')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === 'used'
                  ? 'text-account-primary border-b-2 border-account-primary'
                  : 'text-account-secondary hover:text-white'
              }`}
            >
              已使用 ({coupons.filter((c) => c.isUsed).length})
            </button>
          </div>
        </div>

        {/* 优惠券列表 */}
        <div className="space-y-4">
          {filteredCoupons.length === 0 ? (
            <div className="bg-account-card rounded-xl p-12 text-center border border-account-border">
              <div className="w-20 h-20 bg-account-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-10 h-10 text-account-secondary" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {activeTab === 'available' ? '暂无可用优惠券' : '暂无已使用优惠券'}
              </h3>
              <p className="text-account-secondary text-sm">
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
                  className={`relative bg-account-card rounded-xl overflow-hidden border ${
                    coupon.isUsed ? 'border-account-border opacity-60' : 'border-account-border'
                  }`}
                >
                  <div className="flex">
                    {/* 左侧金额 */}
                    <div className={`w-32 p-4 flex flex-col items-center justify-center ${
                      coupon.isUsed ? 'bg-gray-600' : 'bg-gradient-to-br from-account-primary to-blue-600'
                    } text-white`}>
                      <span className="text-3xl font-bold">¥{coupon.amount}</span>
                      <span className="text-xs mt-1 opacity-80">优惠券</span>
                    </div>

                    {/* 右侧详情 */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{coupon.name}</h3>
                          <p className="text-account-secondary text-sm mt-1">
                            满 {coupon.minSpend} 元可用
                          </p>
                          {!coupon.isUsed && (
                            <div className={`flex items-center gap-1 mt-2 ${
                              isExpiringSoon ? 'text-orange-400' : 'text-account-secondary'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">
                                {daysRemaining > 0 ? `剩余 ${daysRemaining} 天` : '已过期'}
                              </span>
                            </div>
                          )}
                          {coupon.isUsed && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-account-success/20 text-account-success text-xs rounded">
                              已使用
                            </span>
                          )}
                        </div>
                        {!coupon.isUsed && daysRemaining > 0 && (
                          <button className="px-4 py-1.5 bg-account-primary/20 text-account-primary text-sm rounded-full hover:bg-account-primary/30 transition-colors">
                            立即使用
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 装饰性圆点 */}
                  {!coupon.isUsed && (
                    <>
                      <div className="absolute left-32 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-account-bg rounded-full border-2 border-account-border" />
                      <div className="absolute left-32 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-account-bg rounded-full border-2 border-account-border" />
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </UserLayout>
  );
}
