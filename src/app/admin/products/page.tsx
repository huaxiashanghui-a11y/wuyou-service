'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Star, Search, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  stock: number
  sold: number
  featured: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: '王者荣耀点卡 100元',
      description: '官方直充，快速到账',
      price: 95,
      originalPrice: 100,
      image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
      category: 'game',
      stock: 999,
      sold: 5200,
      featured: true
    },
    {
      id: '2',
      name: '原神月卡 30元',
      description: '原神祈月礼遇，快速充值',
      price: 28,
      originalPrice: 30,
      image: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=300&fit=crop',
      category: 'game',
      stock: 999,
      sold: 3500,
      featured: true
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'game',
    stock: 0,
    featured: false
  })

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...p, ...formData } : p
      ))
    } else {
      setProducts([...products, { id: Date.now().toString(), ...formData, sold: 0 }])
    }
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: 'game',
      stock: 0,
      featured: false
    })
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      category: product.category,
      stock: product.stock,
      featured: product.featured
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个商品吗？')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleToggleFeatured = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, featured: !p.featured } : p
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">商品管理</h1>
          <p className="text-gray-500">管理您的商品列表</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setFormData({
              name: '',
              description: '',
              price: 0,
              originalPrice: 0,
              image: '',
              category: 'game',
              stock: 0,
              featured: false
            })
            setShowModal(true)
          }}
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>添加商品</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">库存</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">销量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">热门</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || 'https://via.placeholder.com/60'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.category === 'game' ? '游戏点卡' :
                     product.category === 'gift' ? '礼品卡' :
                     product.category === 'recharge' ? '话费充值' : '增值服务'}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary-500">¥{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">¥{product.originalPrice}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.sold}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(product.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        product.featured ? 'bg-yellow-100 text-yellow-500' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${product.featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {editingProduct ? '编辑商品' : '添加商品'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none resize-none"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">价格</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">原价（选填）</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  >
                    <option value="game">游戏点卡</option>
                    <option value="gift">礼品卡</option>
                    <option value="recharge">话费充值</option>
                    <option value="support">增值服务</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">库存</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">图片URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-primary-500 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  设为热门推荐
                </label>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  {editingProduct ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
