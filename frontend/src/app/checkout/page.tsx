'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore, useToastStore } from '@/lib/store';
import { CheckCircle, Loader2, ShieldCheck, Copy, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { orderApi, paymentApi } from '@/lib/api';
import { PaymentMethodRecord, CURRENCY_SYMBOLS, PaymentCurrency } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, clearCart, isHydrated } = useCartStore();
  const { addToast } = useToastStore();

  // URL 参数：支持从 payPageUrl 跳回自动展示支付步骤
  const urlOrderNo = searchParams.get('orderNo');
  const urlStep = searchParams.get('step');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    remark: '',
    selectedMethodId: 0, // payment_methods.id (数据库 ID)
  });
  const [step, setStep] = useState<'form' | 'payment' | 'success'>(
    urlStep === 'payment' && urlOrderNo ? 'payment' : 'form'
  );
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [clientReady, setClientReady] = useState(false);

  // 动态支付方式
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);

  // 报价数据
  const [quoteData, setQuoteData] = useState<{
    quoteToken: string;
    payAmount: number;
    payCurrency: PaymentCurrency;
    payAmountRaw: number;
    expiresAt: string;
  } | null>(null);

  // 支付指引
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);

  // 倒计时（秒）
  const [countdown, setCountdown] = useState<number>(0);

  // 确保客户端 Hydration 完成后再渲染
  useEffect(() => {
    setClientReady(true);
  }, []);

  // 倒计时逻辑：报价/订单过期倒计时
  useEffect(() => {
    if (!quoteData?.expiresAt) return;
    const expiry = new Date(quoteData.expiresAt).getTime();
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        addToast({ message: '报价已过期，请重新下单', type: 'warning' });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [quoteData?.expiresAt]);

  // 加载支付方式
  useEffect(() => {
    if (!clientReady) return;

    const loadMethods = async () => {
      try {
        const result = await paymentApi.getMethods();
        if (result.success && result.data && result.data.length > 0) {
          setPaymentMethods(result.data);
          // 默认选中第一个
          setFormData((prev) => ({ ...prev, selectedMethodId: result.data![0].id }));
        } else {
          addToast({ message: '暂无可用支付方式，请联系客服', type: 'error' });
        }
      } catch (error: any) {
        console.error('Load payment methods error:', error);
        addToast({ message: '支付方式加载失败，请稍后重试', type: 'error' });
      } finally {
        setMethodsLoading(false);
      }
    };

    loadMethods();
  }, [clientReady]);

  const totalPrice = getTotalPrice();

  // 获取当前选中的支付方式（纯后端数据，无硬编码回退）
  const selectedMethod = paymentMethods.find((m) => m.id === formData.selectedMethodId);
  const displayCurrency = selectedMethod?.currency || 'CNY';
  const currencySymbol = CURRENCY_SYMBOLS[displayCurrency as PaymentCurrency] || '¥';
  const displayMethodName = selectedMethod?.name || '';

  // ============================================
  // 步骤1：提交订单（报价 → 建单 两步）
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email && !formData.phone) {
      addToast({ message: '请填写邮箱或手机号码', type: 'error' });
      return;
    }

    if (!formData.selectedMethodId) {
      addToast({ message: '请选择支付方式', type: 'error' });
      return;
    }

    if (items.length === 0) {
      addToast({ message: '购物车是空的，请先添加商品', type: 'error' });
      return;
    }

    const method = paymentMethods.find((m) => m.id === formData.selectedMethodId);
    if (!method) {
      addToast({ message: '请选择有效的支付方式', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // ========== Step A: 获取汇率报价 ==========
      const quoteItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const quoteResult = await paymentApi.createQuote({
        items: quoteItems,
        targetCurrency: method.currency,
      });

      if (!quoteResult.success || !quoteResult.data) {
        addToast({
          message: quoteResult.message || '获取报价失败',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      const { quoteToken, payAmount, payCurrency, expiresAt } = quoteResult.data;
      setQuoteData({ quoteToken, payAmount, payCurrency, payAmountRaw: payAmount, expiresAt });

      // ========== Step B: 创建订单 ==========
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const orderResult = await orderApi.createOrderFromQuote({
        quoteToken,
        paymentMethodId: formData.selectedMethodId,
        items: orderItems,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        remark: formData.remark || undefined,
      });

      if (!orderResult.success || !orderResult.data) {
        addToast({
          message: orderResult.message || '订单创建失败',
          type: 'error',
        });
        setLoading(false);
        return;
      }

      setOrderData(orderResult.data);
      addToast({ message: '订单创建成功！请完成支付', type: 'success' });

      // 跳转到支付页（满足验收标准：自动跳转到 payPageUrl）
      const payPageUrl = orderResult.data.payPageUrl;
      if (payPageUrl) {
        router.replace(payPageUrl);
        return; // replace 后无需设置 step
      }
      setStep('payment');
    } catch (error: any) {
      console.error('Submit order error:', error);
      const errorMsg =
        error?.response?.data?.message || error?.message || '下单失败，请稍后重试';
      addToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 步骤2：获取支付指引
  // ============================================
  const loadPaymentInstructions = async () => {
    if (!orderData?.orderNo) return;

    setLoading(true);
    try {
      const result = await paymentApi.preparePayment({
        orderNo: orderData.orderNo,
      });

      if (result.success && result.data) {
        setPaymentInstructions(result.data);
      } else {
        addToast({
          message: result.message || '获取支付信息失败',
          type: 'warning',
        });
      }
    } catch (error: any) {
      console.error('Load payment instructions error:', error);
      // 不阻断流程
    } finally {
      setLoading(false);
    }
  };

  // 当 URL 携带 orderNo 时，自动加载订单并进入支付步骤
  useEffect(() => {
    if (!clientReady || !urlOrderNo) return;

    const loadOrder = async () => {
      setLoading(true);
      try {
        const result = await orderApi.getOrderByNo(urlOrderNo);
        if (result.success && result.data) {
          setOrderData(result.data);
          setStep('payment');
        } else {
          addToast({ message: result.message || '订单不存在', type: 'error' });
          router.replace('/checkout');
        }
      } catch (error: any) {
        console.error('Load order by URL param error:', error);
        addToast({ message: '加载订单失败', type: 'error' });
        router.replace('/checkout');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [clientReady, urlOrderNo]);

  // 进入支付步骤时加载支付指引
  useEffect(() => {
    if (step === 'payment' && orderData?.orderNo && !paymentInstructions) {
      loadPaymentInstructions();
    }
  }, [step, orderData?.orderNo]);

  // ============================================
  // 步骤2：确认支付
  // ============================================
  const handleConfirmPayment = async () => {
    if (!orderData?.orderNo) return;

    setLoading(true);
    try {
      const result = await orderApi.confirmPayment(orderData.orderNo);

      if (!result.success) {
        addToast({ message: result.message || '支付确认失败', type: 'error' });
        setLoading(false);
        return;
      }

      clearCart();
      setStep('success');
      addToast({
        message: '支付确认成功！我们会尽快处理您的订单',
        type: 'success',
      });
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      clearCart();
      setStep('success');
      addToast({
        message: '订单已提交，请留意您的联系方式获取通知',
        type: 'success',
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 格式化倒计时
  // ============================================
  const formatCountdown = (seconds: number): string => {
    if (seconds <= 0) return '已过期';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ============================================
  // 获取支付指引文字
  // ============================================
  const getPaymentInstructionsDisplay = () => {
    if (paymentInstructions) {
      const { instructions, methodType, amount } = paymentInstructions;
      switch (methodType) {
        case 'usdt_trc20':
          return {
            title: 'USDT-TRC20 转账支付',
            steps: [
              '请使用支持 TRC20 的钱包（如 Binance、OKX、Bitget）',
              `向下方地址转账 ${amount}`,
              '转账完成后，点击"确认已支付"提交',
            ],
            address: instructions.address || '暂无地址，请联系客服',
          };
        case 'kbzpay':
          return {
            title: 'KBZPay 扫码支付',
            steps: [
              '打开 KBZPay App',
              '扫描下方二维码或输入商户号',
              `输入支付金额 ${amount} 并确认`,
              '支付完成后，点击"确认已支付"提交',
            ],
            address: instructions.merchantCode
              ? `收款商户: ${instructions.merchantCode}`
              : '暂无商户信息，请联系客服',
          };
        case 'ayapay':
          return {
            title: 'AYAPay 扫码支付',
            steps: [
              '打开 AYAPay App',
              '扫描下方二维码或输入商户号',
              `输入支付金额 ${amount} 并确认`,
              '支付完成后，点击"确认已支付"提交',
            ],
            address: instructions.merchantCode
              ? `收款商户: ${instructions.merchantCode}`
              : '暂无商户信息，请联系客服',
          };
        default:
          break;
      }
    }

    // 回退：显示基本支付信息
    return {
      title: displayMethodName || '支付',
      steps: ['请按所选支付方式完成支付', '支付完成后点击"确认已支付"提交'],
      address: '',
    };
  };

  // ============================================
  // 渲染：Hydration 期间的 loading 状态
  // ============================================
  if (!clientReady) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================
  // 渲染：空购物车（URL 直达支付步骤时，跳过此检查）
  // ============================================
  if (items.length === 0 && step !== 'success' && step !== 'payment') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">购物车是空的</h2>
            <p className="text-gray-500 mb-4">请先添加商品后再进行结算</p>
            <button
              onClick={() => router.push('/shop')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              去商城逛逛
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================
  // 获取支付指引
  // ============================================
  const instructions = getPaymentInstructionsDisplay();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container-custom py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 ${
                  step === 'form' ? 'text-primary-500' : 'text-green-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === 'form'
                      ? 'bg-primary-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {step !== 'form' ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium">填写订单</span>
              </div>
              <div className="w-20 h-0.5 bg-gray-300" />
              <div
                className={`flex items-center gap-2 ${
                  step === 'payment'
                    ? 'text-primary-500'
                    : step === 'success'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === 'success'
                      ? 'bg-green-500 text-white'
                      : step === 'payment'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {step === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    '2'
                  )}
                </div>
                <span className="font-medium">完成支付</span>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 步骤1: 填写订单 */}
          {/* ============================================ */}
          {step === 'form' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Info */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">联系方式</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          邮箱地址
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="用于接收订单通知"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          手机号码
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="用于接收订单通知"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      至少填写一项，订单通知将发送给您
                    </p>
                  </div>

                  {/* Payment Method - Dynamic from API ONLY */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">支付方式</h2>
                    {methodsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : paymentMethods.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                selectedMethodId: method.id,
                              })
                            }
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                              formData.selectedMethodId === method.id
                                ? 'border-primary-500 bg-primary-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                                formData.selectedMethodId === method.id
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {method.currency === 'USDT'
                                ? '₮'
                                : method.currency === 'MMK'
                                ? 'K'
                                : '¥'}
                            </div>
                            <div className="text-center">
                              <span className="font-semibold text-sm block">
                                {method.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {CURRENCY_SYMBOLS[method.currency as PaymentCurrency] || ''}{' '}
                                {method.currency}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      // 无可用支付方式时的错误提示（不再硬编码回退）
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertTriangle className="w-10 h-10 text-yellow-500 mb-3" />
                        <p className="text-gray-600 font-medium">暂无可用支付方式</p>
                        <p className="text-sm text-gray-400 mt-1">
                          请联系客服或稍后再试
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Remark */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">备注（可选）</h2>
                    <textarea
                      value={formData.remark}
                      onChange={(e) =>
                        setFormData({ ...formData, remark: e.target.value })
                      }
                      placeholder="有什么想告诉我们的吗？"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="glass rounded-2xl p-6 sticky top-24">
                    <h2 className="text-lg font-semibold mb-4">订单摘要</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-3"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              x {item.quantity}
                            </p>
                            <p className="text-primary-600 font-semibold">
                              {currencySymbol}
                              {item.product.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>合计</span>
                        <span className="text-primary-600">
                          {currencySymbol}
                          {totalPrice.toFixed(2)}
                        </span>
                      </div>
                      {quoteData && (
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          应付: {CURRENCY_SYMBOLS[quoteData.payCurrency] || ''}
                          {quoteData.payAmountRaw > 0
                            ? quoteData.payCurrency === 'USDT'
                              ? (quoteData.payAmountRaw / 1000000).toFixed(2)
                              : (quoteData.payAmountRaw / 100).toFixed(0)
                            : ''}{' '}
                          {quoteData.payCurrency}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 py-4 bg-gradient-to-r from-primary-500 to-orange-600 text-white font-semibold rounded-xl btn-hover disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                      提交订单
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ============================================ */}
          {/* 步骤2: 完成支付 */}
          {/* ============================================ */}
          {step === 'payment' && orderData && (
            <div className="max-w-lg mx-auto">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">订单已创建</h2>
                <p className="text-gray-600 mb-1">订单号</p>
                <p className="text-xl font-mono font-bold text-primary-600 mb-6 select-all">
                  {orderData.orderNo}
                </p>

                {/* 倒计时 */}
                {countdown > 0 && (
                  <div className="flex items-center justify-center gap-2 mb-4 text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-600 font-medium">
                      请在 {formatCountdown(countdown)} 内完成支付
                    </span>
                  </div>
                )}
                {countdown === 0 && quoteData?.expiresAt && (
                  <div className="flex items-center justify-center gap-2 mb-4 text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 font-medium">
                      报价已过期，请返回重新下单
                    </span>
                  </div>
                )}

                {/* 支付指引 */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {instructions.title}
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                    {instructions.steps.map((stepText, idx) => (
                      <li key={idx}>{stepText}</li>
                    ))}
                  </ol>

                  {instructions.address && (
                    <div className="mt-4 bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">收款信息</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-gray-800 flex-1 break-all select-all">
                          {instructions.address}
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(instructions.address);
                            addToast({ message: '已复制', type: 'success' });
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                        >
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-3xl font-bold text-primary-600 mb-4">
                  {orderData.payAmount || `${currencySymbol}${totalPrice.toFixed(2)}`}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  支付方式：
                  {displayMethodName || orderData.paymentMethod || ''}
                </p>

                <button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl btn-hover disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  确认已支付{' '}
                  {orderData.payAmount ||
                    `${currencySymbol}${totalPrice.toFixed(2)}`}
                </button>

                <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  支付由平台担保，请放心交易
                </p>

                <button
                  onClick={() => setStep('form')}
                  className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
                >
                  返回修改订单
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* 步骤3: 支付成功 */}
          {/* ============================================ */}
          {step === 'success' && (
            <div className="max-w-md mx-auto">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">支付确认成功！</h2>
                {orderData && (
                  <p className="text-gray-600 mb-1">
                    订单号: {orderData.orderNo}
                  </p>
                )}
                <p className="text-gray-500 text-sm mb-6">
                  我们会尽快处理您的订单，请留意联系方式获取通知
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-green-800 text-sm">
                    订单处理完成后，您将收到邮件或短信通知。如需查询订单进度，请使用订单号在查询页面查看。
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => router.push('/query')}
                    className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl btn-hover"
                  >
                    查看订单
                  </button>
                  <button
                    onClick={() => router.push('/shop')}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    继续购物
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
