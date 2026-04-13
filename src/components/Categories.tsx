'use client';

import Link from 'next/link';
import { Gamepad2, Gift, CreditCard, Headphones, Zap, Shield, Clock } from 'lucide-react';

const categories = [
  { 
    id: 'game', 
    name: '游戏点卡', 
    icon: Gamepad2, 
    color: 'from-blue-500 to-blue-600', 
    link: '/shop?category=game',
    description: '热门游戏点卡'
  },
  { 
    id: 'gift', 
    name: '礼品卡', 
    icon: Gift, 
    color: 'from-purple-500 to-purple-600', 
    link: '/shop?category=gift',
    description: '视频音乐会员'
  },
  { 
    id: 'recharge', 
    name: '话费充值', 
    icon: CreditCard, 
    color: 'from-green-500 to-green-600', 
    link: '/shop?category=recharge',
    description: '手机话费充值'
  },
  { 
    id: 'other', 
    name: '增值服务', 
    icon: Headphones, 
    color: 'from-orange-500 to-orange-600', 
    link: '/shop?category=other',
    description: '更多优质服务'
  },
];

const features = [
  { 
    icon: Zap, 
    title: '快速到账', 
    description: '支付后秒级到账',
    color: 'text-yellow-500'
  },
  { 
    icon: Shield, 
    title: '安全可靠', 
    description: '官方渠道保障',
    color: 'text-green-500'
  },
  { 
    icon: Clock, 
    title: '24小时客服', 
    description: '随时为您服务',
    color: 'text-blue-500'
  },
];

export default function Categories() {
  return (
    <section className="py-12">
      <div className="container-custom">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.link}
                className="group card-hover"
              >
                <div className="glass rounded-2xl p-6 text-center transition-all duration-300 group-hover:shadow-xl">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-primary-500 transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass rounded-2xl p-6 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
