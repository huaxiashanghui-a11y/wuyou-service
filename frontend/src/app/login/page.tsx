'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Smartphone, MessageCircle } from 'lucide-react';
import axios from 'axios';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Login mode: 'password' or 'otp'
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');

  // Password login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP login state
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email' | 'telegram'>('email');
  const [otpDestination, setOtpDestination] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSending, setOtpSending] = useState(false);

  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Feature flags
  const [features, setFeatures] = useState({ otpLogin: false, googleLogin: false, telegramLogin: false });

  // Load feature flags
  useEffect(() => {
    fetch('/api/auth/feature-flags')
      .then(r => r.json())
      .then(d => {
        if (d.success) setFeatures(d.data);
      })
      .catch(() => {});
  }, []);

  // Handle Google callback params
  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    if (token && userId) {
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_info', JSON.stringify({ id: parseInt(userId) }));
      router.push('/user');
      return;
    }
    const errorMsg = searchParams.get('error');
    if (errorMsg) {
      switch (errorMsg) {
        case 'google_disabled': setError('Google登录功能暂未开放'); break;
        case 'no_code': setError('Google授权失败，请重试'); break;
        case 'google_token': setError('Google Token获取失败'); break;
        case 'google_verify': setError('Google身份验证失败'); break;
        case 'google_error': setError('Google登录异常，请重试'); break;
        case 'user_not_found': setError('用户不存在'); break;
      }
    }
  }, [searchParams, router]);

  // OTP countdown
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Password login validation
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    if (!username) newErrors.username = '请输入用户名';
    if (!password) newErrors.password = '请输入密码';
    else if (password.length < 6) newErrors.password = '密码至少6个字符';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // OTP login validation
  const validateOtpForm = () => {
    const newErrors: Record<string, string> = {};
    if (!otpDestination) {
      newErrors.otpDestination = otpChannel === 'email' ? '请输入邮箱' : otpChannel === 'sms' ? '请输入手机号' : '请先完成Telegram绑定';
    }
    if (!otpCode) newErrors.otpCode = '请输入验证码';
    else if (!/^\d{6}$/.test(otpCode)) newErrors.otpCode = '验证码为6位数字';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validatePasswordForm()) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('user_token', response.data.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.data.user));
        router.push('/user');
      } else {
        setError(response.data.message || '登录失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '网络错误，请稍后重试');
    }
    setLoading(false);
  };

  // Handle OTP send
  const handleSendOtp = async () => {
    setError('');
    if (!otpDestination) {
      setErrors({ otpDestination: '请先输入' + (otpChannel === 'email' ? '邮箱' : otpChannel === 'sms' ? '手机号' : 'Telegram绑定码') });
      return;
    }
    setOtpSending(true);

    try {
      const response = await axios.post('/api/auth/otp/send', {
        channel: otpChannel,
        destination: otpDestination,
      });

      if (response.data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
      } else {
        setError(response.data.message || '发送失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '发送失败，请稍后重试');
    }
    setOtpSending(false);
  };

  // Handle OTP login
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateOtpForm()) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/otp/verify', {
        channel: otpChannel,
        destination: otpDestination,
        code: otpCode,
      });

      if (response.data.success) {
        localStorage.setItem('user_token', response.data.data.token);
        localStorage.setItem('user_info', JSON.stringify(response.data.data.user));
        router.push('/user');
      } else {
        setError(response.data.message || '验证失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '验证失败，请稍后重试');
    }
    setLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('/api/auth/google/authorize');
      if (response.data.success) {
        window.location.href = response.data.data.authorizeUrl;
      } else {
        setError(response.data.message || 'Google登录暂不可用');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google登录暂不可用');
    }
  };

  // Handle Telegram login
  const handleTelegramLogin = async () => {
    try {
      const response = await axios.post('/api/auth/telegram/init');
      if (response.data.success) {
        const { botStartUrl, requestToken } = response.data.data;
        window.open(botStartUrl, '_blank');
        // Auto switch to OTP login with telegram mode
        setLoginMode('otp');
        setOtpChannel('telegram');
        setOtpDestination(requestToken);
      } else {
        setError(response.data.message || 'Telegram登录暂不可用');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Telegram登录暂不可用');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">无</span>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">欢迎来到无忧服务商城</h1>
          <p className="mt-2 text-gray-600">登录您的无忧服务账户</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Mode Tabs */}
          {features.otpLogin && (
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => { setLoginMode('password'); setError(''); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  loginMode === 'password'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                账号密码登录
              </button>
              <button
                onClick={() => { setLoginMode('otp'); setError(''); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  loginMode === 'otp'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                验证码登录
              </button>
            </div>
          )}

          {/* Password Login Form */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: '' }); }}
                    placeholder="请输入用户名"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.username ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                    placeholder="请输入密码"
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors p-1">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-pink-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          )}

          {/* OTP Login Form */}
          {loginMode === 'otp' && (
            <form onSubmit={handleOtpLogin} className="space-y-5">
              {/* Channel Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">验证方式</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpChannel('email'); setOtpDestination(''); setOtpSent(false); setErrors({}); }}
                    className={`flex-1 py-2.5 px-3 text-sm rounded-xl border transition-all ${
                      otpChannel === 'email'
                        ? 'border-orange-500 bg-orange-50 text-orange-600 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-1" /> 邮箱
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpChannel('sms'); setOtpDestination(''); setOtpSent(false); setErrors({}); }}
                    className={`flex-1 py-2.5 px-3 text-sm rounded-xl border transition-all ${
                      otpChannel === 'sms'
                        ? 'border-orange-500 bg-orange-50 text-orange-600 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 inline mr-1" /> 短信
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpChannel('telegram'); setOtpDestination(''); setOtpSent(false); setErrors({}); }}
                    className={`flex-1 py-2.5 px-3 text-sm rounded-xl border transition-all ${
                      otpChannel === 'telegram'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 inline mr-1" /> Telegram
                  </button>
                </div>
              </div>

              {/* Destination Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {otpChannel === 'email' ? '邮箱地址' : otpChannel === 'sms' ? '手机号码' : 'Request Token'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    {otpChannel === 'email' && <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    {otpChannel === 'sms' && <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    {otpChannel === 'telegram' && <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
                    <input
                      type={otpChannel === 'email' ? 'email' : 'text'}
                      value={otpDestination}
                      onChange={(e) => { setOtpDestination(e.target.value); if (errors.otpDestination) setErrors({ ...errors, otpDestination: '' }); }}
                      placeholder={
                        otpChannel === 'email' ? '请输入邮箱地址' :
                        otpChannel === 'sms' ? '请输入手机号 (如 09xxxxxxxx)' :
                        '点击下方按钮获取'
                      }
                      readOnly={otpChannel === 'telegram'}
                      className={`w-full pl-10 pr-24 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                        errors.otpDestination ? 'border-red-300' : 'border-gray-200'
                      } ${otpChannel === 'telegram' ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    />
                    {otpChannel !== 'telegram' && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpSending || otpCountdown > 0}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {otpCountdown > 0 ? `${otpCountdown}s` : otpSending ? '发送中...' : '获取验证码'}
                      </button>
                    )}
                  </div>
                </div>
                {errors.otpDestination && <p className="mt-1 text-sm text-red-500">{errors.otpDestination}</p>}

                {/* Telegram bind button */}
                {otpChannel === 'telegram' && (
                  <button
                    type="button"
                    onClick={handleTelegramLogin}
                    className="mt-2 w-full py-2.5 px-4 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    点击绑定Telegram Bot
                  </button>
                )}
              </div>

              {/* OTP Code Input */}
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); if (errors.otpCode) setErrors({ ...errors, otpCode: '' }); }}
                      placeholder="请输入6位验证码"
                      maxLength={6}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg tracking-widest ${
                        errors.otpCode ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.otpCode && <p className="mt-1 text-sm text-red-500">{errors.otpCode}</p>}
                </div>
              )}

              {/* Submit OTP */}
              {otpSent && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-pink-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? '验证中...' : '登录'}
                </button>
              )}
            </form>
          )}

          {/* Social Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">或</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {features.googleLogin && (
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google登录</span>
              </button>
            )}

            {features.telegramLogin && (
              <button
                onClick={handleTelegramLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Telegram登录</span>
              </button>
            )}
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            还没有账户？
            <Link href="/register" className="text-orange-600 hover:text-orange-700 hover:underline font-medium ml-1">
              立即注册
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
