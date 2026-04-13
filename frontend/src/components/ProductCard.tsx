'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const discountPercent = product.originalPrice > 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/shop/${product.id}`}>
      <div className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Star className="w-3 h-3" />
              热门
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary-600">
                ¥{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ¥{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              已售 {product.sold}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-medium rounded-lg btn-hover flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            加入购物车
          </button>
        </div>
      </div>
    </Link>
  );
}
