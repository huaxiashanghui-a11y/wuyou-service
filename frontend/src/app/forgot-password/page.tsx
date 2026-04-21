'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [account, setAccount] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const sendCode = () => {
    if (!account) {
      showToast('请输入账号', 'error');
      return;
    }
    if (method === 'phone' && !/^1[3-9]\d{9}$/.test(account)) {
      showToast('请输入正确的手机号', 'error');
      return;
    }
    if (method === 'email' && !/\S+@\S+\.\S+/.test(account)) {
      showToast('请输入正确的邮箱', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCountdown(60);
      showToast('验证码已发送');
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const verifyCode = () => {
    if (!code || code.length !== 6) {
      showToast('请输入6位验证码', 'error');
      return;
    }
    setStep(2);
  };

  const resetPassword = () => {
    if (newPassword.length < 6) {
      showToast('密码至少6位', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('两次密码不一致', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <Link href="/login" className="inline-flex items-center gap-2 text-[#ccc] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>返回登录</span>
        </Link>

        <div className="bg-[#252525] rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white text-center mb-2">找回密码</h1>
          <p className="text-[#888] text-center mb-8">通过{method === 'phone' ? '手机号' : '邮箱'}验证身份</p>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            {['验证身份', '设置密码', '完成'].map((label, index) => {
              const stepNum = index + 1;
              const isActive = step >= stepNum;
              return (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isActive ? 'bg-orange-500 text-white' : 'bg-[#333] text-[#666]'
                      }`}
                    >
                      {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'text-orange-500' : 'text-[#666]'}`}>
                      {label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-2 ${step > stepNum ? 'bg-orange-500' : 'bg-[#333]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* 步骤1: 验证身份 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* 验证方式切换 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => { setMethod('phone'); setAccount(''); setCode(''); }}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    method === 'phone'
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#333] text-[#ccc] hover:bg-[#444]'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  手机验证
                </button>
                <button
                  onClick={() => { setMethod('email'); setAccount(''); setCode(''); }}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    method === 'email'
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#333] text-[#ccc] hover:bg-[#444]'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  邮箱验证
                </button>
              </div>

              {/* 账号输入 */}
              <div>
                <label className="text-[#ccc] text-sm block mb-2">
                  {method === 'phone' ? '手机号' : '邮箱'}
                </label>
                <input
                  type={method === 'phone' ? 'tel' : 'email'}
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full py-3 px-4 bg-[#333] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={method === 'phone' ? '请输入手机号' : '请输入邮箱地址'}
                />
              </div>

              {/* 验证码输入 */}
              <div>
                <label className="text-[#ccc] text-sm block mb-2">验证码</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="flex-1 py-3 px-4 bg-[#333] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请输入验证码"
                  />
                  <button
                    onClick={sendCode}
                    disabled={countdown > 0 || loading}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      countdown > 0
                        ? 'bg-[#444] text-[#666] cursor-not-allowed'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {loading ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
              </div>

              <button
                onClick={verifyCode}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-colors mt-4"
              >
                下一步
              </button>
            </div>
          )}

          {/* 步骤2: 设置新密码 */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#1e1e1e] rounded-xl p-4 mb-4">
                <p className="text-[#ccc] text-sm">验证方式</p>
                <p className="text-white font-medium">
                  {method === 'phone' ? '📱 ' : '✉️ '}{account}
                </p>
              </div>

              <div>
                <label className="text-[#ccc] text-sm block mb-2">新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-10 bg-[#333] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请输入新密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[#666] text-xs mt-2">密码至少6位，建议包含字母和数字</p>
              </div>

              <div>
                <label className="text-[#ccc] text-sm block mb-2">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-10 bg-[#333] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-colors mt-4"
              >
                {loading ? '重置中...' : '重置密码'}
              </button>
            </div>
          )}

          {/* 步骤3: 完成 */}
          {step === 3 && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">密码重置成功</h3>
              <p className="text-[#ccc] mb-8">请使用新密码登录您的账号</p>

              <button
                onClick={() => router.push('/login')}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                返回登录
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-slide-in`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
