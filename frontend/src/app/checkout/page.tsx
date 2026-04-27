'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore, useToastStore } from '@/lib/store';
import { CheckCircle, Loader2, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { orderApi } from '@/lib/api';
import { PaymentMethod, PAYMENT_METHODS, CURRENCY_SYMBOLS } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, isHydrated } = useCartStore();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    remark: '',
    paymentMethod: 'usdt_trc20' as PaymentMethod,
  });
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [clientReady, setClientReady] = useState(false);

  // 确保客户端 Hydration 完成后再渲染
  useEffect(() => {
    setClientReady(true);
  }, []);

  const totalPrice = getTotalPrice();

  // 获取当前支付方式的币种
  const currentPaymentMethod = PAYMENT_METHODS.find(m => m.id === formData.paymentMethod);
  const currencySymbol = currentPaymentMethod ? CURRENCY_SYMBOLS[currentPaymentMethod.currency] : '¥';

  // ============================================
  // 步骤1：提交订单
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email && !formData.phone) {
      addToast({ message: '请填写邮箱或手机号码', type: 'error' });
      return;
    }

    if (!formData.paymentMethod) {
      addToast({ message: '请选择支付方式', type: 'error' });
      return;
    }

    if (items.length === 0) {
      addToast({ message: '购物车是空的，请先添加商品', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const methodConfig = PAYMENT_METHODS.find(m => m.id === formData.paymentMethod)!;

      // 构建订单请求数据
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const result = await orderApi.createOrder({
        items: orderItems,
        paymentMethod: formData.paymentMethod,
        currency: methodConfig.currency,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        remark: formData.remark || undefined,
      });

      if (!result.success) {
        addToast({ message: result.message || '订单创建失败', type: 'error' });
        setLoading(false);
        return;
      }

      setOrderData(result.data);
      setStep('payment');
      addToast({ message: '订单创建成功！请完成支付', type: 'success' });
    } catch (error: any) {
      console.error('Create order error:', error);
      const errorMsg =
        error?.response?.data?.message || error?.message || '下单失败，请稍后重试';
      addToast({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 步骤2：确认支付
  // ============================================
  const handleConfirmPayment = async () => {
    if (!orderData?.orderNo) return;

    setLoading(true);
    try {
      // 调用确认支付API（用户可以在这里上传支付凭证）
      const result = await orderApi.confirmPayment(orderData.orderNo);

      if (!result.success) {
        addToast({ message: result.message || '支付确认失败', type: 'error' });
        setLoading(false);
        return;
      }

      // 支付确认成功
      clearCart();
      setStep('success');
      addToast({ message: '支付确认成功！我们会尽快处理您的订单', type: 'success' });
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      // 即使API报错也清空购物车（可能是网络问题，订单已创建）
      clearCart();
      setStep('success');
      addToast({ message: '订单已提交，请留意您的联系方式获取通知', type: 'success' });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 支付方式对应的支付指引
  // ============================================
  const getPaymentInstructions = (method: PaymentMethod) => {
    switch (method) {
      case 'usdt_trc20':
        return {
          title: 'USDT-TRC20 转账支付',
          steps: [
            '请使用支持 TRC20 的钱包（如 Binance、OKX、Bitget）',
            '向下方地址转账对应金额',
            '转账完成后，点击"确认已支付"提交',
          ],
          address: 'TRx6pF5yH5qPFjqKx7X8zPq6sV7vXy8zA1', // 示例地址
        };
      case 'kbzpay':
        return {
          title: 'KBZPay 扫码支付',
          steps: [
            '打开 KBZPay App',
            '扫描下方二维码或输入商户号',
            '输入支付金额并确认',
            '支付完成后，点击"确认已支付"提交',
          ],
          address: '收款商户: WYSZ88',
        };
      case 'ayapay':
        return {
          title: 'AYAPay 扫码支付',
          steps: [
            '打开 AYAPay App',
            '扫描下方二维码或输入商户号',
            '输入支付金额并确认',
            '支付完成后，点击"确认已支付"提交',
          ],
          address: '收款商户: WYSZ88',
        };
      default:
        return { title: '支付', steps: [], address: '' };
    }
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
  // 渲染：空购物车
  // ============================================
  if (items.length === 0 && step !== 'success') {
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
  const instructions = getPaymentInstructions(formData.paymentMethod);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <div className="container-custom py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'form' ? 'text-primary-500' : 'text-green-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === 'form' ? 'bg-primary-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {step !== 'form' ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium">填写订单</span>
              </div>
              <div className="w-20 h-0.5 bg-gray-300" />
              <div className={`flex items-center gap-2 ${
                step === 'payment' ? 'text-primary-500' : step === 'success' ? 'text-green-500' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === 'success' ? 'bg-green-500 text-white' : step === 'payment' ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  {step === 'success' ? <CheckCircle className="w-5 h-5" /> : '2'}
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
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="用于接收订单通知"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      至少填写一项，订单通知将发送给您
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">支付方式</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                            formData.paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                            formData.paymentMethod === method.id
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {method.icon}
                          </div>
                          <div className="text-center">
                            <span className="font-semibold text-sm block">{method.name}</span>
                            <span className="text-xs text-gray-500">{method.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remark */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">备注（可选）</h2>
                    <textarea
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
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
                        <div key={item.product.id} className="flex gap-3">
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
                            <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">x {item.quantity}</p>
                            <p className="text-primary-600 font-semibold">
                              {currencySymbol}{item.product.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>合计</span>
                        <span className="text-primary-600">{currencySymbol}{totalPrice.toFixed(2)}</span>
                      </div>
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
                <p className="text-xl font-mono font-bold text-primary-600 mb-6 select-all">{orderData.orderNo}</p>

                {/* 支付指引 */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">{instructions.title}</h3>
                  <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                    {instructions.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
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
                  {currencySymbol}{totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  支付方式：{currentPaymentMethod?.name}
                </p>

                <button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl btn-hover disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  确认已支付 {currencySymbol}{totalPrice.toFixed(2)}
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
                  <p className="text-gray-600 mb-1">订单号: {orderData.orderNo}</p>
                )}
                <p className="text-gray-500 text-sm mb-6">我们会尽快处理您的订单，请留意联系方式获取通知</p>

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
