'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  Globe,
  Bell,
  Moon,
  Shield,
  Info,
  ChevronRight,
  Check,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: {
      order: true,
      promotion: true,
      system: false,
    },
    language: 'zh',
  });

  const toggleSwitch = (key: string) => {
    if (key === 'order' || key === 'promotion' || key === 'system') {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key as keyof typeof prev.notifications],
        },
      }));
    }
  };

  const settingGroups = [
    {
      title: '显示设置',
      items: [
        { id: 'darkMode', icon: Moon, label: '深色模式', type: 'switch', value: settings.darkMode },
        { id: 'language', icon: Globe, label: '语言', type: 'value', value: settings.language === 'zh' ? '中文' : 'English' },
      ],
    },
    {
      title: '通知设置',
      items: [
        { id: 'order', icon: Bell, label: '订单通知', type: 'switch', value: settings.notifications.order },
        { id: 'promotion', icon: Bell, label: '促销通知', type: 'switch', value: settings.notifications.promotion },
        { id: 'system', icon: Bell, label: '系统通知', type: 'switch', value: settings.notifications.system },
      ],
    },
    {
      title: '关于',
      items: [
        { id: 'privacy', icon: Shield, label: '隐私协议', type: 'link' },
        { id: 'terms', icon: Info, label: '用户协议', type: 'link' },
        { id: 'about', icon: RefreshCw, label: '关于我们', type: 'link' },
      ],
    },
  ];

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">设置</h1>

        {settingGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-account-card rounded-xl overflow-hidden mb-4 border border-account-border">
            <div className="px-5 py-3 bg-account-bg">
              <h3 className="text-white font-medium text-sm">{group.title}</h3>
            </div>
            <div>
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isLast = itemIndex === group.items.length - 1;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-5 py-4 hover:bg-account-bg transition-colors ${
                      !isLast ? 'border-b border-account-border' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-account-secondary" />
                      <span className="text-white">{item.label}</span>
                    </div>
                    {item.type === 'switch' ? (
                      <button
                        onClick={() => toggleSwitch(item.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          (item as any).value ? 'bg-account-primary' : 'bg-account-border'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            (item as any).value ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'value' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-account-secondary text-sm">{(item as any).value}</span>
                        <ChevronRight className="w-5 h-5 text-account-secondary" />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-account-secondary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 版本信息 */}
        <div className="text-center text-account-secondary text-sm mt-8">
          <p>无忧服务 v2.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} 无忧服务 版权所有</p>
        </div>
      </div>
    </UserLayout>
  );
}
