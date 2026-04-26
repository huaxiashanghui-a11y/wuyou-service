'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useApp } from '@/lib/i18n';
import { Gamepad2, Monitor, Globe, Smartphone, Play, Box, Crosshair, Heart, ShoppingCart, Star } from 'lucide-react';

// Platform categories
type Platform = 'pc' | 'web' | 'mobile' | 'playstation' | 'xbox' | 'switch';

interface PlatformCategory {
  id: Platform;
  name: { zh: string; my: string; en: string };
  icon: React.ReactNode;
  count: number;
}

const platforms: PlatformCategory[] = [
  { id: 'pc', name: { zh: 'PC端游戏', my: 'PCဂames', en: 'PC Games' }, icon: <Monitor className="w-5 h-5" />, count: 856 },
  { id: 'web', name: { zh: '网页游戏', my: 'Web Games', en: 'Web Games' }, icon: <Globe className="w-5 h-5" />, count: 432 },
  { id: 'mobile', name: { zh: '移动端', my: 'Mobile', en: 'Mobile' }, icon: <Smartphone className="w-5 h-5" />, count: 1723 },
  { id: 'playstation', name: { zh: 'PlayStation', my: 'PlayStation', en: 'PlayStation' }, icon: <Play className="w-5 h-5" />, count: 234 },
  { id: 'xbox', name: { zh: 'Xbox', my: 'Xbox', en: 'Xbox' }, icon: <Box className="w-5 h-5" />, count: 189 },
  { id: 'switch', name: { zh: 'Nintendo Switch', my: 'Nintendo Switch', en: 'Nintendo Switch' }, icon: <Crosshair className="w-5 h-5" />, count: 156 },
];

// Game data
interface Game {
  id: string;
  name: string;
  nameZh: string;
  nameMy: string;
  nameEn: string;
  cover: string;
  platform: Platform[];
  region: string;
  regionLabel: { zh: string; my: string; en: string };
  price: number;
  originalPrice?: number;
  rating: number;
  sold: number;
}

