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
  Save
} from 'lucide-react';

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nickname, setNickname] = useState('无忧用户');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('huaxiashanghui@gmail.com');
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
        <h1 className="text-2xl font-bold text-white mb-6">个人资料</h1>

        <div className="bg-[#252525] rounded-xl p-6 mb-6">
          {/* 头像 */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#333]">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="头像" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">优</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
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
              <p className="text-[#888] text-sm">点击相机图标上传本地图片</p>
              <p className="text-[#666] text-xs mt-1">支持 JPG、PNG 格式，建议 200x200</p>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="space-y-4">
            {/* 昵称 */}
            <div>
              <label className="text-[#ccc] text-sm block mb-2">
                <User className="w-4 h-4 inline mr-1" />
                昵称
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入昵称"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="text-[#ccc] text-sm block mb-2">性别</label>
              <div className="flex gap-4">
                {[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'secret', label: '保密' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      gender === opt.value
                        ? 'bg-orange-500/20 text-orange-500'
                        : 'bg-[#333] text-[#ccc] hover:bg-[#3a3a3a]'
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
              <label className="text-[#ccc] text-sm block mb-2">
                <Smartphone className="w-4 h-4 inline mr-1" />
                手机号
              </label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="请输入手机号"
                />
                <button className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm">
                  绑定
                </button>
              </div>
            </div>

            {/* 邮箱 */}
            <div>
              <label className="text-[#ccc] text-sm block mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                邮箱
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="请输入邮箱"
                />
                <button className="px-4 py-3 bg-[#444] text-[#ccc] rounded-lg font-medium text-sm">
                  已绑定
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 实名认证 */}
        <div className="bg-[#252525] rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-500" />
            实名认证
          </h3>

          <div className="space-y-4">
            {/* 真实姓名 */}
            <div>
              <label className="text-[#ccc] text-sm block mb-2">真实姓名</label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="w-full py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入真实姓名"
              />
            </div>

            {/* 身份证号 */}
            <div>
              <label className="text-[#ccc] text-sm block mb-2">身份证号</label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                className="w-full py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入身份证号"
              />
            </div>

            <p className="text-[#666] text-sm">
              完成实名认证后可享受更多服务和提升账户安全性
            </p>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center justify-center gap-2"
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
            className="px-6 py-4 rounded-xl font-bold bg-[#333] text-white hover:bg-[#444] transition-colors"
          >
            取消
          </button>
        </div>
      </div>

      {/* Toast 提示 */}
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
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </UserLayout>
  );
}
