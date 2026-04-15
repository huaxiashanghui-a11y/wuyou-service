'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { useApp } from '@/lib/i18n';
import { Gamepad2, Heart, ShoppingCart, HelpCircle, Check, Shield, Clock, CreditCard, ChevronRight, Star, ArrowLeft } from 'lucide-react';

interface PriceTier {
  id: string;
  name: string;
  nameZh: string;
  nameMy: string;
  nameEn: string;
  price: number;
  originalPrice?: number;
  icon: string;
  soldOut?: boolean;
  badge?: string;
}

interface GameData {
  id: string;
  name: string;
  nameZh: string;
  nameMy: string;
  nameEn: string;
  region: string;
  regionLabel: { zh: string; my: string; en: string };
  priceTiers: PriceTier[];
  description: { zh: string; my: string; en: string };
  guides: { zh: string[]; my: string[]; en: string[] };
  relatedGames: { id: string; name: string; nameZh: string; nameMy: string; nameEn: string; price: number }[];
}

const gameDatabase: Record<string, GameData> = {
  'genshin-impact': {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    nameZh: '原神',
    nameMy: 'Genshin Impact',
    nameEn: 'Genshin Impact',
    region: 'global',
    regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' },
    priceTiers: [
      { id: 'weekly', name: 'Weekly Card', nameZh: '周卡', nameMy: 'အပတ်စဥ်', nameEn: 'Weekly Card', price: 6.99, icon: '📅' },
      { id: '16', name: '16 Genesis Crystals', nameZh: '16创世结晶', nameMy: '16 Genesis Crystals', nameEn: '16 Genesis Crystals', price: 0.99, icon: '💎' },
      { id: '50', name: '50 Genesis Crystals', nameZh: '50创世结晶', nameMy: '50 Genesis Crystals', nameEn: '50 Genesis Crystals', price: 2.99, icon: '💎' },
      { id: '80', name: '80 Genesis Crystals Bonus', nameZh: '80+8创世结晶', nameMy: '80+8 Genesis Crystals', nameEn: '80+8 Genesis Crystals', price: 4.99, originalPrice: 5.99, icon: '💎' },
      { id: '320', name: '320 Genesis Crystals Bonus', nameZh: '320+32创世结晶', nameMy: '320+32 Genesis Crystals', nameEn: '320+32 Genesis Crystals', price: 19.99, originalPrice: 24.99, icon: '💎' },
      { id: '980', name: '980 Genesis Crystals Bonus', nameZh: '980+98创世结晶', nameMy: '980+98 Genesis Crystals', nameEn: '980+98 Genesis Crystals', price: 59.99, originalPrice: 74.99, icon: '💎' },
      { id: '1960', name: '1960 Genesis Crystals Bonus', nameZh: '1960+196创世结晶', nameMy: '1960+196 Genesis Crystals', nameEn: '1960+196 Genesis Crystals', price: 119.99, originalPrice: 149.99, icon: '💎' },
      { id: '3280', name: '3280 Genesis Crystals Bonus', nameZh: '3280+328创世结晶', nameMy: '3280+328 Genesis Crystals', nameEn: '3280+328 Genesis Crystals', price: 199.99, originalPrice: 249.99, icon: '💎' },
      { id: '6480', name: '6480 Genesis Crystals Bonus', nameZh: '6480+648创世结晶', nameMy: '6480+648 Genesis Crystals', nameEn: '6480+648 Genesis Crystals', price: 399.99, originalPrice: 499.99, icon: '💎' },
      { id: 'double', name: 'Double Token Lucky Bag', nameZh: '双倍token福袋', nameMy: 'Double Token Lucky Bag', nameEn: 'Double Token Lucky Bag', price: 49.99, icon: '🎁', soldOut: true },
    ],
    description: {
      zh: '《原神》是由米哈游自主研发的一款全新开放世界冒险RPG。玩家将在游戏中探索一个被称作「提瓦特」的幻想世界，在这广阔的世界中，你可以踏遍七种元素，交映着这片大陆。',
      my: 'Genshin Impact သည် miHoYo မှ ကိုယ်ပိုင်းတီထွင်ထားသော ဖွင့်လှစ်ကမ္ဘာစွန်းစွန်း RPG တစ်ခုဖြစ်ပါသည်။',
      en: 'Genshin Impact is an open-world action RPG developed by miHoYo. Explore a vast world, meet characters, and master elemental combat in this immersive fantasy adventure.'
    },
    guides: {
      zh: [
        '1. 登录您的游戏账号',
        '2. 选择需要充值的档位',
        '3. 输入您的游戏UID（可以在游戏内个人资料查看）',
        '4. 确认订单并完成支付',
        '5. 支付成功后，钻石将自动充值到账'
      ],
      my: [
        '1. သင်၏ဂိမ်းအကောင့်သို့ ဝင်ပါ',
        '2. ဖြည့်သွင်းလိုသော tier ကို ရွေးချယ်ပါ',
        '3. သင်၏ UID ကို ထည့်သွင်းပါ',
        '4. အမိန့်ကို အတည်ပြုပြီး ငွေပေးချေပါ',
        '5. ငွေပေးချေမှု အောင်မြင်ပါက diamonds များ အလိုအလျောက် ရရှိပါမည်'
      ],
      en: [
        '1. Log in to your game account',
        '2. Select the recharge tier you want',
        '3. Enter your game UID (found in your profile)',
        '4. Confirm order and complete payment',
        '5. After successful payment, diamonds will be credited automatically'
      ]
    },
    relatedGames: [
      { id: 'honkai-sr', name: 'Honkai: Star Rail', nameZh: '崩坏：星穹铁道', nameMy: 'Honkai: Star Rail', nameEn: 'Honkai: Star Rail', price: 49.99 },
      { id: 'tower-of-fantasy', name: 'Tower of Fantasy', nameZh: '幻塔', nameMy: 'Tower of Fantasy', nameEn: 'Tower of Fantasy', price: 39.99 },
      { id: 'honkai-3', name: 'Honkai Impact 3rd', nameZh: '崩坏3', nameMy: 'Honkai Impact 3rd', nameEn: 'Honkai Impact 3rd', price: 29.99 },
    ]
  }
};

