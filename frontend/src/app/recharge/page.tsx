'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/lib/i18n';
import {
  Smartphone, Globe, CreditCard, ChevronDown, Check, Info,
  Shield, Zap, Headphones, Star, Flame, ArrowRight
} from 'lucide-react';

// Country data
interface Country {
  code: string;
  name: { zh: string; en: string; my: string };
  flag: string;
  phoneCode: string;
  currency: string;
}

const countries: Country[] = [
  { code: 'MM', name: { zh: '缅甸', en: 'Myanmar', my: 'မြန်မာနိုင်ငံ' }, flag: '🇲🇲', phoneCode: '+95', currency: 'MMK' },
  { code: 'CN', name: { zh: '中国', en: 'China', my: 'တရုတ်' }, flag: '🇨🇳', phoneCode: '+86', currency: 'CNY' },
  { code: 'TH', name: { zh: '泰国', en: 'Thailand', my: 'ထိုင်း' }, flag: '🇹🇭', phoneCode: '+66', currency: 'THB' },
  { code: 'VN', name: { zh: '越南', en: 'Vietnam', my: 'ဗီယက်နမ်' }, flag: '🇻🇳', phoneCode: '+84', currency: 'VND' },
  { code: 'US', name: { zh: '美国', en: 'United States', my: 'အမေရိကန်' }, flag: '🇺🇸', phoneCode: '+1', currency: 'USD' },
];

// Operator data
interface Operator {
  id: string;
  name: { zh: string; en: string; my: string };
  logo: string;
  color: string;
}

const operators: Operator[] = [
  { id: 'mpt', name: { zh: 'MPT', en: 'MPT', my: 'MPT' }, logo: '📡', color: 'bg-blue-500' },
  { id: 'ooredoo', name: { zh: 'Ooredoo', en: 'Ooredoo', my: 'Ooredoo' }, logo: '📱', color: 'bg-red-500' },
  { id: 'mytel', name: { zh: 'MyTel', en: 'MyTel', my: 'MyTel' }, logo: '📲', color: 'bg-orange-500' },
  { id: 'telenor', name: { zh: 'Telenor', en: 'Telenor', my: 'Telenor' }, logo: '📶', color: 'bg-yellow-500' },
];

// Recharge amount data
interface Amount {
  value: number;
  mmk: number;
  hot?: boolean;
}

const amounts: Amount[] = [
  { value: 500, mmk: 500, hot: true },
  { value: 1000, mmk: 1000, hot: true },
  { value: 2000, mmk: 2000 },
  { value: 3000, mmk: 3000 },
  { value: 5000, mmk: 5000, hot: true },
  { value: 10000, mmk: 10000 },
  { value: 20000, mmk: 20000 },
  { value: 30000, mmk: 30000 },
  { value: 50000, mmk: 50000, hot: true },
];

// Package data
interface Package {
  id: string;
  name: { zh: string; en: string; my: string };
  value: number;
  mmk: number;
  description: { zh: string; en: string; my: string };
}

const packages: Package[] = [
  { id: 'p1', name: { zh: '流量套餐A', en: 'Data Pack A', my: 'Data Pack A' }, value: 5000, mmk: 5000, description: { zh: '含2GB流量', en: '2GB Data', my: '2GB Data' } },
  { id: 'p2', name: { zh: '流量套餐B', en: 'Data Pack B', my: 'Data Pack B' }, value: 10000, mmk: 10000, description: { zh: '含5GB流量', en: '5GB Data', my: '5GB Data' } },
];

// Payment methods
const paymentMethods = [
  { id: 'wave', name: { zh: 'Wave', en: 'Wave', my: 'Wave' }, icon: '💳' },
  { id: 'kbz', name: { zh: 'KBZ', en: 'KBZ', my: 'KBZ' }, icon: '🏦' },
  { id: 'mopay', name: { zh: 'MoPay', en: 'MoPay', my: 'MoPay' }, icon: '📱' },
  { id: 'usdt', name: { zh: 'USDT', en: 'USDT', my: 'USDT' }, icon: '₿' },
];

