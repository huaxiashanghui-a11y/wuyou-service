'use client';

import { useState } from 'react';
import { Shield, CreditCard, Camera, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

type TabType = 'identity' | 'bankcard';

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [bankCardPreview, setBankCardPreview] = useState<string | null>(null);

  // Mock verification status
  const identityStatus = 'verified'; // 'none' | 'pending' | 'verified' | 'rejected'
  const bankCardStatus = 'pending'; // 'none' | 'pending' | 'verified' | 'rejected'

  const handleImageUpload = (type: 'front' | 'back' | 'bankcard', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'front') setIdFrontPreview(reader.result as string);
        else if (type === 'back') setIdBackPreview(reader.result as string);
        else setBankCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
          <CheckCircle className="w-4 h-4" /> 已认证
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600">
          <Clock className="w-4 h-4" /> 审核中
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
          <XCircle className="w-4 h-4" /> 认证失败
        </span>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的认证</h1>
        <p className="text-sm text-gray-500 mt-1">完成身份认证和银行卡绑定，提高账户安全性</p>
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('identity')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'identity'
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="w-5 h-5" />
            身份认证
          </button>
          <button
            onClick={() => setActiveTab('bankcard')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'bankcard'
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            银行卡
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'identity' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">身份信息认证</h3>
                <p className="text-sm text-gray-500 mt-1">上传身份证正反面照片进行实名认证</p>
              </div>
              <StatusBadge status={identityStatus} />
            </div>

            {/* ID Front */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身份证正面 <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                  idFrontPreview ? 'border-green-400' : 'border-gray-200 hover:border-orange-400'
                }`}
              >
                {idFrontPreview ? (
                  <div className="relative">
                    <img src={idFrontPreview} alt="身份证正面" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => setIdFrontPreview(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-300 mb-3" />
                    <span className="text-sm text-gray-500">点击上传身份证正面照片</span>
                    <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('front', e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* ID Back */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身份证反面 <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                  idBackPreview ? 'border-green-400' : 'border-gray-200 hover:border-orange-400'
                }`}
              >
                {idBackPreview ? (
                  <div className="relative">
                    <img src={idBackPreview} alt="身份证反面" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => setIdBackPreview(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-300 mb-3" />
                    <span className="text-sm text-gray-500">点击上传身份证反面照片</span>
                    <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('back', e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              提交认证
            </button>
          </div>
        )}

        {activeTab === 'bankcard' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">银行卡绑定</h3>
                <p className="text-sm text-gray-500 mt-1">绑定您的银行卡用于资金提现</p>
              </div>
              <StatusBadge status={bankCardStatus} />
            </div>

            {/* Bank Card Photo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                银行卡照片 <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                  bankCardPreview ? 'border-green-400' : 'border-gray-200 hover:border-orange-400'
                }`}
              >
                {bankCardPreview ? (
                  <div className="relative">
                    <img src={bankCardPreview} alt="银行卡" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => setBankCardPreview(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <CreditCard className="w-12 h-12 text-gray-300 mb-3" />
                    <span className="text-sm text-gray-500">点击上传银行卡照片</span>
                    <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('bankcard', e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Bank Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开户银行 <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option value="">请选择银行</option>
                <option value="icbc">中国工商银行</option>
                <option value="abc">中国农业银行</option>
                <option value="boc">中国银行</option>
                <option value="ccb">中国建设银行</option>
                <option value="comm">交通银行</option>
                <option value="citic">中信银行</option>
                <option value="cebb">中国光大银行</option>
                <option value="huaxia">华夏银行</option>
                <option value="cmb">招商银行</option>
                <option value="cib">兴业银行</option>
                <option value="psbc">中国邮政储蓄银行</option>
              </select>
            </div>

            {/* Bank Card Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                银行卡号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="请输入银行卡号"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              提交绑定
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
