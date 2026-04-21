'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    window.location.href = '/checkout';
  };

  const discountPercent = product.originalPrice > 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div className="card-dark overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square bg-dark-primary overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3" />
              热门
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-sm font-bold text-text-primary truncate mb-2 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-text-muted line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          {/* Price & Sales */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-orange-500 font-bold text-lg">¥{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-text-muted line-through">
                  ¥{product.originalPrice}
                </span>
              )}
            </div>
            {product.sold > 0 && (
              <span className="text-xs text-text-muted">
                已售 {product.sold.toLocaleString()}
              </span>
            )}
          </div>

          {/* Button - 立即购买 */}
          <button
            onClick={handleDirectBuy}
            className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            立即购买
          </button>
        </div>
      </div>
    </Link>
  );
}
