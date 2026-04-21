'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  Camera,
  User,
  Smartphone,
  Mail,
  CreditCard,
  Check,
  X,
  Save,
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nickname, setNickname] = useState('用户');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [realName, setRealName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'secret'>('secret');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!nickname || nickname.length < 2) {
      showToast('昵称至少2个字符', 'error');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('保存成功！');
    }, 1500);
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">个人信息</h1>

        <div className="bg-account-card rounded-xl p-6 mb-6 border border-account-border">
          {/* 头像 */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-account-border">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-account-primary to-blue-700 flex items-center justify-center overflow-hidden shadow-glow">
                {avatar ? (
                  <img src={avatar} alt="头像" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">{nickname.charAt(0)}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-account-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-white font-medium mb-1">头像</p>
              <p className="text-account-secondary text-sm">点击相机图标上传本地图片</p>
              <p className="text-account-secondary/60 text-xs mt-1">支持 JPG、PNG 格式，建议 200x200</p>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="space-y-5">
            {/* 昵称 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <User className="w-4 h-4 inline mr-1" />
                昵称
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                placeholder="请输入昵称"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">性别</label>
              <div className="flex gap-3">
                {[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'secret', label: '保密' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl cursor-pointer transition-colors ${
                      gender === opt.value
                        ? 'bg-account-primary/20 text-account-primary border border-account-primary'
                        : 'bg-account-bg text-account-secondary border border-account-border hover:border-account-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={opt.value}
                      checked={gender === opt.value}
                      onChange={() => setGender(opt.value as typeof gender)}
                      className="hidden"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* 手机号 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <Smartphone className="w-4 h-4 inline mr-1" />
                手机号
              </label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                  placeholder="请输入手机号"
                />
                <button className="px-5 py-3.5 bg-account-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                  绑定
                </button>
              </div>
            </div>

            {/* 邮箱 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                placeholder="请输入邮箱"
              />
            </div>
          </div>
        </div>

        {/* 实名认证 */}
        <div className="bg-account-card rounded-xl p-6 mb-6 border border-account-border">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-account-primary" />
            实名认证
          </h3>

          <div className="space-y-5">
            {/* 真实姓名 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">真实姓名</label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                placeholder="请输入真实姓名"
              />
            </div>

            {/* 身份证号 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">身份证号</label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                className="w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                placeholder="请输入身份证号"
              />
            </div>

            <p className="text-account-secondary text-sm">
              完成实名认证后可享受更多服务和提升账户安全性
            </p>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                保存修改
              </>
            )}
          </button>
          <button
            onClick={() => window.location.href = '/user'}
            className="px-8 py-4 rounded-xl font-bold bg-account-bg text-white hover:bg-account-border transition-colors"
          >
            取消
          </button>
        </div>
      </div>

      {/* Toast 提示 */}
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
