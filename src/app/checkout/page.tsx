'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useCartStore, useToastStore } from '@/lib/store';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const addToast = useToastStore(state => state.addToast);
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证邮箱
    const newErrors: { email?: string } = {};
    if (!email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!validateEmail(email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // 模拟下单流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 生成订单号
      const orderId = `WY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // 清空购物车
      clearCart();
      
      // 显示成功提示并跳转
      addToast('success', '购买成功！卡密将发送到您的邮箱');
      router.push(`/query?orderId=${orderId}`);
      
    } catch (error) {
      addToast('error', '下单失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">购物车是空的</p>
            <Link href="/shop" className="text-primary-500 hover:text-primary-600 font-medium">
              去逛逛
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-8">确认订单</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">商品清单</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.image || 'https://via.placeholder.com/96'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2 mb-1">{item.product.name}</h3>
                      <p className="text-primary-500 font-bold">
                        ¥{item.product.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ¥{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Form */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-500" />
                接收邮箱
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  placeholder="购买后卡密将发送到此邮箱"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">重要提示</p>
                    <p>请确保邮箱地址正确，卡密购买成功后会自动发送到您的邮箱。如未收到，请检查垃圾邮件或联系客服。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">订单摘要</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>商品件数</span>
                  <span>{items.length} 件</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>商品总价</span>
                  <span>¥{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>运费</span>
                  <span className="text-green-600">免运费</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>合计</span>
                  <span className="text-primary-500">¥{getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    处理中...
                  </span>
                ) : (
                  '确认支付'
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                点击确认支付即表示您同意我们的服务条款
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
