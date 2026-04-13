'use client';

import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useUIStore, useCartStore } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">购物车</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">购物车是空的</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                去逛逛
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.image || 'https://via.placeholder.com/80'}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-primary-500 font-bold">
                      ¥{item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-600">合计</span>
              <span className="text-2xl font-bold text-primary-500">
                ¥{getTotal().toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all"
            >
              去结算 ({items.length}件)
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
