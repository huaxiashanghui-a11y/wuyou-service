'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  TrendingUp,
  Users,
  Copy,
  Check,
  Link,
  ArrowUpRight,
  Gift,
  ChevronRight
} from 'lucide-react';

export default function PromotionPage() {
  const [copied, setCopied] = useState(false);
  const inviteCode = 'WY20260421';
  const inviteLink = `https://wysz88.com/register?code=${inviteCode}`;

  // 推广数据
  const stats = [
    { label: '推广人数', value: '12', icon: Users, color: 'text-account-primary' },
    { label: '累计佣金', value: '¥580.00', icon: TrendingUp, color: 'text-account-success' },
    { label: '已提现', value: '¥200.00', icon: Gift, color: 'text-account-gold' },
    { label: '待结算', value: '¥380.00', icon: ArrowUpRight, color: 'text-orange-400' },
  ];

  // 推广记录
  const records = [
    { id: 1, user: '用户***123', time: '2026-04-21 10:30', commission: '¥50.00', status: '已结算' },
    { id: 2, user: '用户***456', time: '2026-04-20 15:20', commission: '¥30.00', status: '已结算' },
    { id: 3, user: '用户***789', time: '2026-04-19 09:15', commission: '¥80.00', status: '待结算' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">我的推广</h1>

        {/* 推广概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-account-card rounded-xl p-5 border border-account-border">
                <div className={`w-10 h-10 bg-account-bg rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-account-secondary text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* 推广链接 */}
        <div className="bg-account-card rounded-xl p-6 mb-6 border border-account-border">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-account-primary" />
            专属推广链接
          </h3>

          {/* 邀请码 */}
          <div className="bg-account-bg rounded-xl p-4 mb-4">
            <p className="text-account-secondary text-sm mb-2">邀请码</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-account-primary tracking-wider">{inviteCode}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 bg-account-primary/20 text-account-primary rounded-lg hover:bg-account-primary/30 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
          </div>

          {/* 推广链接 */}
          <div className="bg-account-bg rounded-xl p-4">
            <p className="text-account-secondary text-sm mb-2">推广链接</p>
            <div className="flex items-center gap-3">
              <p className="flex-1 text-account-secondary text-sm truncate">{inviteLink}</p>
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-account-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制链接'}
              </button>
            </div>
          </div>

          <p className="text-account-secondary text-sm mt-4">
            分享您的邀请码或链接，好友注册后您将获得佣金奖励
          </p>
        </div>

        {/* 推广规则 */}
        <div className="bg-account-card rounded-xl p-6 mb-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">推广规则</h3>
          <div className="space-y-3">
            {[
              '每成功邀请1位新用户注册，可获得 ¥10 佣金奖励',
              '被邀请用户首笔订单完成后，可获得订单金额 5% 的佣金',
              '佣金累计满 ¥100 可申请提现',
              '推广链接和邀请码永久有效',
            ].map((rule, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-account-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-account-primary text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-account-secondary text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 推广记录 */}
        <div className="bg-account-card rounded-xl p-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">推广记录</h3>

          {records.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-account-secondary mx-auto mb-3" />
              <p className="text-account-secondary">暂无推广记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-account-bg rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-account-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-account-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{record.user}</p>
                      <p className="text-account-secondary text-sm">{record.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-account-success font-bold">{record.commission}</p>
                    <p className={`text-sm ${
                      record.status === '已结算' ? 'text-account-success' : 'text-orange-400'
                    }`}>
                      {record.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
