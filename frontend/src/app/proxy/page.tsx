'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Globe, ShoppingBag, CreditCard, Package, Truck, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

const ACCENT_COLOR = '#e91e63';

const regions = [
  { id: 1, name: '日本', icon: '🇯🇵', description: '日淘精品' },
  { id: 2, name: '美国', icon: '🇺🇸', description: '美淘好货' },
  { id: 3, name: '韩国', icon: '🇰🇷', description: '韩流时尚' },
  { id: 4, name: '欧洲', icon: '🇪🇺', description: '欧洲奢品' },
  { id: 5, name: '澳洲', icon: '🇦🇺', description: '澳淘健康' },
  { id: 6, name: '香港', icon: '🇭🇰', description: '港淘便捷' },
];

const products = [
  { id: 1, title: 'SK-II 神仙水 230ml', region: '日本', price: 899, tax: 135, finalPrice: 1034, image: 'https://picsum.photos/300/200?random=71', platform: '日亚' },
  { id: 2, title: '雅诗兰黛小棕瓶 100ml', region: '美国', price: 699, tax: 105, finalPrice: 804, image: 'https://picsum.photos/300/200?random=72', platform: '丝芙兰' },
  { id: 3, title: 'LA MER精华面霜 60ml', region: '美国', price: 1899, tax: 285, finalPrice: 2184, image: 'https://picsum.photos/300/200?random=73', platform: 'Nordstrom' },
  { id: 4, title: '雪花秀滋阴套装', region: '韩国', price: 459, tax: 69, finalPrice: 528, image: 'https://picsum.photos/300/200?random=74', platform: '乐天' },
  { id: 5, title: 'CPB肌肤之钥隔离', region: '日本', price: 399, tax: 60, finalPrice: 459, image: 'https://picsum.photos/300/200?random=75', platform: '日亚' },
  { id: 6, title: 'Coach Tabby 斜挎包', region: '美国', price: 1299, tax: 195, finalPrice: 1494, image: 'https://picsum.photos/300/200?random=76', platform: 'Coach官网' },
];

const paymentMethods = [
  { id: 1, name: '支付定金', amount: '30%', color: 'bg-pink-500' },
  { id: 2, name: '支付全款', amount: '100%', color: 'bg-pink-600' },
];

export default function ProxyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number>(1);

  return (
    <CategoryLayout accentColor={ACCENT_COLOR} title="平台代购">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
          <span className="text-3xl">🛒</span>
          平台代购
          <span className="text-sm font-normal text-text-muted ml-2">海外代购</span>
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="搜索海外商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Region Selection */}
        <div className="mb-4">
          <h3 className="text-sm text-text-muted mb-3">选择代购地区</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {regions.map((region) => (
              <div
                key={region.id}
                onClick={() => setSelectedRegion(region.name)}
                className={`bg-dark-card rounded-xl p-4 text-center cursor-pointer transition-all duration-300 border-2 ${
                  selectedRegion === region.name ? 'border-pink-500 shadow-lg' : 'border-dark-border hover:border-pink-500/50'
                }`}
                style={selectedRegion === region.name ? { backgroundColor: `${ACCENT_COLOR}15` } : {}}
              >
                <span className="text-3xl block mb-1">{region.icon}</span>
                <h4 className="font-medium text-text-primary text-sm">{region.name}</h4>
                <p className="text-xs text-text-muted">{region.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-text-primary mb-1">代购说明：</p>
          <p className="text-text-muted">1. 商品价格包含国际运费、关税及代购手续费</p>
          <p className="text-text-muted">2. 预计送达时间：7-15个工作日</p>
          <p className="text-text-muted">3. 支持支付定金或全款两种方式</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-dark-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-dark-border hover:border-pink-500/50"
          >
            <div className="relative h-40">
              <Image src={product.image} alt={product.title} fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-pink-500/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {product.region}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-text-primary text-sm mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-xs text-text-muted mb-2">平台：{product.platform}</p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">商品价</span>
                  <span className="text-text-primary">¥{product.price}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">税费/运费</span>
                  <span className="text-pink-500">¥{product.tax}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-dark-border">
                  <span className="text-text-muted">到手价</span>
                  <span className="text-pink-500 font-bold">¥{product.finalPrice}</span>
                </div>
              </div>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPayment(method.id);
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPayment === method.id
                        ? `${method.color} text-white`
                        : 'bg-dark-primary text-text-secondary hover:bg-dark-border'
                    }`}
                  >
                    {method.name}（{method.amount}）
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-200 bg-dark-nav border-t border-dark-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-sm text-text-muted">已选商品</div>
            <div className="text-pink-500 font-bold text-xl">¥0.00</div>
          </div>
          <button className="py-3 px-8 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
            结算
          </button>
        </div>
      </div>
    </CategoryLayout>
  );
}
