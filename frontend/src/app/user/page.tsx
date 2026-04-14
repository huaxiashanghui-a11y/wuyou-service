'use client';

import { useState } from 'react';
import { useApp } from '@/lib/i18n';
import { AlertTriangle, Check, X, Eye, EyeOff, Upload, Smartphone, Mail, Lock, User, Shield } from 'lucide-react';
import UserLayout from '@/components/user/UserLayout';

export default function AccountPage() {
  const { language } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBindPhoneModal, setShowBindPhoneModal] = useState(false);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '无优服务',
    gender: 'male',
    contactType: '',
    contactValue: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [bindPhoneForm, setBindPhoneForm] = useState({
    phone: '',
    code: ''
  });

  const passwordRequirements = [
    { label: { zh: '至少6个字符', my: '၆လုံးအနည်းဆုံး', en: 'At least 6 characters' }, test: (p: string) => p.length >= 6 },
    { label: { zh: '包含数字', my: 'ဂဏန်းပါ', en: 'Contains numbers' }, test: (p: string) => /\d/.test(p) },
    { label: { zh: '包含字母', my: 'စာလုံးပါ', en: 'Contains letters' }, test: (p: string) => /[a-zA-Z]/.test(p) },
  ];

  const isPasswordValid = (req: typeof passwordRequirements[0]) => req.test(passwordForm.newPassword);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSaveProfile = () => {
    if (!profileForm.name || profileForm.name.length < 2) {
      showToast(language === 'zh' ? '姓名至少2个字符' : language === 'my' ? 'နာမည်အနည်းဆုံး၂လုံး' : 'Name at least 2 characters', 'error');
      return;
    }
    showToast(language === 'zh' ? '保存成功！' : language === 'my' ? 'ကယ်ဆိုင်ပါ' : 'Saved successfully!');
  };

  const handleSavePassword = () => {
    if (!passwordForm.oldPassword) {
      showToast(language === 'zh' ? '请输入旧密码' : language === 'my' ? 'စကားဝှက်အဟောင်းထည့်ပါ' : 'Enter old password', 'error');
      return;
    }
    if (!passwordRequirements.every(r => r.test(passwordForm.newPassword))) {
      showToast(language === 'zh' ? '新密码不符合要求' : language === 'my' ? 'စကားဝှက်သစ်မှန်ကန်မှုမရှိ' : 'New password invalid', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast(language === 'zh' ? '两次密码不一致' : language === 'my' ? 'စကားဝှက်၂ကြိမ်မတူ' : 'Passwords do not match', 'error');
      return;
    }
    showToast(language === 'zh' ? '密码修改成功！' : language === 'my' ? 'စကားဝှက်ပြောင်းပါ' : 'Password changed!');
  };

  return (
    <UserLayout activeTab="account">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 1. 账户基础信息 */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            {language === 'zh' ? '账户基础信息' : language === 'my' ? 'အကောင့်အခြေအနေ' : 'Account Basic Info'}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '账户ID' : language === 'my' ? 'အကောင့်ID' : 'Account ID'}
              </span>
              <span className="font-medium">51966932</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {language === 'zh' ? '邮箱' : language === 'my' ? 'အီးမေးလ်' : 'Email'}
              </span>
              <div className="text-right">
                <div className="font-medium">huaxiashanghui@gmail.com</div>
                <div className="text-xs text-orange-500">
                  ({language === 'zh' ? '可用于登录' : language === 'my' ? '၀င်ဝင်၀င်ရောက်' : 'Can login'})
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full mt-4 py-2.5 border-2 border-red-300 text-red-500 rounded-xl hover:bg-red-50 active:scale-95 transition-all duration-200 font-medium text-sm"
            >
              {language === 'zh' ? '删除账号' : language === 'my' ? 'အကောင့်ဖျက်မည်' : 'Delete Account'}
            </button>
          </div>
        </div>

        {/* 2. 账户绑定信息 */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            {language === 'zh' ? '账户绑定信息' : language === 'my' ? 'အကောင့်ချိတ်အိတ်' : 'Account Binding'}
          </h3>
          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                {language === 'zh' ? '手机号' : language === 'my' ? 'ဖုန်းနံပါတ်' : 'Phone'}
              </label>
              <button
                onClick={() => setShowBindPhoneModal(true)}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-left text-gray-500 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-sm flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>{language === 'zh' ? '绑定手机号' : language === 'my' ? 'ဖုန်းနံပါတ်ချိတ်မည်' : 'Bind Phone'}</span>
              </button>
            </div>
            {/* Google */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Google</label>
              <div className="flex items-center justify-between py-2.5 px-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-700 font-medium text-sm">
                    {language === 'zh' ? '已绑定' : language === 'my' ? 'ချိတ်ပြီး' : 'Bound'}
                  </span>
                </div>
                <button className="text-xs text-green-600 hover:underline">
                  {language === 'zh' ? '解绑' : language === 'my' ? 'ဖြည်ချိတ်' : 'Unbind'}
                </button>
              </div>
            </div>
            {/* Telegram */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Telegram</label>
              <button className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-left text-gray-500 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span>{language === 'zh' ? '绑定Telegram' : language === 'my' ? 'Telegramချိတ်မည်' : 'Bind Telegram'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. 个人联系信息 */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            {language === 'zh' ? '个人联系信息' : language === 'my' ? 'ကိုယ်ရေးအချက်အလက်' : 'Personal Info'}
          </h3>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                {language === 'zh' ? '姓名' : language === 'my' ? 'နာမည်' : 'Name'}
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                placeholder={language === 'zh' ? '请输入姓名' : language === 'my' ? 'နာမည်ထည့်ပါ' : 'Enter name'}
              />
            </div>
            {/* Gender */}
            <div>
              <label className="text-sm text-gray-600 block mb-2">
                {language === 'zh' ? '性别' : language === 'my' ? 'ကျား/မ' : 'Gender'}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profileForm.gender === 'male'}
                    onChange={() => setProfileForm({ ...profileForm, gender: 'male' })}
                    className="w-4 h-4 text-orange-500"
                  />
                  <span className="text-sm">{language === 'zh' ? '男' : language === 'my' ? 'ကျား' : 'Male'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profileForm.gender === 'female'}
                    onChange={() => setProfileForm({ ...profileForm, gender: 'female' })}
                    className="w-4 h-4 text-orange-500"
                  />
                  <span className="text-sm">{language === 'zh' ? '女' : language === 'my' ? 'မ' : 'Female'}</span>
                </label>
              </div>
            </div>
            {/* Contact */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                {language === 'zh' ? '其他联系方式' : language === 'my' ? 'ဆက်သွယ်ရန်နည်းလမ်းအခြား' : 'Other Contact'}
              </label>
              <div className="flex gap-2">
                <select
                  value={profileForm.contactType}
                  onChange={(e) => setProfileForm({ ...profileForm, contactType: e.target.value })}
                  className="w-32 py-2.5 px-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="">{language === 'zh' ? '请选择' : language === 'my' ? 'ရွေးချယ်ပါ' : 'Select'}</option>
                  <option value="wechat">{language === 'zh' ? '微信' : language === 'my' ? 'ဝက်ချက်' : 'WeChat'}</option>
                  <option value="qq">QQ</option>
                  <option value="telegram">Telegram</option>
                </select>
                <input
                  type="text"
                  value={profileForm.contactValue}
                  onChange={(e) => setProfileForm({ ...profileForm, contactValue: e.target.value })}
                  className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder={language === 'zh' ? '请输入联系方式' : language === 'my' ? 'ဆက်သွယ်ရန်ထည့်ပါ' : 'Enter contact'}
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl hover:from-orange-600 hover:to-orange-500 active:scale-95 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {language === 'zh' ? '保存' : language === 'my' ? 'ကယ်မည်' : 'Save'}
            </button>
          </div>
        </div>

        {/* 4. 账户密码修改 */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            {language === 'zh' ? '账户密码修改' : language === 'my' ? 'စကားဝှက်ပြောင်းမည်' : 'Change Password'}
          </h3>
          <div className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                {language === 'zh' ? '旧密码' : language === 'my' ? 'စကားဝှက်အဟောင်း' : 'Old Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword.old ? 'text' : 'password'}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full py-2.5 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder={language === 'zh' ? '请输入旧密码' : language === 'my' ? 'စကားဝှက်အဟောင်းထည့်ပါ' : 'Enter old password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-orange-500 -mt-2">
              {language === 'zh' ? '如忘记密码，请' : language === 'my' ? 'စကားဝှက်မေ့နေပါက' : 'If forgot password'}
              <a href="/forgot-password" className="underline ml-1">
                {language === 'zh' ? '点击此处找回' : language === 'my' ? 'ဤနေရာနှိပ်ပါ' : 'click here'}
              </a>
            </p>

            {/* New Password */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                {language === 'zh' ? '新密码' : language === 'my' ? 'စကားဝှက်သစ်' : 'New Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full py-2.5 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder={language === 'zh' ? '请输入新密码' : language === 'my' ? 'စကားဝှက်သစ်ထည့်ပါ' : 'Enter new password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Requirements */}
              {passwordForm.newPassword && (
                <div className="mt-2 space-y-1 p-2 bg-white rounded-lg">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {isPasswordValid(req) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-gray-300" />
                      )}
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
              <label className="text-sm text-gray-600 block mb-1">
                {language === 'zh' ? '确认密码' : language === 'my' ? 'စကားဝှက်အတည်ပြု' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full py-2.5 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder={language === 'zh' ? '请再次输入新密码' : language === 'my' ? 'စကားဝှက်ပြန်လည်ထည့်ပါ' : 'Confirm new password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSavePassword}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl hover:from-orange-600 hover:to-orange-500 active:scale-95 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {language === 'zh' ? '保存' : language === 'my' ? 'ကယ်မည်' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  {language === 'zh' ? '确认删除账号' : language === 'my' ? 'အကောင့်ဖျက်မှာသေချာလား' : 'Confirm Delete'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'zh' ? '删除后无法恢复' : language === 'my' ? 'ဖျက်လိုက်ရင်ပြန်မရတော့ပါ' : 'Cannot be recovered'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {language === 'zh' ? '取消' : language === 'my' ? 'မလုပ်' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  showToast(language === 'zh' ? '账号已删除' : language === 'my' ? 'အကောင့်ဖျက်ပြီး' : 'Account deleted');
                }}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
              >
                {language === 'zh' ? '确认删除' : language === 'my' ? 'ဖျက်မည်' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bind Phone Modal */}
      {showBindPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">
                {language === 'zh' ? '绑定手机号' : language === 'my' ? 'ဖုန်းနံပါတ်ချိတ်မည်' : 'Bind Phone'}
              </h3>
              <button onClick={() => setShowBindPhoneModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  {language === 'zh' ? '手机号' : language === 'my' ? 'ဖုန်းနံပါတ်' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={bindPhoneForm.phone}
                  onChange={(e) => setBindPhoneForm({ ...bindPhoneForm, phone: e.target.value })}
                  className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={language === 'zh' ? '请输入手机号' : language === 'my' ? 'ဖုန်းနံပါတ်ထည့်ပါ' : 'Enter phone'}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  {language === 'zh' ? '验证码' : language === 'my' ? 'အတည်ပြုကုဒ်' : 'Verification Code'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bindPhoneForm.code}
                    onChange={(e) => setBindPhoneForm({ ...bindPhoneForm, code: e.target.value })}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={language === 'zh' ? '请输入验证码' : language === 'my' ? 'ကုဒ်ထည့်ပါ' : 'Enter code'}
                  />
                  <button className="px-4 py-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors font-medium text-sm">
                    {language === 'zh' ? '获取验证码' : language === 'my' ? 'ကုဒ်ရမည်' : 'Get Code'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBindPhoneModal(false);
                  showToast(language === 'zh' ? '绑定成功！' : language === 'my' ? 'ချိတ်ပြီး' : 'Bound successfully!');
                }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl hover:from-orange-600 hover:to-orange-500 transition-colors font-medium"
              >
                {language === 'zh' ? '绑定' : language === 'my' ? 'ချိတ်မည်' : 'Bind'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-pulse ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {toast.message}
          </div>
        </div>
      )}
    </UserLayout>
  );
}
