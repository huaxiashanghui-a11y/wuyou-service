'use client';

import Link from 'next/link';
import { useApp } from '@/lib/i18n';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';

export default function ComingSoon() {
  const { language, t } = useApp();

  const getMessage = () => {
    switch (language) {
      case 'my':
        return 'ပလက်ဖောင်းသည် အပြီးသတ်အောင် လုပ်ဆောင်နေပါသည်၊ ကျေးဇူးပြု၍ စောင့်ပါ...';
      case 'en':
        return 'The platform is under development. Please stay tuned...';
      default:
        return '平台正在努力完善中，请敬请期待...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Icon Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30 animate-pulse">
              <Clock className="w-16 h-16 text-white" />
            </div>
            {/* Loading dots */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {language === 'my' ? 'လာမည့်သူ' : language === 'en' ? 'Coming Soon' : '即将上线'}
        </h1>

        {/* Message */}
        <div className="glass rounded-2xl p-6 mb-8">
          <Loader2 className="w-8 h-8 text-orange-500 mx-auto mb-4 animate-spin" />
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {getMessage()}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {language === 'my' ? '60% ပြီးပါပြီ' : language === 'en' ? '60% Complete' : '进度 60%'}
          </p>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 btn-orange-gradient rounded-xl font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'my' ? 'ပင်မသို့ပြန်သွားမည်' : language === 'en' ? 'Back to Home' : '返回首页'}
        </Link>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0.4 + i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
