'use client';

import { useState } from 'react';
import { Upload, Download, Search, Package, CreditCard, CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';
import { Card } from '@/lib/types';

// 模拟卡密数据
const initialCards: Card[] = [
  { id: '1', productId: '1', productName: '王者荣耀点卡 100元', code: 'WYRC-ABCD-1234-5678', status: 'available', createdAt: '2024-01-15 10:30' },
  { id: '2', productId: '1', productName: '王者荣耀点卡 100元', code: 'WYRC-ABCD-1234-5679', status: 'used', usedAt: '2024-01-15 12:00', createdAt: '2024-01-15 10:30' },
  { id: '3', productId: '2', productName: '原神月卡 30元', code: 'YSYK-EFGH-9876-5432', status: 'available', createdAt: '2024-01-15 11:00' },
  { id: '4', productId: '3', productName: 'Steam充值卡 100美元', code: 'STMC-IJKL-2468-1357', password: 'PWD123', status: 'available', createdAt: '2024-01-15 12:00' },
  { id: '5', productId: '2', productName: '原神月卡 30元', code: 'YSYK-EFGH-9876-5433', status: 'used', usedAt: '2024-01-15 14:00', createdAt: '2024-01-15 11:00' },
];

const products = [
  { id: '1', name: '王者荣耀点卡 100元' },
  { id: '2', name: '原神月卡 30元' },
  { id: '3', name: 'Steam充值卡 100美元' },
  { id: '4', name: '腾讯视频VIP月卡' },
];

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'used'>('all');

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = !selectedProduct || card.productId === selectedProduct;
    const matchesStatus = filterStatus === 'all' || card.status === filterStatus;
    return matchesSearch && matchesProduct && matchesStatus;
  });

  const stats = {
    total: cards.length,
    available: cards.filter(c => c.status === 'available').length,
    used: cards.filter(c => c.status === 'used').length
  };

  const handleImport = () => {
    if (!selectedProduct || !importData.trim()) {
      alert('请选择商品并输入卡密数据');
      return;
    }

    const lines = importData.trim().split('\n');
    const productName = products.find(p => p.id === selectedProduct)?.name || '';
    
    const newCards = lines
      .map((line) => {
        const parts = line.split(',').map(s => s.trim());
        return {
          id: `card-${Date.now()}-${Math.random()}`,
          productId: selectedProduct,
          productName,
          code: parts[0] || '',
          password: parts[1] || undefined,
          status: 'available' as const,
          createdAt: new Date().toLocaleString()
        };
      })
      .filter(c => c.code);

    setCards([...newCards, ...cards]);
    setShowImportModal(false);
    setImportData('');
    alert(`成功导入 ${newCards.length} 个卡密`);
  };

  const handleExport = () => {
    const availableCards = filteredCards.filter(c => c.status === 'available');
    if (availableCards.length === 0) {
      alert('没有可导出的卡密');
      return;
    }

    const csv = availableCards.map(c =>
      `${c.code}${c.password ? ',' + c.password : ''},${c.productName}`
    ).join('\n');

    const blob = new Blob([`卡密${importData.includes(',') ? ',密码' : ''},商品\n${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cards-export-${Date.now()}.csv`;
    a.click();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个卡密吗？')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">卡密管理</h1>
          <p className="text-gray-500">批量导入、导出和管理卡密</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>批量导入</span>
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>导出卡密</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总卡密数</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">可用卡密</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已使用</p>
              <p className="text-2xl font-bold text-gray-600">{stats.used}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索卡密或商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          >
            <option value="">所有商品</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          >
            <option value="all">全部状态</option>
            <option value="available">可用</option>
            <option value="used">已使用</option>
          </select>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">卡密</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">密码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">{card.productName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">{card.code}</code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-gray-500">
                      {card.password || '-'}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      card.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {card.status === 'available' ? '可用' : '已使用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{card.createdAt}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">批量导入卡密</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择商品</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                >
                  <option value="">请选择商品</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">卡密数据</label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-mono text-sm resize-none"
                  rows={10}
                  placeholder="格式：卡密,密码（密码可选）
示例：
ABC123456789
DEF987654321,PWD123
GHI555555555"
                />
                <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>每行一个卡密，如有密码用逗号分隔。支持批量粘贴。</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                导入卡密
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