export default function GameDetailPage() {
  const params = useParams();
  const { language, currency, formatPrice } = useApp();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const gameId = params.id as string;
  const game = gameDatabase[gameId] || gameDatabase['genshin-impact'];

  const getGameName = () => {
    if (language === 'my') return game.nameMy;
    if (language === 'en') return game.nameEn;
    return game.nameZh;
  };

  const getTierName = (tier: PriceTier) => {
    if (language === 'my') return tier.nameMy;
    if (language === 'en') return tier.nameEn;
    return tier.nameZh;
  };

  const selectedTierData = game.priceTiers.find(t => t.id === selectedTier);
  const totalPrice = selectedTierData?.price || 0;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-8">
        {/* Back Button */}
        <Link href="/games" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {language === 'my' ? 'နောက်သို့' : language === 'en' ? 'Back' : '返回'}
        </Link>

        {/* Game Header */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Game Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>

            {/* Game Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getGameName()} {language === 'zh' ? '充值' : language === 'my' ? 'ဖြည့်သွင်းမှု' : 'Recharge'}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">
                      {game.regionLabel[language] || game.regionLabel.zh}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-xl transition-all ${
                    isFavorite
                      ? 'bg-red-50 text-red-500'
                      : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Price Tiers */}
          <div className="lg:w-2/3">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                {language === 'my' ? 'ငွေပမာဏရွေးချယ်မှု' : language === 'en' ? 'Select Amount' : '选择充值金额'}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {game.priceTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => !tier.soldOut && setSelectedTier(tier.id)}
                    disabled={tier.soldOut}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      tier.soldOut
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : selectedTier === tier.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    {tier.soldOut && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded">
                        {language === 'my' ? 'ရောင်းပြီး' : language === 'en' ? 'Sold Out' : '售罄'}
                      </span>
                    )}
                    {tier.badge && !tier.soldOut && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                        {tier.badge}
                      </span>
                    )}
                    <div className="text-2xl mb-2">{tier.icon}</div>
                    <div className="font-medium text-gray-900 text-sm">{getTierName(tier)}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-lg font-bold text-orange-600">{formatPrice(tier.price)}</span>
                      {tier.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(tier.originalPrice)}</span>
                      )}
                    </div>
                    {selectedTier === tier.id && !tier.soldOut && (
                      <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-orange-500" />
                {language === 'my' ? 'ဂိမ်းဖော်ပြချက်' : language === 'en' ? 'Description' : '游戏介绍'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {game.description[language] || game.description.zh}
              </p>
            </div>

            {/* Guide */}
            <div className="glass rounded-2xl p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                {language === 'my' ? 'ငွေသွင်းမှုလမ်းညွှန်' : language === 'en' ? 'How to Recharge' : '充值指南'}
              </h2>
              <ul className="space-y-2">
                {game.guides[language]?.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Games */}
            <div className="glass rounded-2xl p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                {language === 'my' ? 'ဆက်စပ်ဂိမ်းများ' : language === 'en' ? 'Related Games' : '相关游戏'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {game.relatedGames.map((related) => (
                  <Link
                    key={related.id}
                    href={`/games/${related.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {language === 'my' ? related.nameMy : language === 'en' ? related.nameEn : related.nameZh}
                      </div>
                      <div className="text-orange-600 font-bold">{formatPrice(related.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order Info */}
          <div className="lg:w-1/3">
            <div className="glass rounded-2xl p-6 sticky top-32">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'my' ? 'အမိန့်အချက်အလက်' : language === 'en' ? 'Order Information' : '订单信息'}
              </h2>

              {/* Player ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'my' ? 'ကစားသမား ID' : language === 'en' ? 'Player ID' : '玩家ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder={language === 'my' ? 'ID ထည့်သွင်းပါ' : language === 'en' ? 'Enter your ID' : '请输入游戏ID'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
                {showHelp && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                    <p className="font-medium mb-1">{language === 'zh' ? '如何查询UID？' : language === 'my' ? 'UID ဘယ်လိုရှာမှာလဲ?' : 'How to find UID?'}</p>
                    <p>{language === 'zh' ? '打开游戏 → 点击左上角头像 → 个人资料页面即可看到UID' : language === 'my' ? 'ဂိမ်းဖွင့်ပါ → ဘယ်ဘက်အပေါ်ထောင့် avatar ကို နှိပ်ပါ → profile စာမျက်နှာတွင် UID ကို တွေ့နိုင်ပါသည်' : 'Open game → Click avatar on top left → Find UID on profile page'}</p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-gray-600">
                  {language === 'my' ? 'စုစုပေါင်း' : language === 'en' ? 'Total' : '合计'}
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {formatPrice(totalPrice)}
                </div>
                {selectedTierData?.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(selectedTierData.originalPrice)}
                  </div>
                )}
              </div>

              {/* Selected Tier Info */}
              {selectedTierData && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedTierData.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{getTierName(selectedTierData)}</div>
                      <div className="text-sm text-gray-500">
                        {language === 'my' ? 'ID' : language === 'en' ? 'ID' : 'ID'}: {playerId || ' - '}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy Button */}
              <button
                disabled={!selectedTier || !playerId}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  selectedTier && playerId
                    ? 'btn-orange-gradient'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {language === 'my' ? 'ချက်လက်မှတ်ဝယ်ယူမည်' : language === 'en' ? 'Buy Now' : '立即购买'}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{language === 'my' ? 'လုံခြုံသော' : language === 'en' ? 'Secure' : '安全'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{language === 'my' ? 'ချက်ချင်း' : language === 'en' ? 'Instant' : '即时'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span>{language === 'my' ? '24/7' : language === 'en' ? '24/7' : '24小时'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
