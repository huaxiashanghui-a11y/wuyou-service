'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'zh' | 'en' | 'my';
type Currency = 'USD' | 'CNY' | 'MMK';

interface Translations {
  [key: string]: {
    zh: string;
    en: string;
    my: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { zh: '首页', en: 'Home', my: 'ပင်မစာမျက်နှာ' },
  'nav.products': { zh: '商品', en: 'Products', my: 'ထုတ်ကုန်များ' },
  'nav.orders': { zh: '订单', en: 'Orders', my: 'အမှာစာများ' },
  'nav.help': { zh: '帮助', en: 'Help', my: 'အကူအညီ' },
  'nav.login': { zh: '登录', en: 'Login', my: 'ဝင်ရောက်မည်' },
  'nav.register': { zh: '注册', en: 'Register', my: 'မှတ်ပုံတင်မည်' },
  'nav.search': { zh: '搜索商品...', en: 'Search...', my: 'ရှာဖွေမည်...' },
  'nav.searchBtn': { zh: '搜索', en: 'Search', my: 'ရှာဖွေ' },
  
  // Categories
  'cat.allServices': { zh: '所有服务', en: 'All Services', my: 'ဝန်ဆောင်မှုအားလုံး' },
  'cat.live': { zh: '直播平台', en: 'Live Streaming', my: 'တိုက်ရိုက်ထုတ်လွှင့်မှု' },
  'cat.points': { zh: '平台点卡', en: 'Point Cards', my: 'ပွိုင့်ကတ်များ' },
  'cat.games': { zh: '游戏充值', en: 'Game Recharge', my: 'ဂိမ်းဖြည့်သွင်းမှု' },
  'cat.video': { zh: '视频音频', en: 'Video & Audio', my: 'ဗီဒီယိုနှင့်အသံ' },
  'cat.companion': { zh: '陪玩陪聊', en: 'Companion', my: 'သူငယ်ချင်းတွဲကစား' },
  'cat.voice': { zh: '语音交友', en: 'Voice Chat', my: 'အသံချင်းစကားပြော' },
  'cat.daily': { zh: '生活日常', en: 'Daily Life', my: 'နေ့စဉ်ဘဝ' },
  'cat.social': { zh: '社交平台', en: 'Social Platform', my: 'လူမှုရေးပလက်ဖောင်း' },
  'cat.literature': { zh: '文学动漫', en: 'Literature & Anime', my: 'စာပေနှင့်အန်နီမေးစ်' },
  'cat.tools': { zh: '加速工具', en: 'Accelerators', my: 'အမြန်နှေးကွက်ကိရိခက်' },
  'cat.allCategories': { zh: '全部分类', en: 'All Categories', my: 'အမျိုးအစားအားလုံး' },
  
  // Service Features
  'service.autoDeliver': { zh: '24h自动发货', en: '24h Auto Delivery', my: '၂၄နာရီအလိုအလျောက်ပို့ဆောင်မှု' },
  'service.instant': { zh: '下单即到', en: 'Instant Delivery', my: 'ချက်ချင်းရရှိ' },
  'service.secure': { zh: '安全支付', en: 'Secure Payment', my: 'လုံခြုံသောငွေပေးချေမှု' },
  'service.guarantee': { zh: '交易保障', en: 'Transaction Protection', my: 'ကုန်သွယ်မှုကာကွယ်မှု' },
  'service.authentic': { zh: '正品保证', en: '100% Authentic', my: 'မူလထုတ်ကုန်' },
  'service.official': { zh: '官方渠道', en: 'Official Channels', my: 'တရားဝင်လမ်းကြောင်း' },
  'service.support': { zh: '售后保障', en: 'After-sales Support', my: 'ရောင်းချပြီးဝန်ဆောင်မှု' },
  'service.customer': { zh: '7x24h客服', en: '7x24h Support', my: '၇x၂၄နာရီဖောက်ပိုင်ခွင့်' },
  
  // Sidebar
  'sidebar.service24': { zh: '24小时在线客服', en: '24h Online Service', my: '၂၄နာရီအွန်လိုင်းဖောက်ပိုင်ခွင့်' },
  'sidebar.scan': { zh: '扫码咨询', en: 'Scan to Consult', my: 'QRကုဒ်ဖတ်ပြီးမေးမြန်းမည်' },
  'sidebar.social': { zh: '社交平台', en: 'Social Platforms', my: 'လူမှုရေးပလက်ဖောင်း' },
  'sidebar.backTop': { zh: '回到顶部', en: 'Back to Top', my: 'အပေါ်သို့ပြန်သွားမည်' },
  'sidebar.alwaysReady': { zh: '随时为您服务', en: 'Always Ready to Help', my: 'မည်သည်အချိန်တွင်မဆိုဝန်ဆောင်မှုပေး' },
  
  // Sections
  'section.hotRecharge': { zh: '热门充值', en: 'Hot Recharge', my: 'လူကြိုက်များဖြည့်သွင်းမှု' },
  'section.hotCategories': { zh: '热门分类', en: 'Hot Categories', my: 'လူကြိုက်များအမျိုးအစား' },
  'section.quickRecharge': { zh: '快捷充值', en: 'Quick Recharge', my: 'မြန်ဆန်ဖြည့်သွင်းမှု' },
  'section.viewMore': { zh: '查看更多', en: 'View More', my: 'ပိုမိုကြည့်ရှုမည်' },
  'section.liveSocial': { zh: '直播/社交', en: 'Live/Social', my: 'တိုက်ရိုက်/လူမှုရေး' },
  'section.games': { zh: '游戏充值', en: 'Game Recharge', my: 'ဂိမ်းဖြည့်သွင်းမှု' },
  'section.sold': { zh: '已售', en: 'Sold', my: 'ရောင်းပြီး' },
  
  // Footer
  'footer.about': { zh: '关于我们', en: 'About Us', my: 'ကျွန်ုပ်တို့အကြောင်း' },
  'footer.quickLinks': { zh: '快捷链接', en: 'Quick Links', my: 'လျှောက်လွှာလင့်ခ်များ' },
  'footer.help': { zh: '帮助中心', en: 'Help Center', my: 'အကူအညီစင်တာ' },
  'footer.contact': { zh: '联系我们', en: 'Contact Us', my: 'ဆက်သွယ်ရန်' },
  'footer.terms': { zh: '服务条款', en: 'Terms of Service', my: 'ဝန်ဆောင်မှုစည်းမျဉ်းများ' },
  'footer.privacy': { zh: '隐私政策', en: 'Privacy Policy', my: 'ကိုယ်ရေးလုံခြုံမှုမူဝါဒ' },
  'footer.agreement': { zh: '用户协议', en: 'User Agreement', my: 'အသုံးပြုသူသဘောတူညီချက်' },
  
  // Banners
  'banner.douyin': { zh: '抖音大优惠', en: 'Douyin Big Discount', my: 'ဒူးရင်းဈေးလျှောကျသိသ' },
  'banner.grabNow': { zh: '马上抢购', en: 'Grab Now', my: 'ယခုဝယ်ယူမည်' },
  'banner.seconds': { zh: '10秒到账', en: '10 Seconds Delivery', my: '၁၀စက္ကန့်အတွင်းရရှိ' },
  'banner.xiaohongshu': { zh: '小红书充值', en: 'Xiaohongshu Recharge', my: 'ရှောင်ဟုရှူးဖြည့်သွင်းမှု' },
  'banner.discount': { zh: '限时折扣', en: 'Limited Discount', my: 'ကန့်သတ်အချိန်ဈေးလျှောကျ' },
  'banner.lowest': { zh: '全网最低价', en: 'Lowest Price Online', my: 'အွန်လိုင်းဈေးအနည်းဆုံး' },
  'banner.game': { zh: '游戏点卡特惠', en: 'Game Cards Discount', my: 'ဂိမ်းကတ်ဈေးလျှောကျ' },
  'banner.sale': { zh: '全场8折', en: '20% Off', my: '၂၀%ဈေးလျှောကျ' },
  'banner.instant': { zh: '秒到账', en: 'Instant Delivery', my: 'ချက်ချင်းရရှိ' },
  'banner.buyNow': { zh: '立即抢购', en: 'Buy Now', my: 'ယခုဝယ်ယူမည်' },
  
  // Common
  'common.buy': { zh: '购买', en: 'Buy', my: 'ဝယ်ယူမည်' },
  'common.soldOut': { zh: '已售罄', en: 'Sold Out', my: 'ရောင်းပြီးပါပြီ' },
  'common.limited': { zh: '限时', en: 'Limited', my: 'ကန့်သတ်' },
  'common.hot': { zh: '爆款', en: 'Hot', my: 'ရေပန်းစား' },

  // Forex
  'forex.title': { zh: '无忧外汇', en: 'Forex Exchange', my: 'ငွေလဲလှယ်မှု' },
  'forex.subtitle': { zh: '实时汇率，专业服务', en: 'Real-time Rates, Professional Service', my: 'အချိန်နှင့်တပြေးတည်နောက်ပြန်ဆွဲ', },
  'forex.rate': { zh: '实时汇率', en: 'Real-time Rate', my: 'အချိန်နှင့်တပြေးတည်နောက်ပြန်ဆွဲ' },
  'forex.calculator': { zh: '汇率计算器', en: 'Rate Calculator', my: 'ငွေလဲလှယ်တွက်စက်' },
  'forex.converter': { zh: '货币换算', en: 'Currency Converter', my: 'ငွေကြေးပြောင်းလဲမှု' },
  'forex.from': { zh: '从', en: 'From', my: 'မှ' },
  'forex.to': { zh: '到', en: 'To', my: 'သို့' },
  'forex.amount': { zh: '金额', en: 'Amount', my: 'ပမာဏ' },
  'forex.result': { zh: '结果', en: 'Result', my: 'ရလဒ်' },
  'forex.trend': { zh: '汇率走势', en: 'Rate Trend', my: 'ငွေလဲလှယ်မှုလမ်းကြောင်း' },
  'forex.history': { zh: '历史汇率', en: 'Historical Rate', my: 'အတိတ်ငွေလဲလှယ်မှု' },
  'forex.buy': { zh: '买入价', en: 'Buy Rate', my: 'ဝယ်ဈေး' },
  'forex.sell': { zh: '卖出价', en: 'Sell Rate', my: 'ရောင်းဈေး' },
  'forex.lastUpdate': { zh: '最后更新', en: 'Last Update', my: 'နောက်ဆုံးပြင်ဆင်' },
  'forex.categories': { zh: '分类导航', en: 'Categories', my: 'အမျိုးအစားများ' },
  'forex.live': { zh: '实时更新', en: 'Live Update', my: 'အချိန်နှင့်တပြေးတည်' },
  'forex.viewAll': { zh: '查看全部', en: 'View All', my: 'အားလုံးကြည့်မည်' },
  'forex.quickConvert': { zh: '快速换算', en: 'Quick Convert', my: 'မြန်မြန်ပြောင်းလဲ' },
  'forex.featured': { zh: '精选推荐', en: 'Featured', my: 'အထူးသင့်တင်သည်' },
  'forex.learnMore': { zh: '了解更多', en: 'Learn More', my: 'ပိုမိုသိမှတ်မည်' },
  'forex.liveRates': { zh: '实时汇率', en: 'Live Rates', my: 'အချက်အလက်နှုန်းများ' },
  'forex.updateTime': { zh: '更新时间', en: 'Update Time', my: 'ပြင်ဆင်ချိန်' },
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