export default function RechargePage() {
  const { t, language, currency, formatPrice } = useApp();

  // Form state
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Convert MMK to current currency
  const convertPrice = (mmk: number): string => {
    const rates: Record<string, number> = { USD: 2100, CNY: 290, MMK: 1 };
    const rate = rates[currency] || 1;
    const converted = mmk / rate;
    const symbols: Record<string, string> = { USD: '$', CNY: '¥', MMK: 'K' };
    return `${symbols[currency]}${converted.toFixed(2)}`;
  };

  // Validate phone number
  const validatePhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      setPhoneError(t('recharge.validPhone'));
      return false;
    }
    if (cleanValue.length < 8 || cleanValue.length > 12) {
      setPhoneError(t('recharge.validPhone'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
    if (value) validatePhone(value);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    if (country.code !== 'MM') {
      setShowComingSoon(true);
    } else {
      setShowComingSoon(false);
    }
  };

  const handlePay = () => {
    if (!selectedAmount) return;
    if (!validatePhone(phoneNumber)) return;
    if (!selectedOperator) return;

    setIsProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payment successful! Credit will be added shortly.');
    }, 2000);
  };

  const selectedAmountData = amounts.find(a => a.value === selectedAmount);
  const selectedPackageData = packages.find(p => p.id === selectedPackage);

  const getTotal = () => {
    let total = 0;
    if (selectedAmountData) total += selectedAmountData.mmk;
    if (selectedPackageData) total += selectedPackageData.mmk;
    return total;
  };

  // Steps for guide
  const steps = [
    { num: 1, key: 'recharge.step1' },
    { num: 2, key: 'recharge.step2' },
    { num: 3, key: 'recharge.step3' },
    { num: 4, key: 'recharge.step4' },
    { num: 5, key: 'recharge.step5' },
  ];

  if (showComingSoon) {
    return (
      <div className="min-h-screen flex flex-col bg-recharge">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('recharge.comingSoon')}</h2>
            <p className="text-gray-600 mb-6">
              {language === 'zh' && '我们正在努力开发该国家/地区的话费充值服务，请稍后再试。'}
              {language === 'en' && 'We are working hard to bring mobile recharge service to this country. Please check back later.'}
              {language === 'my' && "ဤနိုင်ငံ/ဒေသအတွက်မိုဘိုင်းဖုန်းငွေဖြည့်သွင်းမှုကိုတည်ဆောက်နေပါသည်"}
            </p>
            <button
              onClick={() => { setShowComingSoon(false); setSelectedCountry(countries[0]); }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              {language === 'zh' ? '返回缅甸充值' : language === 'en' ? 'Back to Myanmar Recharge' : 'မြန်မာငွေဖြည့်သွင်းမှုသို့ပြန်သွားမည်'}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-recharge">
      <Header />

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t('recharge.title')}
              </h1>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Flow */}
            <div className="lg:col-span-2 space-y-6">
              {/* Country Selection */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-500" />
                  {t('recharge.selectCountry')}
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="font-medium">
                        {selectedCountry.name[language]}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors ${
                            selectedCountry.code === country.code ? 'bg-orange-50' : ''
                          }`}
                        >
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium">{country.name[language]}</span>
                          <span className="text-gray-400 text-sm ml-auto">{country.phoneCode}</span>
                          {selectedCountry.code === country.code && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  {t('recharge.phoneNumber')}
                </h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg text-gray-600 font-medium">
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.phoneCode}</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder={language === 'zh' ? '09XXXXXXXX' : '09XXXXXXXX'}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                        phoneError ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        {phoneError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Operator Selection */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  {t('recharge.selectOperator')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {operators.map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOperator(op.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedOperator === op.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className={`w-12 h-12 ${op.color} rounded-xl flex items-center justify-center text-2xl mb-2 mx-auto`}>
                        {op.logo}
                      </div>
                      <p className="font-medium text-center">{op.name[language]}</p>
                      {selectedOperator === op.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  {t('recharge.selectAmount')}
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {amounts.map((amt) => (
                    <button
                      key={amt.value}
                      onClick={() => { setSelectedAmount(amt.value); setSelectedPackage(null); }}
                      className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedAmount === amt.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      {amt.hot && (
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {t('recharge.hot')}
                        </div>
                      )}
                      <p className="text-lg font-bold text-gray-800">{amt.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">MMK</p>
                      <p className="text-sm font-medium text-orange-600 mt-1">
                        {convertPrice(amt.mmk)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Packages */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  {t('recharge.recommendedPackages')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => { setSelectedPackage(pkg.id); setSelectedAmount(null); }}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all hover:scale-102 ${
                        selectedPackage === pkg.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-gray-800">{pkg.name[language]}</p>
                        {selectedPackage === pkg.id && (
                          <Check className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{pkg.description[language]}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-orange-600">{convertPrice(pkg.mmk)}</p>
                        <span className="text-sm text-gray-400">{pkg.value.toLocaleString()} MMK</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* How to Recharge Guide */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-orange-500" />
                  {t('recharge.howToRecharge')}
                </h2>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.num} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {step.num}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="w-0.5 h-8 bg-orange-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-800">{t(step.key)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-800">{t('recharge.securePayment')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('recharge.secureDesc')}</p>
                    </div>
                    <div className="text-center p-3">
                      <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-800">{t('recharge.instantDelivery')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('recharge.instantDesc')}</p>
                    </div>
                    <div className="text-center p-3">
                      <Headphones className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-800">{t('recharge.support24h')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('recharge.supportDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {t('recharge.orderSummary')}
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Country */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{t('recharge.country')}</span>
                    <span className="font-medium flex items-center gap-2">
                      <span>{selectedCountry.flag}</span>
                      {selectedCountry.name[language]}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{t('recharge.phoneNumber')}</span>
                    <span className="font-medium">
                      {selectedCountry.phoneCode} {phoneNumber || '—'}
                    </span>
                  </div>

                  {/* Operator */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{t('recharge.operator')}</span>
                    <span className="font-medium">
                      {selectedOperator ? operators.find(o => o.id === selectedOperator)?.name[language] : '—'}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">{t('recharge.amount')}</span>
                    <span className="font-medium">
                      {selectedAmount ? `${selectedAmount.toLocaleString()} MMK` :
                       selectedPackage ? `${selectedPackageData?.name[language]} (${selectedPackageData?.value.toLocaleString()} MMK)` :
                       '—'}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center py-3 bg-orange-50 rounded-lg px-3 -mx-3">
                    <span className="text-lg font-semibold text-gray-800">{t('recharge.total')}</span>
                    <span className="text-xl font-bold text-orange-600">
                      {convertPrice(getTotal())}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">{t('recharge.paymentMethods')}</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                      >
                        <span>{method.icon}</span>
                        <span className="text-sm font-medium">{method.name[language]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePay}
                  disabled={!selectedAmount && !selectedPackage || !phoneNumber || !selectedOperator || isProcessing}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    !selectedAmount && !selectedPackage || !phoneNumber || !selectedOperator
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : isProcessing
                      ? 'bg-orange-400 text-white cursor-wait'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === 'zh' ? '处理中...' : language === 'en' ? 'Processing...' : 'လုပ်ဆောင်နေသည်...'}
                    </>
                  ) : (
                    <>
                      {t('recharge.payNow')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>{language === 'zh' ? '安全加密保护' : language === 'en' ? 'Secure & Protected' : 'လုံခြုံစွာကာကွယ်ထားသည်'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