const games: Game[] = [
  { id: 'pubg-mobile', name: 'PUBG Mobile', nameZh: '绝地求生手游', nameMy: 'PUBG Mobile', nameEn: 'PUBG Mobile', cover: '/images/games/pubg.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 8.99, rating: 4.8, sold: 12580 },
  { id: 'mlbb', name: 'Mobile Legends', nameZh: '决胜巅峰', nameMy: 'Mobile Legends', nameEn: 'Mobile Legends', cover: '/images/games/mlbb.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 12.99, rating: 4.7, sold: 9876 },
  { id: 'free-fire', name: 'Free Fire', nameZh: 'Free Fire', nameMy: 'Free Fire', nameEn: 'Free Fire', cover: '/images/games/ff.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 9.99, rating: 4.6, sold: 15432 },
  { id: 'honkai-sr', name: 'Honkai: Star Rail', nameZh: '崩坏：星穹铁道', nameMy: 'Honkai: Star Rail', nameEn: 'Honkai: Star Rail', cover: '/images/games/hsr.jpg', platform: ['pc', 'mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 49.99, originalPrice: 59.99, rating: 4.9, sold: 7654 },
  { id: 'tower-of-fantasy', name: 'Tower of Fantasy', nameZh: '幻塔(国际)', nameMy: 'Tower of Fantasy', nameEn: 'Tower of Fantasy', cover: '/images/games/tof.jpg', platform: ['pc', 'mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 39.99, rating: 4.5, sold: 5432 },
  { id: 'ro-origin', name: 'Ragnarok Origin', nameZh: 'Ragnarok Origin Global', nameMy: 'Ragnarok Origin', nameEn: 'Ragnarok Origin Global', cover: '/images/games/ro.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 29.99, rating: 4.4, sold: 4321 },
  { id: 'dawn-awakening', name: 'Dawn Awakening', nameZh: '黎明觉醒', nameMy: 'Dawn Awakening', nameEn: 'Dawn Awakening', cover: '/images/games/dawn.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 19.99, rating: 4.3, sold: 3210 },
  { id: 'honkai-genshin', name: 'Genshin Impact', nameZh: '原神', nameMy: 'Genshin Impact', nameEn: 'Genshin Impact', cover: '/images/games/genshin.jpg', platform: ['pc', 'mobile', 'playstation'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 59.99, originalPrice: 69.99, rating: 4.9, sold: 25678 },
  { id: 'jjj', name: 'JinJinJin', nameZh: 'JinJinJin', nameMy: 'JinJinJin', nameEn: 'JinJinJin', cover: '/images/games/jjj.jpg', platform: ['mobile'], region: 'myanmar', regionLabel: { zh: '缅甸', my: 'မြန်မာ', en: 'Myanmar' }, price: 5.99, rating: 4.2, sold: 8765 },
  { id: 'codm', name: 'Call of Duty Mobile', nameZh: '使命召唤手游', nameMy: 'COD Mobile', nameEn: 'Call of Duty Mobile', cover: '/images/games/codm.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 14.99, rating: 4.7, sold: 11234 },
  { id: 'lol-wild', name: 'League of Legends: Wild Rift', nameZh: '英雄联盟手游', nameMy: 'LoL Wild Rift', nameEn: 'League of Legends: Wild Rift', cover: '/images/games/lol-wild.jpg', platform: ['mobile'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 19.99, rating: 4.6, sold: 7890 },
  { id: 'aov', name: 'Arena of Valor', nameZh: '王者荣耀国际版', nameMy: 'Arena of Valor', nameEn: 'Arena of Valor', cover: '/images/games/aov.jpg', platform: ['mobile', 'switch'], region: 'global', regionLabel: { zh: '英语/国际', my: 'အင်္ဂလိပ်/ကမ္ဘာလုံး', en: 'English/Global' }, price: 9.99, rating: 4.5, sold: 6543 },
];

export default function GamesPage() {
  const { language, currency, formatPrice } = useApp();
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const getPlatformLabel = (platform: PlatformCategory) => {
    return platform.name[language] || platform.name.zh;
  };

  const getGameName = (game: Game) => {
    if (language === 'my') return game.nameMy;
    if (language === 'en') return game.nameEn;
    return game.nameZh;
  };

  const filteredGames = activePlatform === 'all'
    ? games
    : games.filter(game => game.platform.includes(activePlatform));

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev =>
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  return (
    <div className="min-h-screen bg-games">
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-48 pb-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {language === 'my' ? 'ဂိမ်းပြန်လည်ဖြည့်သွင်းမှု' : language === 'en' ? 'Game Recharge' : '游戏代充'}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === 'my' ? 'အမျိုးမျိုးသောဂိမ်းများအတွက်ငွေသွင်းမှု' : language === 'en' ? 'Top up for various games worldwide' : '全球热门游戏充值服务'}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Platform Categories */}
          <div className="w-56 flex-shrink-0 hidden lg:block">
            <div className="glass rounded-xl p-4 sticky top-32">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-orange-500" />
                {language === 'my' ? 'ပလက်ဖောင်း' : language === 'en' ? 'Platform' : '平台'}
              </h3>
              <div className="space-y-1">
                {/* All Games */}
                <button
                  onClick={() => setActivePlatform('all')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    activePlatform === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {language === 'my' ? 'အားလုံး' : language === 'en' ? 'All Games' : '全部游戏'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activePlatform === 'all' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {games.length}
                  </span>
                </button>

                {/* Platform List */}
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setActivePlatform(platform.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activePlatform === platform.id
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {platform.icon}
                      {getPlatformLabel(platform)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activePlatform === platform.id ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {platform.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Platform Filter */}
          <div className="lg:hidden mb-4 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => setActivePlatform('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activePlatform === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {language === 'my' ? 'အားလုံး' : language === 'en' ? 'All' : '全部'}
              </button>
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setActivePlatform(platform.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activePlatform === platform.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {getPlatformLabel(platform)}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - Game Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-500">
              {language === 'my' ? 'ရလဒ်' : language === 'en' ? 'Results' : '共'}{' '}
              <span className="text-orange-500 font-medium">{filteredGames.length}</span>{' '}
              {language === 'my' ? 'ဂိမ်း' : language === 'en' ? 'games found' : '款游戏'}
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="glass rounded-xl overflow-hidden card-hover group"
                >
                  {/* Game Cover */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2 className="w-16 h-16 text-white/50" />
                    </div>
                    {/* Region Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-white text-xs">
                      {game.regionLabel[language] || game.regionLabel.zh}
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(game.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${favorites.includes(game.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>
                  </div>

                  {/* Game Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                      {getGameName(game)}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{game.rating}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {language === 'my' ? 'ရောင်းပြီး' : language === 'en' ? 'sold' : '已售'}{game.sold.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-lg font-bold text-orange-600">{formatPrice(game.price)}</span>
                        {game.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            {formatPrice(game.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic
                        }}
                        className="p-2 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-lg transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredGames.length === 0 && (
              <div className="text-center py-16">
                <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === 'my' ? 'ဤပလက်ဖောင်းတွင်ဂိမ်းမရှိပါ' : language === 'en' ? 'No games on this platform yet' : '该平台暂无游戏'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
