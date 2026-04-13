'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import Link from 'next/link'

interface ProductGridProps {
  products: Product[]
  title?: string
  showViewAll?: boolean
  viewAllLink?: string
}

export default function ProductGrid({
  products,
  title = '热门商品',
  showViewAll = true,
  viewAllLink = '/shop'
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-gray-500">暂无商品</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text">{title}</h2>
          {showViewAll && (
            <Link
              href={viewAllLink}
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              查看全部 &rarr;
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
