'use client';

import Link from 'next/link';
import { Gamepad2, Gift, Phone, Settings } from 'lucide-react';

const categories = [
  {
    id: 'game',
    name: '游戏点卡',
    icon: Gamepad2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    id: 'gift',
    name: '礼品卡',
    icon: Gift,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
  },
  {
    id: 'recharge',
    name: '话费充值',
    icon: Phone,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    id: 'other',
    name: '增值服务',
    icon: Settings,
    color: 'from-orange-500 to-orange-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
];

export default function Categories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.id}
            href={`/shop?category=${category.id}`}
            className={`${category.bgColor} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 card-hover group`}
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className={`font-semibold ${category.iconColor}`}>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
