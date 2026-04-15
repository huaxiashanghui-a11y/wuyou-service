'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/lib/i18n';
import {
  Smartphone, Gamepad2, Monitor, Globe, Zap, Play,
  Box, Copyright, Gift, ArrowRight, Flame, Clock
} from 'lucide-react';

// Category data interface
interface CategoryCard {
  id: string;
  icon: React.ReactNode;
  href: string;
  highlight?: boolean;
  color: string;
  bgGradient: string;
}

// Category cards configuration
const getCategories = (t: (key: string) => string): CategoryCard[] => [
  {
    id: 'recharge',
    icon: <Smartphone className="w-8 h-8" />,
    href: '/recharge',
    highlight: true,
    color: 'text-orange-600',
    bgGradient: 'from-orange-500 to-orange-600',
  },
  {
    id: 'games',
    icon: <Gamepad2 className="w-8 h-8" />,
    href: '/games',
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'pc',
    icon: <Monitor className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'web',
    icon: <Globe className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-teal-600',
    bgGradient: 'from-teal-500 to-teal-600',
  },
  {
    id: 'mobile',
    icon: <Zap className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-green-600',
  },
  {
    id: 'playstation',
    icon: <Play className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'xbox',
    icon: <Box className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-green-700',
    bgGradient: 'from-green-600 to-green-700',
  },
  {
    id: 'switch',
    icon: <Copyright className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-red-600',
    bgGradient: 'from-red-500 to-red-600',
  },
  {
    id: 'forex',
    icon: <Globe className="w-8 h-8" />,
    href: '/forex',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'gift',
    icon: <Gift className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 to-pink-600',
  },
  {
    id: 'other',
    icon: <Gamepad2 className="w-8 h-8" />,
    href: '/coming-soon',
    color: 'text-gray-600',
    bgGradient: 'from-gray-500 to-gray-600',
  },
];

