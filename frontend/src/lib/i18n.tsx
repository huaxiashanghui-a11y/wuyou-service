'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'zh' | 'en';
type Currency = 'USD' | 'CNY' | 'MMK';

interface Translations {
  [key: string]: {
    zh: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.products': { zh: '商品', en: 'Products' },
  'nav.orders': { zh: '订单', en: 'Orders' },
  'nav.help': { zh: '帮助', en: 'Help' },
  'nav.login': { zh: '登录', en: 'Login' },
  'nav.register': { zh: '注册', en: 'Register' },
  'nav.search': { zh: '搜索商品...', en: 'Search products...' },
  'nav.searchBtn': { zh: '搜索', en: 'Search' },
  
  // Categories
  'cat.allServices': { zh: '所有服务', en: 'All Services' },
  'cat.live': { zh: '直播平台', en: 'Live Streaming' },
  'cat.points': { zh: '平台点卡', en: 'Point Cards' },
  'cat.games': { zh: '游戏充值', en: 'Game Recharge' },
  'cat.video': { zh: '视频音频', en: 'Video & Audio' },
  'cat.companion': { zh: '陪玩陪聊', en: 'Companion' },
  'cat.voice': { zh: '语音交友', en: 'Voice Chat' },
  'cat.daily': { zh: '生活日常', en: 'Daily Life' },
  'cat.social': { zh: '社交平台', en: 'Social Platform' },
  'cat.literature': { zh: '文学动漫', en: 'Literature & Anime' },
  'cat.tools': { zh: '加速工具', en: 'Accelerators' },
  'cat.allCategories': { zh: '全部分类', en: 'All Categories' },
  
  // Service Features
  'service.autoDeliver': { zh: '24h自动发货', en: '24h Auto Delivery' },
  'service.instant': { zh: '下单即到', en: 'Instant Delivery' },
  'service.secure': { zh: '安全支付', en: 'Secure Payment' },
  'service.guarantee': { zh: '交易保障', en: 'Transaction Protection' },
  'service.authentic': { zh: '正品保证', en: '100% Authentic' },
  'service.official': { zh: '官方渠道', en: 'Official Channels' },
  'service.support': { zh: '售后保障', en: 'After-sales Support' },
  'service.customer': { zh: '7x24h客服', en: '7x24h Support' },
  
  // Sidebar
  'sidebar.service24': { zh: '24小时在线客服', en: '24h Online Service' },
  'sidebar.scan': { zh: '扫码咨询', en: 'Scan to Consult' },
  'sidebar.social': { zh: '社交平台', en: 'Social Platforms' },
  'sidebar.backTop': { zh: '回到顶部', en: 'Back to Top' },
  'sidebar.alwaysReady': { zh: '随时为您服务', en: 'Always Ready to Help' },
  
  // Sections
  'section.hotRecharge': { zh: '热门充值', en: 'Hot Recharge' },
  'section.hotCategories': { zh: '热门分类', en: 'Hot Categories' },
  'section.quickRecharge': { zh: '快捷充值', en: 'Quick Recharge' },
  'section.viewMore': { zh: '查看更多', en: 'View More' },
  'section.liveSocial': { zh: '直播/社交', en: 'Live/Social' },
  'section.games': { zh: '游戏充值', en: 'Game Recharge' },
  'section.sold': { zh: '已售', en: 'Sold' },
  
  // Footer
  'footer.about': { zh: '关于我们', en: 'About Us' },
  'footer.quickLinks': { zh: '快捷链接', en: 'Quick Links' },
  'footer.help': { zh: '帮助中心', en: 'Help Center' },
  'footer.contact': { zh: '联系我们', en: 'Contact Us' },
  'footer.terms': { zh: '服务条款', en: 'Terms of Service' },
  'footer.privacy': { zh: '隐私政策', en: 'Privacy Policy' },
  'footer.agreement': { zh: '用户协议', en: 'User Agreement' },
  
  // Banners
  'banner.douyin': { zh: '抖音大优惠', en: 'Douyin Big Discount' },
  'banner.grabNow': { zh: '马上抢购', en: 'Grab Now' },
  'banner.seconds': { zh: '10秒到账', en: '10 Seconds Delivery' },
  'banner.xiaohongshu': { zh: '小红书充值', en: 'Xiaohongshu Recharge' },
  'banner.discount': { zh: '限时折扣', en: 'Limited Discount' },
  'banner.lowest': { zh: '全网最低价', en: 'Lowest Price Online' },
  'banner.game': { zh: '游戏点卡特惠', en: 'Game Cards Discount' },
  'banner.sale': { zh: '全场8折', en: '20% Off' },
  'banner.instant': { zh: '秒到账', en: 'Instant Delivery' },
  'banner.buyNow': { zh: '立即抢购', en: 'Buy Now' },
  
  // Common
  'common.buy': { zh: '购买', en: 'Buy' },
  'common.soldOut': { zh: '已售罄', en: 'Sold Out' },
  'common.limited': { zh: '限时', en: 'Limited' },
  'common.hot': { zh: '爆款', en: 'Hot' },
};

interface CurrencyRates {
  USD: number;
  CNY: number;
  MMK: number;
}

const currencyRates: CurrencyRates = {
  USD: 1,
  CNY: 7.2,
  MMK: 2100,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  CNY: '¥',
  MMK: 'K',
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const [currency, setCurrency] = useState<Currency>('CNY');

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || key;
  }, [language]);

  const formatPrice = useCallback((price: number): string => {
    const convertedPrice = price / currencyRates[currency];
    return `${currencySymbols[currency]}${convertedPrice.toFixed(2)}`;
  }, [currency]);

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
