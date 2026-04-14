'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore, useToastStore } from '@/lib/store';
import { CreditCard, Smartphone, Gift, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

const paymentMethods = [
  { id: 'alipay', name: '支付宝', icon: Smartphone, color: 'bg-blue-500' },
  { id: 'wechat', name: '微信支付', icon: Smartphone, color: 'bg-green-500' },
  { id: 'card', name: '礼品卡', icon: Gift, color: 'bg-orange-500' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    remark: '',
    paymentMethod: 'alipay' as 'alipay' | 'wechat' | 'card',
  });
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [orderNo, setOrderNo] = useState('');

  const totalPrice = getTotalPrice();

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

    setLoading(true);

    // 模拟创建订单
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockOrderNo = `WY${Date.now()}`;
    setOrderNo(mockOrderNo);
    setStep('payment');
    setLoading(false);
  };

  const handlePay = async () => {
    setLoading(true);

    // 模拟支付
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 模拟支付成功
    setStep('success');
    clearCart();
    addToast({ message: '支付成功！卡密已发送到您的邮箱', type: 'success' });
    setLoading(false);
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">购物车是空的</h2>
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
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary-500' : step === 'success' ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step === 'success' ? 'bg-green-500 text-white' : step === 'payment' ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  {step === 'success' ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span className="font-medium">完成支付</span>
              </div>
            </div>
          </div>

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
                          placeholder="用于接收卡密"
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
                          placeholder="用于接收卡密"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      至少填写一项，卡密将在支付成功后发送给您
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">支付方式</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, paymentMethod: method.id as 'alipay' | 'wechat' | 'card' })}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              formData.paymentMethod === method.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-medium">{method.name}</span>
                          </button>
                        );
                      })}
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
                            <p className="text-sm text-gray-500">
                              × {item.quantity}
                            </p>
                            <p className="text-primary-600 font-semibold">
                              ¥{item.product.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>合计</span>
                        <span className="text-primary-600">¥{totalPrice.toFixed(2)}</span>
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

          {step === 'payment' && (
            <div className="max-w-md mx-auto">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <CreditCard className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">订单已创建</h2>
                <p className="text-gray-600 mb-4">订单号：{orderNo}</p>
                <p className="text-3xl font-bold text-primary-600 mb-8">¥{totalPrice.toFixed(2)}</p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-yellow-800 text-sm">
                    提示：这是演示版本，点击下方按钮将模拟支付成功。
                  </p>
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl btn-hover disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  确认支付 ¥{totalPrice.toFixed(2)}
                </button>

                <button
                  onClick={() => setStep('form')}
                  className="mt-4 text-gray-600 hover:text-gray-800"
                >
                  返回修改订单
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="max-w-md mx-auto">
              <div className="glass rounded-2xl p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">支付成功！</h2>
                <p className="text-gray-600 mb-4">您的卡密已发送到您的邮箱/手机</p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-green-800 text-sm">
                    恭喜！您的订单已处理完成。请查收您的邮箱或短信获取卡密。
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
