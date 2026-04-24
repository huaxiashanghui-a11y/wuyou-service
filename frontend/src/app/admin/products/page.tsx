'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  RefreshCw,
  Download,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Package,
  Tag,
  Image,
  DollarSign,
  Archive
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  stock: number;
  sales: number;
  images: string;
  status: string;
  is_featured: number;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page, status, category, keyword]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (status) params.append('status', status);

      const res = await fetch(`/api/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.code === 200) {
        setProducts(data.data.list || []);
        setTotal(data.data.total || 0);
      } else {
        // 模拟数据
        setProducts([
          {
            id: 1,
            name: '示例产品',
            description: '这是一个示例产品描述',
            price: 99.00,
            original_price: 199.00,
            category: '数码电器',
            stock: 100,
            sales: 50,
            images: '',
            status: 'active',
            is_featured: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);
        setTotal(1);
      }
    } catch (error) {
      console.error('获取产品列表失败:', error);
      // 模拟数据
      setProducts([
        {
          id: 1,
          name: '示例产品',
          description: '这是一个示例产品描述',
          price: 99.00,
          original_price: 199.00,
          category: '数码电器',
          stock: 100,
          sales: 50,
          images: '',
          status: 'active',
          is_featured: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
      setTotal(1);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', '产品名称', '分类', '价格', '原价', '库存', '销量', '状态'].join(','),
      ...products.map(p => [
        p.id, p.name, p.category, p.price, p.original_price || '-',
        p.stock, p.sales, p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      'active': { bg: 'bg-green-100', text: 'text-green-700' },
      'inactive': { bg: 'bg-gray-100', text: 'text-gray-700' },
      'sold_out': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    const labels: Record<string, string> = {
      'active': '上架',
      'inactive': '下架',
      'sold_out': '售罄',
    };

    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const categories = [
    '全部', '餐饮美食', '服装鞋帽', '数码电器', '美妆护肤',
    '家居用品', '母婴用品', '图书文具', '运动户外', '其他'
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span>产品管理</span>
          <span>/</span>
          <span className="text-gray-700">产品列表</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">产品列表</h1>
            <p className="text-gray-500 mt-1">管理平台所有产品，共 {total} 件</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">刷新</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#67C23A] text-white rounded-lg hover:bg-[#5DAF34] transition-colors">
              <Plus className="w-4 h-4" />
              <span>添加产品</span>
            </button>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索产品名称..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB]"
              />
            </div>

            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              {categories.map(cat => (
                <option key={cat} value={cat === '全部' ? '' : cat}>{cat}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部状态</option>
              <option value="active">上架</option>
              <option value="inactive">下架</option>
              <option value="sold_out">售罄</option>
            </select>
          </div>
        </div>

        {/* 产品表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">产品信息</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">价格</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">库存/销量</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">添加时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      暂无产品数据
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            {product.images ? (
                              <img src={product.images.split(',')[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                          {product.is_featured === 1 && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              精品
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {product.category || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800">¥{product.price?.toFixed(2)}</p>
                          {product.original_price && (
                            <p className="text-sm text-gray-400 line-through">¥{product.original_price?.toFixed(2)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{product.stock || 0}</p>
                        <p className="text-sm text-gray-500">{product.sales || 0} 销量</p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {formatDate(product.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            title="查看"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {total > pageSize && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                显示 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}，共 {total} 条
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <span className="px-3 py-1 text-gray-700">
                  第 {page} / {Math.ceil(total / pageSize)} 页
                </span>
                <button
                  onClick={() => setPage(Math.min(Math.ceil(total / pageSize), page + 1))}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 产品详情弹窗 */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">产品详情</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {selectedProduct.images ? (
                        <img src={selectedProduct.images.split(',')[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{selectedProduct.name}</p>
                      <p className="text-gray-500">ID: {selectedProduct.id}</p>
                      {selectedProduct.is_featured === 1 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mt-1 inline-block">
                          精品推荐
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">分类</p>
                      <p className="font-medium text-gray-800">{selectedProduct.category || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">状态</p>
                      <p className="font-medium">{getStatusBadge(selectedProduct.status)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">售价</p>
                      <p className="font-medium text-gray-800">¥{selectedProduct.price?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">原价</p>
                      <p className="font-medium text-gray-800 line-through">¥{selectedProduct.original_price?.toFixed(2) || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">库存</p>
                      <p className="font-medium text-gray-800">{selectedProduct.stock || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">销量</p>
                      <p className="font-medium text-gray-800">{selectedProduct.sales || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-gray-500 text-sm">产品描述</p>
                      <p className="font-medium text-gray-800">{selectedProduct.description || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-gray-500 text-sm">添加时间</p>
                      <p className="font-medium text-gray-800">{formatDate(selectedProduct.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
