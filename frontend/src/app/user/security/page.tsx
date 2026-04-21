'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  Lock,
  Smartphone,
  Mail,
  Shield,
  CreditCard,
  Key,
  Check,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  LogOut,
  AlertTriangle
} from 'lucide-react';

export default function SecurityPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: ''
  });

  // 安全设置开关状态
  const [securitySettings, setSecuritySettings] = useState({
    loginProtection: true,
    paymentProtection: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleChangePassword = () => {
    if (!passwordForm.oldPassword) {
      showToast('请输入旧密码', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('新密码至少6位', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('两次密码不一致', 'error');
      return;
    }
    setShowPasswordModal(false);
    showToast('密码修改成功');
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleBindPhone = () => {
    if (!phoneForm.phone) {
      showToast('请输入手机号', 'error');
      return;
    }
    if (!phoneForm.code) {
      showToast('请输入验证码', 'error');
      return;
    }
    setShowPhoneModal(false);
    showToast('手机绑定成功');
    setPhoneForm({ phone: '', code: '' });
  };

  // 安全模块数据
  const securityModules = [
    { id: 'password', icon: Lock, title: '登录密码', desc: '定期更换密码可提高账户安全性', status: '已设置', statusColor: 'text-green-500', onClick: () => setShowPasswordModal(true) },
    { id: 'phone', icon: Smartphone, title: '绑定手机', desc: '用于身份验证和找回密码', status: '未绑定', statusColor: 'text-orange-500', onClick: () => setShowPhoneModal(true) },
    { id: 'email', icon: Mail, title: '绑定邮箱', desc: 'huaxiashanghui@gmail.com', status: '已绑定', statusColor: 'text-green-500', onClick: () => {} },
    { id: 'realname', icon: CreditCard, title: '实名认证', desc: '提升账户可信度', status: '未认证', statusColor: 'text-orange-500', onClick: () => window.location.href = '/user/profile' },
    { id: 'thirdparty', icon: Shield, title: '第三方绑定', desc: '微信、Google账号', status: '已绑定Google', statusColor: 'text-green-500', onClick: () => {} },
    { id: 'security', icon: Key, title: '安全设置', desc: '登录保护、支付保护', status: '', statusColor: '', onClick: () => {} },
  ];

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">账户安全</h1>

        {/* 安全模块列表 */}
        <div className="bg-[#252525] rounded-xl overflow-hidden mb-6">
          {securityModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={module.onClick}
                className={`w-full flex items-center gap-4 p-4 hover:bg-[#2a2a2a] transition-colors ${
                  index !== securityModules.length - 1 ? 'border-b border-[#333]' : ''
                }`}
              >
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{module.title}</p>
                  <p className="text-[#888] text-sm mt-0.5">{module.desc}</p>
                </div>
                {module.status && (
                  <span className={`text-sm ${module.statusColor}`}>{module.status}</span>
                )}
                <ChevronRight className="w-5 h-5 text-[#666]" />
              </button>
            );
          })}
        </div>

        {/* 安全设置开关 */}
        <div className="bg-[#252525] rounded-xl p-4 mb-6">
          <h3 className="text-white font-bold mb-4">安全设置</h3>

          <div className="space-y-4">
            {/* 登录保护 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">登录保护</p>
                <p className="text-[#888] text-sm">在新设备登录时需要验证</p>
              </div>
              <button
                onClick={() => setSecuritySettings(prev => ({ ...prev, loginProtection: !prev.loginProtection }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  securitySettings.loginProtection ? 'bg-orange-500' : 'bg-[#444]'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.loginProtection ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 支付保护 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">支付保护</p>
                <p className="text-[#888] text-sm">支付时需要输入支付密码</p>
              </div>
              <button
                onClick={() => setSecuritySettings(prev => ({ ...prev, paymentProtection: !prev.paymentProtection }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  securitySettings.paymentProtection ? 'bg-orange-500' : 'bg-[#444]'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.paymentProtection ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 账号注销 */}
        <div className="bg-[#252525] rounded-xl p-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between text-red-400 hover:text-red-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">账号注销</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252525] rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6">修改登录密码</h3>

            <div className="space-y-4">
              <div>
                <label className="text-[#ccc] text-sm block mb-2">旧密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                  <input
                    type={showPassword.old ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full py-3 pl-10 pr-10 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请输入旧密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                  >
                    {showPassword.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#ccc] text-sm block mb-2">新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full py-3 pl-10 pr-10 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请输入新密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#ccc] text-sm block mb-2">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full py-3 pl-10 pr-10 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请再次输入新密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                  >
                    {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 bg-[#333] text-white rounded-xl hover:bg-[#444] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 绑定手机弹窗 */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252525] rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-6">绑定手机号</h3>

            <div className="space-y-4">
              <div>
                <label className="text-[#ccc] text-sm block mb-2">手机号</label>
                <input
                  type="tel"
                  value={phoneForm.phone}
                  onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                  className="w-full py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="请输入手机号"
                />
              </div>

              <div>
                <label className="text-[#ccc] text-sm block mb-2">验证码</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={phoneForm.code}
                    onChange={(e) => setPhoneForm({ ...phoneForm, code: e.target.value })}
                    className="flex-1 py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="请输入验证码"
                  />
                  <button className="px-4 py-3 bg-orange-500/20 text-orange-500 rounded-lg hover:bg-orange-500/30 transition-colors font-medium text-sm">
                    获取验证码
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 py-3 bg-[#333] text-white rounded-xl hover:bg-[#444] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleBindPhone}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                绑定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 注销账号确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#252525] rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">确认注销账号</h3>
              <p className="text-[#ccc] text-sm">注销后无法恢复，所有数据将被永久删除</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-[#333] text-white rounded-xl hover:bg-[#444] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  showToast('账号已注销', 'success');
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}

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
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </UserLayout>
  );
}
