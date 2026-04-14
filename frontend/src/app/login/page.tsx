'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = language === 'zh' ? '请输入邮箱地址' : language === 'my' ? 'အီးမေးလ်လိပ်စာထည့်ပါ' : 'Please enter email';
    } else if (!validateEmail(email)) {
      newErrors.email = language === 'zh' ? '请输入有效的邮箱地址' : language === 'my' ? 'မှန်ကန်သောအီးမေးလ်ထည့်ပါ' : 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = language === 'zh' ? '请输入密码' : language === 'my' ? 'စကားဝှက်ထည့်ပါ' : 'Please enter password';
    } else if (password.length < 6) {
      newErrors.password = language === 'zh' ? '密码至少6个字符' : language === 'my' ? 'စကားဝှက်အနည်းဆုံး၆လုံး' : 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate login request
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo: accept any valid email/password
    if (validateEmail(email) && password.length >= 6) {
      router.push('/');
    } else {
      setError(language === 'zh' ? '邮箱或密码错误' : language === 'my' ? 'အီးမေးလ်သို့မဟုတ်စကားဝှက်မှားယွင်း' : 'Email or password incorrect');
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Google OAuth logic would go here
    alert(language === 'zh' ? '谷歌登录功能开发中...' : language === 'my' ? 'Google ဝင်ရောက်မှုဖွံ့်စို့တွင်...' : 'Google login coming soon...');
  };

  const handleTelegramLogin = () => {
    // Telegram OAuth logic would go here
    alert(language === 'zh' ? 'Telegram登录功能开发中...' : language === 'my' ? 'Telegram ဝင်ရောက်မှုဖွံ့စို့တွင်...' : 'Telegram login coming soon...');
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
            {language === 'zh' ? '欢迎来到无忧服务商城' : language === 'my' ? 'ဝမ်းရွှေ့ဝန်ဆောင်မှုမှတ်တိုးသို့ကြိုဆို' : 'Welcome to Worry-Free Service Mall'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'zh' ? '登录您的无忧服务账户' : language === 'my' ? 'သင်၏ဝမ်းရွှေ့ဝန်ဆောင်မှုအကောင့်ဝင်ပါ' : 'Log in to your Worry-Free Service account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder={language === 'zh' ? '请输入邮箱' : language === 'my' ? 'အီးမေးလ်ထည့်ပါ' : 'Please enter email'}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 animate-shake">{errors.email}</p>
              )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder={language === 'zh' ? '请输入密码' : language === 'my' ? 'စကားဝှက်ထည့်ပါ' : 'Please enter password'}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 animate-shake">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 transition-colors" />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-orange-600 transition-colors">
                  {language === 'zh' ? '记住我' : language === 'my' ? 'အသုံးပြုသူကိုမှတ်မိ' : 'Remember me'}
                </span>
              </label>
              <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                {language === 'zh' ? '忘记密码？' : language === 'my' ? 'စကားဝှက်မေ့နေပါ' : 'Forgot password?'}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-pink-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading
                ? (language === 'zh' ? '登录中...' : language === 'my' ? '၀င်ရောက်နေသည်...' : 'Logging in...')
                : (language === 'zh' ? '登录' : language === 'my' ? '၀င်ရောက်မည်' : 'Login')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                {language === 'zh' ? '或' : language === 'my' ? 'သို့မဟုတ်' : 'or'}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {language === 'zh' ? '谷歌登录' : language === 'my' ? 'Google ဝင်ရောက်' : 'Google'}
              </span>
            </button>
            <button
              onClick={handleTelegramLogin}
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0088cc">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {language === 'zh' ? 'Telegram登录' : language === 'my' ? 'Telegram ဝင်ရောက်' : 'Telegram'}
              </span>
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {language === 'zh' ? '还没有账户？' : language === 'my' ? 'အကောင့်မရှိသေးပါသလား?' : 'Don\'t have an account?'}
            <Link href="/register" className="text-orange-600 hover:text-orange-700 hover:underline font-medium ml-1 transition-colors">
              {language === 'zh' ? '立即注册' : language === 'my' ? 'မှတ်ပုံတင်မည်' : 'Register now'}
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
