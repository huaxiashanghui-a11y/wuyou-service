'use client'

import { Product } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/shop/${product.id}`} className="group">
      <div className="glass rounded-2xl overflow-hidden card-hover h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image || 'https://via.placeholder.com/400x300'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{discount}%
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
              <Star className="w-3 h-3 mr-1" />
              热门
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl font-bold text-primary-500">
              ¥{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>销量 {product.sold || 0}</span>
            <span className={product.stock > 10 ? 'text-green-500' : 'text-accent-500'}>
              库存 {product.stock}
            </span>
          </div>

          {/* Buy Button */}
          <button className="w-full py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group/btn">
            <ShoppingCart className="w-4 h-4" />
            <span>立即购买</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
