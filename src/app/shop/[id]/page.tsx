'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, CheckCircle, Star, Shield, Zap, ChevronRight, Mail, Minus, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore, useToastStore } from '@/lib/store';

// 模拟商品数据
const productsData: Record<string, Product> = {
  '1': {
    id: '1',
    name: '王者荣耀点卡 100元',
    description: '官方直充，快速到账，安全可靠。支持微信、支付宝、QQ钱包等多种支付方式。充值后直接到账游戏账户，无需等待。',
    price: 95,
    originalPrice: 100,
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800&h=600&fit=crop',
    category: 'game',
    stock: 999,
    sold: 5200,
    featured: true,
    status: 'active',
    sort: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  '2': {
    id: '2',
    name: '原神月卡 30元',
    description: '原神祈月礼遇，快速充值。购买后立即到账，畅享原神世界。',
    price: 28,
    originalPrice: 30,
    image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=600&fit=crop',
    category: 'game',
    stock: 999,
    sold: 3500,
    featured: true,
    status: 'active',
    sort: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  '3': {
    id: '3',
    name: 'Steam充值卡 100美元',
    description: 'Steam钱包充值码，全球通用。适用于Steam平台所有消费。',
    price: 680,
    originalPrice: 720,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop',
    category: 'game',
    stock: 50,
    sold: 1200,
    featured: true,
    status: 'active',
    sort: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      const productData = productsData[productId];
      setProduct(productData || null);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    addToast('success', `已添加 ${product.name} x${quantity} 到购物车`);
  };

  const handleBuyNow = async () => {
    if (!product || !email) {
      addToast('error', '请填写邮箱地址');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('error', '请输入有效的邮箱地址');
      return;
    }

    setPurchasing(true);
    
    try {
      // 模拟购买流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `WY${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      addToast('success', '购买成功！即将跳转订单页面...');
      router.push(`/query?orderId=${orderId}`);
    } catch (error) {
      addToast('error', '购买失败，请稍后重试');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 skeleton rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 skeleton rounded w-3/4" />
              <div className="h-6 skeleton rounded w-1/2" />
              <div className="h-32 skeleton rounded" />
              <div className="h-12 skeleton rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-8">
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">商品不存在</p>
          <Link href="/shop" className="text-primary-500 hover:text-primary-600 font-medium">
            返回商城
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary-500">首页</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-primary-500">点卡商城</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="relative h-[400px] lg:h-[500px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                -{discount}%
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          {product.featured && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                热门推荐
              </span>
            </div>
          )}

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-primary-500">
                ¥{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              销量 {product.sold} | 库存 {product.stock}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-medium">秒级到账</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">安全可靠</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">官方渠道</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">购买数量</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-primary-500 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 h-10 text-center border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-primary-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              接收邮箱 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="购买后卡密将发送到此邮箱"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Buy Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gray-100 text-gray-800 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>加入购物车</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={purchasing || product.stock === 0}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{purchasing ? '处理中...' : '立即购买'}</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            支付成功后，卡密将自动发送到您的邮箱
          </p>
        </div>
      </div>
    </div>
  );
}
