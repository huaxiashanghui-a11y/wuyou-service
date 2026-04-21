'use client';

import { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  QrCode,
  Smartphone,
  CreditCard,
  Wallet
} from 'lucide-react';

// 支付方式数据
const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: '💳', color: 'bg-green-500' },
  { id: 'alipay', name: '支付宝', icon: '💰', color: 'bg-blue-500' },
  { id: 'kbzpay', name: 'KBZPay', icon: '🏦', color: 'bg-purple-500' },
  { id: 'kbzbanking', name: 'KBZ Banking', icon: '🏧', color: 'bg-indigo-500' },
  { id: 'ayapay', name: 'AYA Pay', icon: '📱', color: 'bg-pink-500' },
  { id: 'wavepay', name: 'WavePay', icon: '🌊', color: 'bg-cyan-500' },
  { id: 'binance', name: '币安支付', icon: '🟡', color: 'bg-yellow-500' },
  { id: 'usdt', name: 'USDT', icon: '💎', color: 'bg-emerald-500' },
  { id: 'visa', name: 'VISA', icon: '💳', color: 'bg-red-500' },
];

// 充值金额选项
const amountOptions = [100, 500, 1000, 2000, 5000];

export default function WalletPage() {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 生成二维码
  const generateQRCode = () => {
    setLoading(true);
    // 模拟生成二维码
    setTimeout(() => {
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PAY_${Date.now()}`);
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 提交充值申请
  const submitRecharge = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  // 重置流程
  const resetFlow = () => {
    setStep(1);
    setSelectedMethod(null);
    setAmount(500);
    setCustomAmount('');
    setQrCode('');
    setUploadedFile(null);
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-white">钱包充值</h1>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          {['选择方式', '扫码支付', '上传凭证', '完成'].map((label, index) => {
            const stepNum = index + 1;
            const isActive = step >= stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-[#333] text-[#666]'
                    } ${isCurrent ? 'ring-4 ring-orange-500/30' : ''}`}
                  >
                    {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? 'text-orange-500' : 'text-[#666]'}`}>
                    {label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step > stepNum ? 'bg-orange-500' : 'bg-[#333]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 步骤1: 选择支付方式 */}
        {step === 1 && (
          <div className="bg-[#252525] rounded-xl p-6 animate-fade-in">
            {/* 金额选择 */}
            <div className="mb-6">
              <label className="text-white font-medium block mb-3">选择充值金额</label>
              <div className="grid grid-cols-5 gap-3">
                {amountOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setAmount(opt);
                      setCustomAmount('');
                    }}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      amount === opt && !customAmount
                        ? 'bg-orange-500 text-white'
                        : 'bg-[#333] text-[#ccc] hover:bg-[#3a3a3a]'
                    }`}
                  >
                    ¥{opt}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(0);
                  }}
                  placeholder="自定义金额"
                  className="w-full py-3 px-4 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* 支付方式选择 */}
            <div className="mb-6">
              <label className="text-white font-medium block mb-3">选择支付方式</label>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                      selectedMethod === method.id
                        ? 'bg-orange-500/20 border-2 border-orange-500'
                        : 'bg-[#333] border-2 border-transparent hover:border-[#555]'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-white text-sm font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 确认按钮 */}
            <button
              onClick={generateQRCode}
              disabled={!selectedMethod || (!amount && !customAmount)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedMethod && (amount || customAmount)
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                  : 'bg-[#333] text-[#666] cursor-not-allowed'
              }`}
            >
              生成支付二维码
            </button>
          </div>
        )}

        {/* 步骤2: 扫码支付 */}
        {step === 2 && (
          <div className="bg-[#252525] rounded-xl p-6 animate-fade-in">
            <div className="text-center mb-6">
              <p className="text-[#ccc] mb-2">请使用 {paymentMethods.find(m => m.id === selectedMethod)?.name} 扫码支付</p>
              <p className="text-3xl font-bold text-white">
                ¥{(amount || parseInt(customAmount) || 0).toLocaleString()}
              </p>
            </div>

            {/* 二维码 */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl">
                {loading ? (
                  <div className="w-[180px] h-[180px] flex items-center justify-center">
                    <div className="animate-spin rounded-full w-12 h-12 border-4 border-orange-500 border-t-transparent"></div>
                  </div>
                ) : (
                  qrCode ? (
                    <img src={qrCode} alt="支付二维码" className="w-[180px] h-[180px]" />
                  ) : (
                    <QrCode className="w-[180px] h-[180px] text-gray-300" />
                  )
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-[#ccc]">
                <Smartphone className="w-5 h-5" />
                <span>打开手机 {paymentMethods.find(m => m.id === selectedMethod)?.name} 扫码</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-xl font-bold bg-[#333] text-white hover:bg-[#444] transition-colors"
              >
                已完成支付
              </button>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded-xl font-bold bg-[#333] text-[#ccc] hover:bg-[#444] transition-colors"
              >
                返回
              </button>
            </div>
          </div>
        )}

        {/* 步骤3: 上传支付凭证 */}
        {step === 3 && (
          <div className="bg-[#252525] rounded-xl p-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">扫码成功</h3>
              <p className="text-[#ccc]">请上传支付凭证以便核实</p>
            </div>

            {/* 金额信息 */}
            <div className="bg-[#1e1e1e] rounded-xl p-4 mb-6 text-center">
              <p className="text-[#ccc] text-sm mb-1">充值金额</p>
              <p className="text-3xl font-bold text-orange-500">
                ¥{(amount || parseInt(customAmount) || 0).toLocaleString()}
              </p>
            </div>

            {/* 上传凭证 */}
            <div className="mb-6">
              <label className="text-white font-medium block mb-3">上传支付凭证</label>
              <div className="border-2 border-dashed border-[#444] rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
                {uploadedFile ? (
                  <div className="relative">
                    <img src={uploadedFile} alt="支付凭证" className="max-h-48 mx-auto rounded-lg" />
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-[#666] mx-auto mb-3" />
                    <p className="text-[#ccc] mb-2">点击或拖拽上传凭证图片</p>
                    <p className="text-[#666] text-sm">支持 JPG、PNG 格式</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <button
              onClick={submitRecharge}
              disabled={!uploadedFile || loading}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                uploadedFile && !loading
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                  : 'bg-[#333] text-[#666] cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent"></div>
                  提交中...
                </span>
              ) : (
                '提交充值申请'
              )}
            </button>
          </div>
        )}

        {/* 步骤4: 完成 */}
        {step === 4 && (
          <div className="bg-[#252525] rounded-xl p-6 animate-fade-in text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">充值申请已提交</h3>
            <p className="text-[#ccc] mb-6">
              您的充值申请已提交，金额将在核实后到账
            </p>

            <div className="bg-[#1e1e1e] rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#ccc]">充值金额</span>
                <span className="text-white font-bold">¥{(amount || parseInt(customAmount) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#ccc]">支付方式</span>
                <span className="text-white font-medium">
                  {paymentMethods.find(m => m.id === selectedMethod)?.icon}{' '}
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/user'}
                className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                返回首页
              </button>
              <button
                onClick={resetFlow}
                className="px-6 py-4 rounded-xl font-bold bg-[#333] text-white hover:bg-[#444] transition-colors"
              >
                继续充值
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </UserLayout>
  );
}
