'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/i18n';
import {
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  TrendingUp,
  Clock,
  Globe,
  ChevronRight,
  Star,
} from 'lucide-react';

// Mock exchange rates (USD base)
const exchangeRates: Record<string, { rate: number; change: number }> = {
  USD: { rate: 1, change: 0 },
  CNY: { rate: 7.24, change: 0.02 },
  MMK: { rate: 2100, change: -0.15 },
  THB: { rate: 35.5, change: 0.01 },
  SGD: { rate: 1.34, change: -0.01 },
  HKD: { rate: 7.82, change: 0.005 },
  KRW: { rate: 1320, change: 0.03 },
  JPY: { rate: 149, change: -0.02 },
  EUR: { rate: 0.92, change: 0.008 },
  GBP: { rate: 0.79, change: -0.005 },
};

// Mock historical data
const generateTrendData = (days: number) => {
  const data = [];
  let value = 100;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = value + (Math.random() - 0.5) * 2;
    data.push({ date: date.toLocaleDateString(), value: Math.round(value * 100) / 100 });
  }
  return data;
};

const currencyFlags: Record<string, string> = {
  CNY: '🇨🇳',
  USD: '🇺🇸',
  MMK: '🇲🇲',
  THB: '🇹🇭',
  SGD: '🇸🇬',
  HKD: '🇭🇰',
  KRW: '🇰🇷',
  JPY: '🇯🇵',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
};

const currencyNames: Record<string, { zh: string; en: string; my: string }> = {
  USD: { zh: '美元', en: 'US Dollar', my: 'ဒေါ်လာ' },
  CNY: { zh: '人民币', en: 'Chinese Yuan', my: 'တရုတ်ငွေ' },
  MMK: { zh: '缅币', en: 'Myanmar Kyat', my: 'မြန်မာကျပ်' },
  THB: { zh: '泰铢', en: 'Thai Baht', my: 'ဘတ်' },
  SGD: { zh: '新币', en: 'Singapore Dollar', my: 'စင်ကာပူဒေါ်လာ' },
  HKD: { zh: '港币', en: 'Hong Kong Dollar', my: 'ဟောင်ကော်ဒေါ်လာ' },
  KRW: { zh: '韩元', en: 'Korean Won', my: 'ကိုရီးယားဝမ်း' },
  JPY: { zh: '日元', en: 'Japanese Yen', my: 'ဂျပန်ယန်း' },
  EUR: { zh: '欧元', en: 'Euro', my: 'ယူရို' },
  GBP: { zh: '英镑', en: 'British Pound', my: 'ပေါင်' },
};

