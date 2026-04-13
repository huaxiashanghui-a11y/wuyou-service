'use client'

import Link from 'next/link'
import { Gamepad2, Gift, CreditCard, Headphones, Zap, Shield } from 'lucide-react'

const categories = [
  { id: 'game', name: '游戏点卡', icon: Gamepad2, color: 'from-primary-500 to-primary-600', link: '/shop?category=game' },
  { id: 'gift', name: '礼品卡', icon: Gift, color: 'from-secondary-500 to-secondary-600', link: '/shop?category=gift' },
  { id: 'recharge', name: '话费充值', icon: CreditCard, color: 'from-accent-500 to-accent-600', link: '/shop?category=recharge' },
  { id: 'support', name: '增值服务', icon: Headphones, color: 'from-green-500 to-green-600', link: '/shop?category=support' },
]

const features = [
  { icon: Zap, title: '快速到账', description: '支付后秒级到账' },
  { icon: Shield, title: '安全可靠', description: '官方渠道保障' },
  { icon: Headphones, title: '24小时客服', description: '随时为您服务' },
]

export default function Categories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group card-hover"
            >
              <div className="glass rounded-2xl p-6 text-center transition-all duration-300 group-hover:shadow-xl">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-primary-500 transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="glass rounded-2xl p-6 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
