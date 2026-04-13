'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { Search, Filter } from 'lucide-react'

interface ShopClientProps {
  products: Product[]
  categories: { id: string; name: string }[]
}

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'sales') return b.sold - a.sold
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">点卡商城</h1>
        <p className="text-gray-600">浏览我们精选的游戏点卡和充值服务</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-all"
          >
            <option value="default">默认排序</option>
            <option value="price-low">价格从低到高</option>
            <option value="price-high">价格从高到低</option>
            <option value="sales">销量优先</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-gray-500 text-lg">未找到相关商品</p>
        </div>
      )}
    </div>
  )
}