export default function ForexPage() {
  const { t, language, currency } = useApp();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('MMK');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [trendData] = useState(() => generateTrendData(30));
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate conversion
  useEffect(() => {
    const amount = parseFloat(fromAmount) || 0;
    const fromRate = exchangeRates[fromCurrency]?.rate || 1;
    const toRate = exchangeRates[toCurrency]?.rate || 1;
    const result = (amount * fromRate) / toRate;
    setToAmount(result.toFixed(2));
  }, [fromCurrency, toCurrency, fromAmount]);

  const getCurrencyName = (code: string) => {
    return currencyNames[code]?.[language] || currencyNames[code]?.zh || code;
  };

  const convert = (amount: number, from: string, to: string) => {
    const fromRate = exchangeRates[from]?.rate || 1;
    const toRate = exchangeRates[to]?.rate || 1;
    return ((amount * fromRate) / toRate).toFixed(4);
  };

  // Max chart height
  const maxValue = Math.max(...trendData.map((d) => d.value));
  const minValue = Math.min(...trendData.map((d) => d.value));
  const chartHeight = 120;
  const getChartPoint = (value: number) => {
    return ((maxValue - value) / (maxValue - minValue)) * chartHeight;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{t('forex.title')}</h1>
          </div>
          <p className="text-green-100 mb-6">{t('forex.subtitle')}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>{t('forex.live')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calculator - Main Feature */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calculator Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-pink-500 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <Calculator className="w-5 h-5" />
                  <h2 className="font-semibold">{t('forex.calculator')}</h2>
                </div>
              </div>
              <div className="p-6">
                {/* From Currency */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">{t('forex.from')}</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <button
                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
                      >
                        <span className="text-2xl">{currencyFlags[fromCurrency]}</span>
                        <span className="font-medium">{fromCurrency}</span>
                        <span className="text-gray-500 text-sm">{getCurrencyName(fromCurrency)}</span>
                      </button>
                      {showFromDropdown && (
                        <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {Object.keys(exchangeRates).map((code) => (
                            <button
                              key={code}
                              onClick={() => { setFromCurrency(code); setShowFromDropdown(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${fromCurrency === code ? 'bg-orange-50' : ''}`}
                            >
                              <span className="text-xl">{currencyFlags[code]}</span>
                              <span className="font-medium">{code}</span>
                              <span className="text-gray-500 text-sm">{getCurrencyName(code)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-medium"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center my-4">
                  <button
                    onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}
                    className="p-3 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>

                {/* To Currency */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">{t('forex.to')}</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <button
                        onClick={() => setShowToDropdown(!showToDropdown)}
                        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
                      >
                        <span className="text-2xl">{currencyFlags[toCurrency]}</span>
                        <span className="font-medium">{toCurrency}</span>
                        <span className="text-gray-500 text-sm">{getCurrencyName(toCurrency)}</span>
                      </button>
                      {showToDropdown && (
                        <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {Object.keys(exchangeRates).map((code) => (
                            <button
                              key={code}
                              onClick={() => { setToCurrency(code); setShowToDropdown(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${toCurrency === code ? 'bg-orange-50' : ''}`}
                            >
                              <span className="text-xl">{currencyFlags[code]}</span>
                              <span className="font-medium">{code}</span>
                              <span className="text-gray-500 text-sm">{getCurrencyName(code)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium text-orange-600">
                      {toAmount} {toCurrency}
                    </div>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{t('forex.rate')}:</span>
                    <span className="font-medium">
                      1 {fromCurrency} = {convert(1, fromCurrency, toCurrency)} {toCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">{t('forex.updateTime')}:</span>
                    <span className="text-gray-500">{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5" />
                    <h2 className="font-semibold">{t('forex.trend')}</h2>
                  </div>
                  <div className="flex gap-2">
                    {['BTC', 'ETH', 'USDT'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCrypto(c)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          selectedCrypto === c ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <svg className="w-full" viewBox={`0 0 600 ${chartHeight + 40}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 ${getChartPoint(trendData[0].value)} ${trendData.map((d, i) => `L ${(i / (trendData.length - 1)) * 600} ${getChartPoint(d.value)}`).join(' ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <path
                    d={`M 0 ${chartHeight} ${getChartPoint(trendData[0].value)} ${trendData.map((d, i) => `L ${(i / (trendData.length - 1)) * 600} ${getChartPoint(d.value)}`).join(' ')} L 600 ${chartHeight} Z`}
                    fill="url(#chartGradient)"
                  />
                </svg>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{trendData[0].date}</span>
                  <span>{trendData[trendData.length - 1].date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Live Rates */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                <h2 className="font-semibold text-white">{t('forex.liveRates')}</h2>
              </div>
              <div className="divide-y">
                {Object.entries(exchangeRates)
                  .filter(([code]) => code !== 'USD')
                  .slice(0, 8)
                  .map(([code, data]) => (
                    <div key={code} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currencyFlags[code]}</span>
                        <div>
                          <div className="font-medium text-sm">{code}</div>
                          <div className="text-xs text-gray-500">{getCurrencyName(code)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{data.rate.toFixed(2)}</div>
                        <div className={`text-xs flex items-center justify-end gap-1 ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(data.change).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <button className="w-full py-3 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-1">
                {t('forex.viewAll')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Convert */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{t('forex.quickConvert')}</h3>
              <div className="space-y-3">
                {[
                  { from: 'USD', to: 'CNY', amount: 100 },
                  { from: 'USD', to: 'MMK', amount: 100 },
                  { from: 'CNY', to: 'MMK', amount: 1000 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium">{item.amount}</span> {item.from}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <div className="text-sm font-medium text-orange-600">
                      {convert(item.amount, item.from, item.to)} {item.to}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div className="bg-gradient-to-br from-orange-600 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5" />
                <h3 className="font-semibold">{t('forex.featured')}</h3>
              </div>
              <p className="text-orange-100 text-sm mb-4">{t('forex.featuredDesc')}</p>
              <button className="w-full py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                {t('forex.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
