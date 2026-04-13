'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, CheckCircle, Star, Shield, Zap, ChevronRight } from 'lucide-react'

interface ProductDetailClientProps {
  product: any
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuy = async () => {
    if (!email) {
      alert('请输入邮箱地址')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          email
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/query?orderId=${data.orderId}`)
      } else {
        alert(data.message || '下单失败')
      }
    } catch (error) {
      alert('下单失败，请稍后重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-primary-500">首页</a>
        <ChevronRight className="w-4 h-4" />
        <a href="/shop" className="hover:text-primary-500">点卡商城</a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="relative h-[400px] lg:h-[500px]">
            <Image
              src={product.image || 'https://via.placeholder.com/500x500'}
              alt={product.name}
              fill
              className="object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
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
                <Star className="w-4 h-4 mr-1" />
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
              销量 {product.sold || 0} | 库存 {product.stock}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Zap className="w-6 h-6 mx-auto mb-2 text-primary-500" />
              <p className="text-sm font-medium">秒级到账</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Shield className="w-6 h-6 mx-auto mb-2 text-secondary-500" />
              <p className="text-sm font-medium">安全可靠</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
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
                -
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
                +
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              接收邮箱 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="购买后卡密将发送到此邮箱"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuy}
            disabled={isProcessing || product.stock === 0}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{isProcessing ? '处理中...' : '立即购买'}</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            支付成功后，卡密将自动发送到您的邮箱
          </p>
        </div>
      </div>
    </div>
  )
}
