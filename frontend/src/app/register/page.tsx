'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Smartphone, Check, X, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/i18n';

// Country codes data
const countryCodes = [
  { code: '+86', country: '🇨🇳', name: { zh: '中国', my: 'တရုတ်', en: 'China' } },
  { code: '+95', country: '🇲🇲', name: { zh: '缅甸', my: 'မြန်မာ', en: 'Myanmar' } },
  { code: '+1', country: '🇺🇸', name: { zh: '美国', my: 'အမေရိကန်', en: 'USA' } },
  { code: '+44', country: '🇬🇧', name: { zh: '英国', my: 'ဗြိတိသျှ', en: 'UK' } },
  { code: '+81', country: '🇯🇵', name: { zh: '日本', my: 'ဂျပန်', en: 'Japan' } },
  { code: '+82', country: '🇰🇷', name: { zh: '韩国', my: 'ကိုရီးယား', en: 'South Korea' } },
  { code: '+66', country: '🇹🇭', name: { zh: '泰国', my: 'ထိုင်း', en: 'Thailand' } },
  { code: '+65', country: '🇸🇬', name: { zh: '新加坡', my: 'စင်ကာပူ', en: 'Singapore' } },
  { code: '+60', country: '🇲🇾', name: { zh: '马来西亚', my: 'မလေးရှား', en: 'Malaysia' } },
  { code: '+84', country: '🇻🇳', name: { zh: '越南', my: 'ဗီယက်နမ်', en: 'Vietnam' } },
  { code: '+855', country: '🇰🇭', name: { zh: '柬埔寨', my: 'ကမ္ဘောဒီးယား', en: 'Cambodia' } },
  { code: '+856', country: '🇱🇦', name: { zh: '老挝', my: 'လာအို', en: 'Laos' } },
];

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Feature flags
  const [features, setFeatures] = useState({ otpLogin: false, googleLogin: false, telegramLogin: false });

  useEffect(() => {
    fetch('/api/auth/feature-flags')
      .then(r => r.json())
      .then(d => {
        if (d.success) setFeatures(d.data);
      })
      .catch(() => {});
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const passwordRequirements = [
    { label: { zh: '至少6个字符', my: 'အနည်းဆုံး၆လုံး', en: 'At least 6 characters' }, test: (p: string) => p.length >= 6 },
    { label: { zh: '包含数字', my: 'ဂဏန်းပါ', en: 'Contains numbers' }, test: (p: string) => /\d/.test(p) },
    { label: { zh: '包含字母', my: 'စာလုံးပါ', en: 'Contains letters' }, test: (p: string) => /[a-zA-Z]/.test(p) },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const errorLang = (zh: string, my: string, en: string) => language === 'zh' ? zh : language === 'my' ? my : en;

    if (!username || username.length < 2) {
      newErrors.username = errorLang('用户名至少2个字符', 'အသုံးပြုသူအနည်းဆုံး၂လုံး', 'Username at least 2 characters');
    }

    if (!email) {
      newErrors.email = errorLang('请输入邮箱地址', 'အီးမေးလ်လိပ်စာထည့်ပါ', 'Please enter email');
    } else if (!validateEmail(email)) {
      newErrors.email = errorLang('请输入有效的邮箱地址', 'မှန်ကန်သောအီးမေးလ်ထည့်ပါ', 'Please enter a valid email');
    }

    if (!phone) {
      newErrors.phone = errorLang('请输入手机号', 'ဖုန်းနံပါတ်ထည့်ပါ', 'Please enter phone number');
    }

    if (!password) {
      newErrors.password = errorLang('请输入密码', 'စကားဝှက်ထည့်ပါ', 'Please enter password');
    } else if (!passwordRequirements.every(r => r.test(password))) {
      newErrors.password = errorLang('密码不符合要求', 'စကားဝှက်မှန်ကန်မှုမရှိ', 'Password does not meet requirements');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = errorLang('两次输入的密码不一致', 'စကားဝှက်၂ကြိမ်မတူညီ', 'Passwords do not match');
    }

    if (!agreeTerms) {
      newErrors.terms = errorLang('请阅读并同意服务条款', 'ဝန်ဆောင်မှုစည်းမျဉ်းများဖတ်ပါ', 'Please agree to terms');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          phone: `${countryCode}${phone}`,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '注册失败');
      }

      // 保存token并跳转
      if (data.data?.token) {
        localStorage.setItem('user_token', data.data.token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        router.push('/user');
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth登录
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/google/authorize');
      const data = await response.json();
      if (data.success) {
        window.location.href = data.data.authorizeUrl;
      } else {
        setError(data.message || 'Google登录暂不可用');
      }
    } catch {
      setError('Google登录暂不可用');
    }
  };

  // Telegram验证码登录
  const handleTelegramLogin = async () => {
    try {
      const response = await fetch('/api/auth/telegram/init', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        // 打开Telegram Bot
        window.open(data.data.botStartUrl, '_blank');
        // 跳转到登录页面，使用Telegram验证码模式
        router.push(`/login?mode=otp&channel=telegram&token=${encodeURIComponent(data.data.requestToken)}`);
      } else {
        setError(data.message || 'Telegram登录暂不可用');
      }
    } catch {
      setError('Telegram登录暂不可用');
    }
  };

  const isPasswordValid = (req: { test: (p: string) => boolean }) => req.test(password);

  const getCountryDisplay = () => {
    const country = countryCodes.find(c => c.code === countryCode);
    return country ? `${country.code} ${country.country}` : countryCode;
  };

  const getCountryName = (country: typeof countryCodes[0]) => {
    return country.name[language] || country.name.zh;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold text-2xl">无</span>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            {language === 'zh' ? '创建账户' : language === 'my' ? 'အကောင့်ဖန်တီးမည်' : 'Create Account'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'zh' ? '加入无忧服务，开始您的充值之旅' : language === 'my' ? 'ဝမ်းရွှေ့ဝန်ဆောင်မှုသို့ဝင်ပါ' : 'Join Worry-Free Service, begin your journey'}
          </p>
        </div>

        {/* Social Quick Login */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <p className="text-center text-sm text-gray-500 mb-4">
            {language === 'zh' ? '快捷注册/登录' : language === 'my' ? 'မြန်ဆန်စွာ အကောင့်ဖန်တီး/ဝင်ရောက်ပါ' : 'Quick Register/Login'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {features.googleLogin && (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
            )}
            {features.telegramLogin && (
              <button
                onClick={handleTelegramLogin}
                className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Telegram</span>
              </button>
            )}
          </div>
        </div>

        {/* Password Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '用户名' : language === 'my' ? 'အသုံးပြုသူအမည်' : 'Username'}
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: '' }); }}
                  placeholder={language === 'zh' ? '请输入用户名' : language === 'my' ? 'အသုံးပြုသူအမည်ထည့်ပါ' : 'Please enter username'}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${errors.username ? 'border-red-300' : 'border-gray-200 hover:border-orange-300'}`}
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '邮箱地址' : language === 'my' ? 'အီးမေးလ်လိပ်စာ' : 'Email'}
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                  placeholder={language === 'zh' ? '请输入邮箱' : language === 'my' ? 'အီးမေးလ်ထည့်ပါ' : 'Please enter email'}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${errors.email ? 'border-red-300' : 'border-gray-200 hover:border-orange-300'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '手机号' : language === 'my' ? 'ဖုန်းနံပါတ်' : 'Phone'}
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCodeDropdown(!showCodeDropdown)}
                    className="flex items-center gap-2 px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors min-w-[100px]"
                  >
                    <span className="text-lg">{countryCodes.find(c => c.code === countryCode)?.country}</span>
                    <span className="text-sm font-medium">{countryCode}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCodeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showCodeDropdown && (
                    <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto w-48">
                      {countryCodes.map((country) => (
                        <button
                          key={`${country.code}-${country.country}`}
                          type="button"
                          onClick={() => { setCountryCode(country.code); setShowCodeDropdown(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-50 transition-colors ${countryCode === country.code ? 'bg-orange-50 text-orange-600' : ''}`}
                        >
                          <span className="text-lg">{country.country}</span>
                          <span className="text-sm font-medium">{country.code}</span>
                          <span className="text-xs text-gray-500 ml-auto">{getCountryName(country)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative flex-1 group">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                    placeholder={language === 'zh' ? '请输入手机号' : language === 'my' ? 'ဖုန်းနံပါတ်ထည့်ပါ' : 'Please enter phone'}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${errors.phone ? 'border-red-300' : 'border-gray-200 hover:border-orange-300'}`}
                  />
                </div>
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '密码' : language === 'my' ? 'စကားဝှက်' : 'Password'}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                  placeholder={language === 'zh' ? '请输入密码' : language === 'my' ? 'စကားဝှက်ထည့်ပါ' : 'Please enter password'}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${errors.password ? 'border-red-300' : 'border-gray-200 hover:border-orange-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

              {password && (
                <div className="mt-3 space-y-1.5 p-3 bg-gray-50 rounded-xl">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {isPasswordValid(req) ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-300" />}
                      <span className={isPasswordValid(req) ? 'text-green-600' : 'text-gray-400'}>
                        {req.label[language] || req.label.zh}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh' ? '确认密码' : language === 'my' ? 'စကားဝှက်အတည်ပြု' : 'Confirm Password'}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }}
                  placeholder={language === 'zh' ? '请再次输入密码' : language === 'my' ? 'စကားဝှက်ပြန်လည်ထည့်ပါ' : 'Please confirm password'}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200 hover:border-orange-300'}`}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => { setAgreeTerms(e.target.checked); if (errors.terms) setErrors({ ...errors, terms: '' }); }}
                  className="w-4 h-4 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500 transition-colors"
                />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  {language === 'zh' ? '我已阅读并同意' : language === 'my' ? 'ဝန်ဆောင်မှုစည်းမျဉ်းများဖတ်ပြီးသဘောတူ' : 'I have read and agree to'}
                  <Link href="/terms" className="text-orange-600 hover:underline ml-1">
                    {language === 'zh' ? '服务条款' : language === 'my' ? 'ဝန်ဆောင်မှုစည်းမျဉ်း' : 'Terms'}
                  </Link>
                  {language === 'zh' ? '和' : language === 'my' ? 'နှင့်' : 'and'}
                  <Link href="/privacy" className="text-orange-600 hover:underline ml-1">
                    {language === 'zh' ? '隐私政策' : language === 'my' ? 'ကိုယ်ရေးလုံခြုံမှုမူဝါဒ' : 'Privacy Policy'}
                  </Link>
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-pink-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading
                ? (language === 'zh' ? '注册中...' : language === 'my' ? 'မှတ်ပုံတင်နေသည်...' : 'Registering...')
                : (language === 'zh' ? '注册' : language === 'my' ? 'မှတ်ပုံတင်မည်' : 'Register')}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {language === 'zh' ? '已有账户？' : language === 'my' ? 'အကောင့်ရှိပြီသလား?' : 'Already have an account?'}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 hover:underline font-medium ml-1 transition-colors">
              {language === 'zh' ? '立即登录' : language === 'my' ? '၀င်ရောက်မည်' : 'Login now'}
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
            <span>←</span>
            <span>{language === 'zh' ? '返回首页' : language === 'my' ? 'ပင်မသို့ပြန်သွားမည်' : 'Back to home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
