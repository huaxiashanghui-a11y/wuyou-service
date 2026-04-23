'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  Store,
  Phone,
  Tag,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Info
} from 'lucide-react';

interface UserProfile {
  id: number;
  is_merchant: number;
  username: string;
  nickname: string;
}

export default function MerchantJoinPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState({
    shop_name: '',
    contact_phone: '',
    business_category: '',
    remark: '',
  });

  // 错误提示
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 主营类目选项
  const categories = [
    '游戏点卡充值',
    '话费流量充值',
    '视频会员充值',
    '外卖团购',
    '同城跑腿',
    '二手交易',
    '其他服务',
  ];

  // 获取用户信息
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/user?action=profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.data);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shop_name || formData.shop_name.trim().length < 2) {
      newErrors.shop_name = '店铺名称至少2个字符';
    }

    if (!formData.contact_phone) {
      newErrors.contact_phone = '请输入联系电话';
    } else if (!/^[\d-+\s()]{8,20}$/.test(formData.contact_phone)) {
      newErrors.contact_phone = '请输入有效的电话号码';
    }

    if (!formData.business_category) {
      newErrors.business_category = '请选择主营类目';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交申请
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/merchant/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setFormData({ shop_name: '', contact_phone: '', business_category: '', remark: '' });
      } else {
        setErrors({ submit: data.message || '提交失败，请稍后重试' });
      }
    } catch (error) {
      console.error('提交申请失败:', error);
      setErrors({ submit: '提交失败，请稍后重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 已入驻商家提示
  if (!isLoading && userProfile?.is_merchant === 1) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-account-card rounded-2xl p-8 border border-account-border text-center">
            <div className="w-20 h-20 bg-account-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-account-success" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">您已是平台商家</h2>
            <p className="text-account-secondary mb-6">
              恭喜！您的账号已被认证为平台商家，享有商家专属权益。
            </p>
            <p className="text-account-secondary text-sm">
              如需修改店铺信息或有问题，请联系超级管理员。
            </p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-account-primary animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Store className="w-7 h-7 text-account-primary" />
            商家入驻
          </h1>
          <p className="text-account-secondary mt-2">加入我们，开启您的线上生意之旅</p>
        </div>

        {/* 入驻介绍 */}
        <div className="bg-gradient-to-r from-account-primary/20 to-purple-500/10 rounded-2xl p-6 mb-6 border border-account-primary/30">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-account-primary" />
            入驻说明
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-account-bg rounded-xl p-4">
              <h4 className="text-account-primary font-medium mb-2">为什么要入驻？</h4>
              <ul className="text-account-secondary text-sm space-y-2">
                <li>• 获得专属商家后台管理权限</li>
                <li>• 享受平台流量扶持</li>
                <li>• 提升店铺曝光度和订单量</li>
                <li>• 专业客服支持服务</li>
              </ul>
            </div>
            <div className="bg-account-bg rounded-xl p-4">
              <h4 className="text-account-primary font-medium mb-2">入驻要求</h4>
              <ul className="text-account-secondary text-sm space-y-2">
                <li>• 具备合法经营资质</li>
                <li>• 能够提供优质服务</li>
                <li>• 遵守平台规则和协议</li>
                <li>• 配合平台审核和管理</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 合作规则 */}
        <div className="bg-account-card rounded-xl p-6 mb-6 border border-account-border">
          <h3 className="text-white font-bold mb-4">合作规则</h3>
          <div className="space-y-3 text-account-secondary text-sm">
            <p>1. 商家需保证所提供商品/服务的真实性和合法性。</p>
            <p>2. 商家需遵守平台价格规定，不得哄抬物价或恶意竞争。</p>
            <p>3. 商家需在规定时间内完成订单，超时将受到相应处罚。</p>
            <p>4. 商家需积极配合平台客服处理用户投诉和售后问题。</p>
            <p>5. 商家违规行为严重者，平台有权取消其商家资格。</p>
          </div>
        </div>

        {/* 申请表单 */}
        <div className="bg-account-card rounded-xl p-6 border border-account-border">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-account-primary" />
            入驻申请表单
          </h3>

          {errors.submit && (
            <div className="mb-6 p-4 bg-account-danger/20 border border-account-danger/30 rounded-xl flex items-center gap-2 text-account-danger">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 店铺名称 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <Store className="w-4 h-4 inline mr-1" />
                店铺名称 <span className="text-account-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.shop_name}
                onChange={(e) => {
                  setFormData({ ...formData, shop_name: e.target.value });
                  if (errors.shop_name) setErrors({ ...errors, shop_name: '' });
                }}
                placeholder="请输入您的店铺名称"
                className={`w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border ${
                  errors.shop_name ? 'border-account-danger' : 'border-account-border'
                }`}
              />
              {errors.shop_name && (
                <p className="mt-1 text-sm text-account-danger">{errors.shop_name}</p>
              )}
            </div>

            {/* 联系方式 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                联系电话 <span className="text-account-danger">*</span>
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => {
                  setFormData({ ...formData, contact_phone: e.target.value });
                  if (errors.contact_phone) setErrors({ ...errors, contact_phone: '' });
                }}
                placeholder="请输入您的联系电话"
                className={`w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border ${
                  errors.contact_phone ? 'border-account-danger' : 'border-account-border'
                }`}
              />
              {errors.contact_phone && (
                <p className="mt-1 text-sm text-account-danger">{errors.contact_phone}</p>
              )}
            </div>

            {/* 主营类目 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                主营类目 <span className="text-account-danger">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, business_category: cat });
                      if (errors.business_category) setErrors({ ...errors, business_category: '' });
                    }}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      formData.business_category === cat
                        ? 'bg-account-primary text-white shadow-glow'
                        : 'bg-account-bg text-account-secondary hover:bg-account-border hover:text-white border border-account-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.business_category && (
                <p className="mt-2 text-sm text-account-danger">{errors.business_category}</p>
              )}
            </div>

            {/* 备注 */}
            <div>
              <label className="text-account-secondary text-sm block mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                备注说明
              </label>
              <textarea
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="请简要描述您的业务情况或特殊需求（选填）"
                rows={4}
                className="w-full py-3.5 px-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border resize-none"
              />
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  提交入驻申请
                </>
              )}
            </button>
          </form>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 p-4 bg-account-bg rounded-xl border border-account-border">
          <p className="text-account-secondary text-sm text-center">
            提交申请后，平台将在 <span className="text-account-primary font-medium">1-3个工作日</span> 内完成审核。
            <br />
            审核结果将通过短信或站内消息通知您。
          </p>
        </div>
      </div>

      {/* 成功提示弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-account-card rounded-2xl p-8 w-full max-w-md animate-fade-in border border-account-border text-center">
            <div className="w-20 h-20 bg-account-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-account-success" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">提交成功</h3>
            <p className="text-account-secondary mb-6">
              请联系超级管理员审核，审核通过领取商家后台账号密码。
            </p>
            <div className="bg-account-bg rounded-xl p-4 mb-6">
              <p className="text-account-secondary text-sm">
                管理员联系方式：
              </p>
              <p className="text-account-primary font-bold text-lg mt-1">
                联系平台客服获取
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-account-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </UserLayout>
  );
}