// Category card component
function CategoryCardComponent({ card, t, language }: { card: CategoryCard; t: (key: string) => string; language: string }) {
  const getName = () => {
    const names: Record<string, Record<string, string>> = {
      recharge: { zh: '话费充值', en: 'Mobile Recharge', my: 'မိုဘိုင်းဖုန်း' },
      games: { zh: '游戏代充', en: 'Game Recharge', my: 'ဂိမ်းဖြည့်သွင်း' },
      pc: { zh: 'PC端游戏', en: 'PC Games', my: 'PCဂိမ်း' },
      web: { zh: '网页游戏', en: 'Web Games', my: 'Webဂိမ်း' },
      mobile: { zh: '手游充值', en: 'Mobile Top-up', my: 'Mobile Top-up' },
      playstation: { zh: 'PlayStation', en: 'PlayStation', my: 'PlayStation' },
      xbox: { zh: 'Xbox', en: 'Xbox', my: 'Xbox' },
      switch: { zh: 'Nintendo Switch', en: 'Nintendo Switch', my: 'Nintendo Switch' },
      forex: { zh: '无忧外汇', en: 'Forex Exchange', my: 'ငွေလဲ' },
      gift: { zh: '礼品卡', en: 'Gift Cards', my: 'လက်မှတ်' },
      other: { zh: '其他服务', en: 'Other Services', my: 'အခြား' },
    };
    return names[card.id]?.[language] || names[card.id]?.zh || card.id;
  };

  const getDesc = () => {
    const descs: Record<string, Record<string, string>> = {
      recharge: { zh: '缅甸话费秒充，全运营商支持', en: 'Myanmar credit instant recharge', my: 'မြန်မာငွေချက်ချင်း' },
      games: { zh: '热门游戏点卡充值', en: 'Hot game card recharge', my: 'ရေပန်းစားဂိမ်း' },
      pc: { zh: 'Steam/Epic/Origin', en: 'Steam/Epic/Origin PC', my: 'PCဂိမ်း' },
      web: { zh: '网页游戏便捷充值', en: 'Web game recharge', my: 'Webဂိမ်း' },
      mobile: { zh: '王者荣耀/原神/和平', en: 'Honor/Genshin/PUBG', my: 'Mobileဂိမ်း' },
      playstation: { zh: 'PS5/PS4游戏会员', en: 'PS5/PS4 games', my: 'PS5/PS4' },
      xbox: { zh: 'Xbox游戏/Game Pass', en: 'Xbox games/Game Pass', my: 'Xbox' },
      switch: { zh: 'Switch游戏卡带', en: 'Switch game cards', my: 'Switch' },
      forex: { zh: '实时汇率换算', en: 'Real-time exchange', my: 'ငွေလဲ' },
      gift: { zh: '视频/音乐会员卡', en: 'Video/Music cards', my: 'လက်မှတ်' },
      other: { zh: '更多增值服务', en: 'More services', my: 'အခြား' },
    };
    return descs[card.id]?.[language] || descs[card.id]?.zh || '';
  };

  return (
    <Link
      href={card.href}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        card.highlight
          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
          : 'glass'
      }`}
    >
      {/* Highlight badge for recharge */}
      {card.highlight && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
          <Flame className="w-3 h-3" />
          {language === 'zh' ? '热销' : language === 'en' ? 'Hot' : 'ရောင်းအားကောင်း'}
        </div>
      )}

      {/* Icon */}
      <div className={`p-6 ${card.highlight ? '' : card.bgGradient.replace('from-', 'bg-gradient-to-br ')}`}>
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
          card.highlight ? 'bg-white/20' : 'bg-white/90'
        }`}>
          <div className={card.highlight ? 'text-white' : card.color}>
            {card.icon}
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 ${card.highlight ? 'text-white' : 'text-gray-800'}`}>
          {getName()}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-4 ${card.highlight ? 'text-white/80' : 'text-gray-600'}`}>
          {getDesc()}
        </p>

        {/* Badges for special cards */}
        {card.highlight && (
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
              <Clock className="w-3 h-3" />
              {language === 'zh' ? '秒到账' : language === 'en' ? 'Instant' : 'ချက်ချင်း'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
              <Smartphone className="w-3 h-3" />
              4+ {language === 'zh' ? '运营商' : language === 'en' ? 'Operators' : 'လုပ်ငန်း'}
            </span>
          </div>
        )}

        {/* Arrow indicator */}
        <div className={`flex items-center gap-1 text-sm font-medium mt-4 ${
          card.highlight ? 'text-white/80 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-600'
        }`}>
          <span>{language === 'zh' ? '立即访问' : language === 'en' ? 'Visit Now' : 'ယခုသွားမည်'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className={`h-1 ${
        card.highlight ? 'bg-white/30' : 'bg-gradient-to-r from-orange-500 to-orange-600'
      }`} />
    </Link>
  );
}

function ShopContent() {
  const { t, language } = useApp();
  const categories = getCategories(t);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            {t('shop.allCategories')}
          </span>
        </h1>
        <p className="text-gray-600">
          {language === 'zh' ? '选择您需要的服务分类，快速开始' :
           language === 'en' ? 'Select your service category to get started' :
           'ဝန်ဆောင်မှုအမျိုးအစားရွေးချယ်ပါ'}
        </p>
      </div>

      {/* Category Cards Grid - 4 columns on desktop, 2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((card) => (
          <CategoryCardComponent
            key={card.id}
            card={card}
            t={t}
            language={language}
          />
        ))}
      </div>

      {/* Bottom Info Section */}
      <div className="mt-12 glass rounded-2xl p-6 text-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm">{language === 'zh' ? '即时到账' : language === 'en' ? 'Instant Delivery' : 'ချက်ချင်းရရှိ'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm">{language === 'zh' ? '官方渠道' : language === 'en' ? 'Official Channel' : 'တရားဝင်လမ်းကြောင်း'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm">{language === 'zh' ? '安全支付' : language === 'en' ? 'Secure Payment' : 'လုံခြုံသောငွေပေးချေမှု'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-sm">7x24h {language === 'zh' ? '客服' : language === 'en' ? 'Support' : 'ဖောက်ပိုင်ခွင့်'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="h-10 w-48 skeleton rounded mx-auto mb-3" />
        <div className="h-5 w-64 skeleton rounded mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <div className="h-40 skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-6 skeleton rounded w-2/3" />
              <div className="h-4 skeleton rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Suspense fallback={<ShopLoading />}>
          <ShopContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
