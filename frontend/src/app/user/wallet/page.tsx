'use client';

import { useState, useEffect } from 'react';
import UserLayout from '@/components/user/UserLayout';
import {
  ChevronLeft,
  Check,
  Upload,
  QrCode,
  Smartphone,
  Copy,
  Wallet,
  Loader2
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
  const [balance, setBalance] = useState('0.00');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 获取余额
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/user?action=wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setBalance((data.data.balance || 0).toFixed(2));
        }
      } catch (error) {
        console.error('获取余额失败:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchBalance();
  }, []);

  // 生成二维码
  const generateQRCode = () => {
    if (!selectedMethod) return;
    setLoading(true);
    setTimeout(() => {
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY_${Date.now()}`);
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
  const submitRecharge = async () => {
    if (!uploadedFile) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    const rechargeAmount = amount || parseInt(customAmount) || 0;

    try {
      // 创建充值订单
      const createRes = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'recharge',
          amount: rechargeAmount,
          paymentMethod: paymentMethods.find(m => m.id === selectedMethod)?.name,
        }),
      });

      const createData = await createRes.json();
      if (!createData.success) {
        alert(createData.message || '创建充值订单失败');
        setLoading(false);
        return;
      }

      // 确认充值（上传凭证）
      await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'confirmRecharge',
          orderNo: createData.data.orderNo,
          paymentProof: uploadedFile,
        }),
      });

      setLoading(false);
      setStep(5);
    } catch (error) {
      console.error('充值失败:', error);
      setLoading(false);
    }
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

  // 步骤标签
  const steps = ['选择金额', '选择支付', '扫码支付', '上传凭证'];

  if (isLoadingData) {
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
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-white">我的钱包</h1>
        </div>

        {/* 余额卡片 */}
        <div className="bg-gradient-to-r from-account-primary to-blue-600 rounded-2xl p-6 mb-6 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">账户余额</p>
              <p className="text-4xl font-bold text-white">¥{balance}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isActive = step >= stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isActive
                        ? 'bg-account-primary text-white'
                        : 'bg-account-card text-account-secondary border border-account-border'
                    } ${isCurrent ? 'ring-4 ring-account-primary/30' : ''}`}
                  >
                    {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <span className={`text-xs mt-2 ${isActive ? 'text-account-primary' : 'text-account-secondary'}`}>
                    {label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${step > stepNum ? 'bg-account-primary' : 'bg-account-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* 步骤1: 选择金额 */}
        {step === 1 && (
          <div className="bg-account-card rounded-xl p-6 animate-fade-in border border-account-border">
            <h3 className="text-white font-bold mb-4">选择充值金额</h3>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {amountOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setAmount(opt); setCustomAmount(''); }}
                  className={`py-4 rounded-xl font-bold transition-all ${
                    amount === opt && !customAmount
                      ? 'bg-account-primary text-white shadow-glow'
                      : 'bg-account-bg text-white hover:bg-account-border'
                  }`}
                >
                  ¥{opt}
                </button>
              ))}
            </div>
            <div className="mb-6">
              <label className="text-account-secondary text-sm block mb-2">自定义金额</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-account-secondary">¥</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                  placeholder="请输入金额"
                  className="w-full py-4 pl-8 pr-4 bg-account-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-account-primary border border-account-border"
                />
              </div>
            </div>
            <div className="bg-account-bg rounded-xl p-4 mb-6">
              <p className="text-account-secondary text-sm">
                充值金额：<span className="text-account-primary font-bold text-xl">¥{(amount || parseInt(customAmount) || 0).toLocaleString()}</span>
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!amount && !customAmount}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                amount || customAmount
                  ? 'bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90'
                  : 'bg-account-border text-account-secondary cursor-not-allowed'
              }`}
            >
              下一步
            </button>
          </div>
        )}

        {/* 步骤2: 选择支付方式 */}
        {step === 2 && (
          <div className="bg-account-card rounded-xl p-6 animate-fade-in border border-account-border">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep(1)} className="p-2 hover:bg-account-border rounded-lg">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <h3 className="text-white font-bold">选择支付方式</h3>
            </div>
            <div className="bg-account-bg rounded-xl p-4 mb-6">
              <p className="text-account-secondary text-sm">
                充值金额：<span className="text-account-primary font-bold text-xl">¥{(amount || parseInt(customAmount) || 0).toLocaleString()}</span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                    selectedMethod === method.id
                      ? 'bg-account-primary/20 border-2 border-account-primary'
                      : 'bg-account-bg border-2 border-transparent hover:border-account-border'
                  }`}
                >
                  <span className="text-3xl">{method.icon}</span>
                  <span className="text-white text-sm font-medium">{method.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={generateQRCode}
              disabled={!selectedMethod || loading}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                selectedMethod && !loading
                  ? 'bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90'
                  : 'bg-account-border text-account-secondary cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent"></div>
                  生成中...
                </span>
              ) : (
                '生成支付二维码'
              )}
            </button>
          </div>
        )}

        {/* 步骤3: 扫码支付 */}
        {step === 3 && (
          <div className="bg-account-card rounded-xl p-6 animate-fade-in border border-account-border">
            <div className="text-center mb-6">
              <p className="text-account-secondary mb-2">请使用 {paymentMethods.find(m => m.id === selectedMethod)?.name} 扫码支付</p>
              <p className="text-3xl font-bold text-account-primary">
                ¥{(amount || parseInt(customAmount) || 0).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl">
                {qrCode ? (
                  <img src={qrCode} alt="支付二维码" className="w-48 h-48" />
                ) : (
                  <QrCode className="w-48 h-48 text-gray-300" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-account-secondary mb-6">
              <Smartphone className="w-5 h-5" />
              <span>打开手机 {paymentMethods.find(m => m.id === selectedMethod)?.name} 扫码</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90 transition-colors"
              >
                已完成支付
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-4 rounded-xl font-bold bg-account-bg text-white hover:bg-account-border transition-colors"
              >
                返回
              </button>
            </div>
          </div>
        )}

        {/* 步骤4: 上传凭证 */}
        {step === 4 && (
          <div className="bg-account-card rounded-xl p-6 animate-fade-in border border-account-border">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-account-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-account-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">扫码成功</h3>
              <p className="text-account-secondary">请上传支付凭证以便核实</p>
            </div>
            <div className="bg-account-bg rounded-xl p-4 mb-6 text-center">
              <p className="text-account-secondary text-sm">充值金额</p>
              <p className="text-3xl font-bold text-account-primary">
                ¥{(amount || parseInt(customAmount) || 0).toLocaleString()}
              </p>
            </div>
            <div className="mb-6">
              <label className="text-white font-medium block mb-3">上传支付凭证</label>
              <div className="border-2 border-dashed border-account-border rounded-xl p-8 text-center hover:border-account-primary transition-colors cursor-pointer relative">
                {uploadedFile ? (
                  <div className="relative">
                    <img src={uploadedFile} alt="凭证" className="max-h-48 mx-auto rounded-lg" />
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-account-danger rounded-full flex items-center justify-center text-white"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-account-secondary mx-auto mb-3" />
                    <p className="text-white mb-1">点击或拖拽上传凭证图片</p>
                    <p className="text-account-secondary text-sm">支持 JPG、PNG 格式</p>
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
            <button
              onClick={submitRecharge}
              disabled={!uploadedFile || loading}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                uploadedFile && !loading
                  ? 'bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90'
                  : 'bg-account-border text-account-secondary cursor-not-allowed'
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

        {/* 步骤5: 完成 */}
        {step === 5 && (
          <div className="bg-account-card rounded-xl p-6 animate-fade-in border border-account-border text-center">
            <div className="w-20 h-20 bg-account-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-account-success" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">充值申请已提交</h3>
            <p className="text-account-secondary mb-6">
              您的充值申请已提交，金额将在核实后到账
            </p>
            <div className="bg-account-bg rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-account-secondary">充值金额</span>
                <span className="text-white font-bold">¥{(amount || parseInt(customAmount) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-account-secondary">支付方式</span>
                <span className="text-white">
                  {paymentMethods.find(m => m.id === selectedMethod)?.icon}{' '}
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.href = '/user'}
                className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-account-primary to-blue-600 text-white hover:opacity-90 transition-colors"
              >
                返回首页
              </button>
              <button
                onClick={resetFlow}
                className="px-6 py-4 rounded-xl font-bold bg-account-bg text-white hover:bg-account-border transition-colors"
              >
                继续充值
              </button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
