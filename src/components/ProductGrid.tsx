'use client';

import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  loading?: boolean;
}

export default function ProductGrid({
  products,
  title = '热门商品',
  showViewAll = true,
  viewAllLink = '/shop',
  loading = false
}: ProductGridProps) {
  if (loading) {
    return (
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">{title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <div className="h-48 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-6 skeleton rounded" />
                  <div className="h-4 skeleton rounded w-2/3" />
                  <div className="h-8 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="container-custom">
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-gray-500">暂无商品</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-custom">
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
  );
}
