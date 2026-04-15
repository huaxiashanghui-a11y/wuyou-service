'use client';

import Link from 'next/link';
import { useApp } from '@/lib/i18n';
import { ArrowLeft, Home, Loader2 } from 'lucide-react';

export default function NotFound() {
  const { language } = useApp();

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
        {/* Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {language === 'my' ? 'လာမည့်သူ' : language === 'en' ? 'Coming Soon' : '即将上线'}
        </h1>

        {/* Message */}
        <div className="glass rounded-2xl p-6 mb-8">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {getMessage()}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 btn-orange-gradient rounded-xl font-medium"
          >
            <Home className="w-5 h-5" />
            {language === 'my' ? 'ပင်မသို့' : language === 'en' ? 'Go Home' : '返回首页'}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'my' ? 'နောက်သို့' : language === 'en' ? 'Go Back' : '返回上一页'}
          </button>
        </div>
      </div>
    </div>
  );
}
