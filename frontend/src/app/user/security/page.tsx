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
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function SecurityPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPayPasswordModal, setShowPayPasswordModal] = useState(false);
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
    twoFactor: false,
    loginAlert: true,
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
    { id: 'password', icon: Lock, title: '登录密码', desc: '定期更换密码可提高账户安全性', status: '已设置', statusColor: 'text-account-success', onClick: () => setShowPasswordModal(true) },
    { id: 'paypassword', icon: Key, title: '支付密码', desc: '用于支付验证', status: '未设置', statusColor: 'text-orange-400', onClick: () => setShowPayPasswordModal(true) },
    { id: 'phone', icon: Smartphone, title: '绑定手机', desc: '用于身份验证和找回密码', status: '未绑定', statusColor: 'text-orange-400', onClick: () => setShowPhoneModal(true) },
    { id: 'email', icon: Mail, title: '绑定邮箱', desc: 'user@example.com', status: '已绑定', statusColor: 'text-account-success', onClick: () => {} },
    { id: 'realname', icon: CreditCard, title: '实名认证', desc: '提升账户可信度', status: '未认证', statusColor: 'text-orange-400', onClick: () => window.location.href = '/user/profile' },
    { id: 'twofactor', icon: Shield, title: '二次验证', desc: '登录时需要额外验证', status: '', statusColor: '', onClick: () => {} },
  ];

  // 安全日志
  const securityLogs = [
    { id: 1, action: '登录', time: '2026-04-21 10:30', ip: '192.168.1.1', device: 'Chrome浏览器' },
    { id: 2, action: '修改密码', time: '2026-04-20 15:20', ip: '192.168.1.1', device: 'Chrome浏览器' },
    { id: 3, action: '登录', time: '2026-04-19 09:15', ip: '10.0.0.1', device: '手机Safari' },
  ];

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">账户安全</h1>

        {/* 安全模块列表 */}
        <div className="bg-account-card rounded-xl overflow-hidden mb-6 border border-account-border">
          {securityModules.map((module, index) => {
            const Icon = module.icon;
            const isLast = index === securityModules.length - 1;
            return (
              <button
                key={module.id}
                onClick={module.onClick}
                className={`w-full flex items-center gap-4 p-5 hover:bg-account-bg transition-colors ${
                  !isLast ? 'border-b border-account-border' : ''
                }`}
              >
                <div className="w-12 h-12 bg-account-primary/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-account-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{module.title}</p>
                  <p className="text-account-secondary text-sm mt-0.5">{module.desc}</p>
                </div>
                {module.status && (
                  <span className={`text-sm ${module.statusColor}`}>{module.status}</span>
                )}
                <ChevronRight className="w-5 h-5 text-account-secondary" />
              </button>
            );
          })}
        </div>

        {/* 安全设置开关 */}
        <div className="bg-account-card rounded-xl p-5 mb-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">安全设置</h3>

          <div className="space-y-4">
            {/* 二次验证 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">二次验证</p>
                <p className="text-account-secondary text-sm">登录时需要额外验证</p>
              </div>
              <button
                onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  securitySettings.twoFactor ? 'bg-account-primary' : 'bg-account-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.twoFactor ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 登录提醒 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">登录提醒</p>
                <p className="text-account-secondary text-sm">新设备登录时发送通知</p>
              </div>
              <button
                onClick={() => setSecuritySettings(prev => ({ ...prev, loginAlert: !prev.loginAlert }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  securitySettings.loginAlert ? 'bg-account-primary' : 'bg-account-border'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    securitySettings.loginAlert ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 安全日志 */}
        <div className="bg-account-card rounded-xl p-5 border border-account-border">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-account-primary" />
            安全日志
          </h3>

          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-account-bg rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-account-primary/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-account-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{log.action}</p>
                    <p className="text-account-secondary text-sm">{log.time} · {log.device}</p>
                  </div>
                </div>
                <p className="text-account-secondary text-sm">{log.ip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 修改登录密码弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-account-card rounded-2xl p-6 w-full max-w-md animate-fade-in border border-account-border">
            <h3 className="text-xl font-bold text-white mb-6">修改登录密码</h3>

            <div className="space-y-4">
              <div>
                <label className="text-account-secondary text-sm block mb-2">旧密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-account-secondary" />
                  <input
                    type={showPassword.old ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full py-3.5 pl-10 pr-10 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                    placeholder="请输入旧密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-account-secondary hover:text-white"
                  >
                    {showPassword.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-account-secondary text-sm block mb-2">新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-account-secondary" />
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full py-3.5 pl-10 pr-10 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                    placeholder="请输入新密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-account-secondary hover:text-white"
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-account-secondary text-sm block mb-2">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-account-secondary" />
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full py-3.5 pl-10 pr-10 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 bg-account-bg text-white rounded-xl hover:bg-account-border transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-3 bg-account-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-account-success' : 'bg-account-danger'
          } text-white animate-slide-in`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}
    </UserLayout>
  );
}
