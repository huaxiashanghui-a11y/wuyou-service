'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Store,
  Phone,
  Mail,
  Calendar,
  Clock
} from 'lucide-react';

interface Merchant {
  id: number;
  user_id: number;
  shop_name: string;
  contact_phone: string;
  contact_email?: string;
  business_category: string;
  remark?: string;
  status: string;
  admin_remark?: string;
  reviewed_at?: string;
  reviewed_by?: number;
  created_at: string;
  updated_at: string;
  // 用户信息
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [adminRemark, setAdminRemark] = useState('');

  useEffect(() => {
    fetchMerchants();
  }, [page, status, category, keyword]);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (keyword) params.append('keyword', keyword);
      if (status) params.append('status', status);
      if (category) params.append('category', category);

      const res = await fetch(`/api/admin/merchants?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.code === 200) {
        setMerchants(data.data.list);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('获取商户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedMerchant) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const newStatus = reviewAction === 'approve' ? 'approved' : 'rejected';

      const res = await fetch('/api/admin/merchants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedMerchant.id,
          status: newStatus,
          admin_remark: adminRemark,
        }),
      });

      const data = await res.json();
      if (data.code === 200) {
        setShowReviewModal(false);
        setSelectedMerchant(null);
        setAdminRemark('');
        fetchMerchants();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('审核失败:', error);
      alert('操作失败');
    }
  };

  const openReviewModal = (merchant: Merchant, action: 'approve' | 'reject') => {
    setSelectedMerchant(merchant);
    setReviewAction(action);
    setAdminRemark('');
    setShowReviewModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', '商户名称', '联系人', '手机号', '邮箱', '类目', '状态', '申请时间'].join(','),
      ...merchants.map(m => [
        m.id, m.shop_name, m.contact_phone, m.contact_email || '-',
        m.business_category, m.status, m.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `merchants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'approved': { bg: 'bg-green-100', text: 'text-green-700' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    const labels: Record<string, string> = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已拒绝',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {status === 'pending' && <Clock className="w-3 h-3" />}
        {status === 'approved' && <CheckCircle className="w-3 h-3" />}
        {status === 'rejected' && <XCircle className="w-3 h-3" />}
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const categories = [
    '餐饮美食', '服装鞋帽', '数码电器', '美妆护肤',
    '家居用品', '母婴用品', '图书文具', '运动户外',
    '珠宝饰品', '汽车用品', '鲜花绿植', '其他'
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span>商家管理</span>
          <span>/</span>
          <span className="text-gray-700">商户列表</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">商户列表</h1>
            <p className="text-gray-500 mt-1">管理平台所有商户，共 {total} 家</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMerchants}
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
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索商户名称、联系人或手机号..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB]"
              />
            </div>

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>

            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 商户表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">商户信息</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">联系方式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">经营类目</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">申请时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : merchants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      暂无商户数据
                    </td>
                  </tr>
                ) : (
                  merchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Store className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{merchant.shop_name}</p>
                            <p className="text-sm text-gray-500">ID: {merchant.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {merchant.contact_phone}
                        </p>
                        {merchant.contact_email && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {merchant.contact_email}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {merchant.business_category || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(merchant.status)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(merchant.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedMerchant(merchant)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {merchant.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openReviewModal(merchant, 'approve')}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                title="通过"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openReviewModal(merchant, 'reject')}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                title="拒绝"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

        {/* 商户详情弹窗 */}
        {selectedMerchant && !showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">商户详情</h3>
                  <button
                    onClick={() => setSelectedMerchant(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Store className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{selectedMerchant.shop_name}</p>
                      <p className="text-gray-500">ID: {selectedMerchant.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">联系人</p>
                      <p className="font-medium text-gray-800">{selectedMerchant.contact_phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">联系电话</p>
                      <p className="font-medium text-gray-800">{selectedMerchant.contact_phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">经营类目</p>
                      <p className="font-medium text-gray-800">{selectedMerchant.business_category || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">状态</p>
                      <p className="font-medium">{getStatusBadge(selectedMerchant.status)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">申请时间</p>
                      <p className="font-medium text-gray-800">{formatDate(selectedMerchant.created_at)}</p>
                    </div>
                    {selectedMerchant.reviewed_at && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-500 text-sm">审核时间</p>
                        <p className="font-medium text-gray-800">{formatDate(selectedMerchant.reviewed_at)}</p>
                      </div>
                    )}
                    {selectedMerchant.remark && (
                      <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                        <p className="text-gray-500 text-sm">申请备注</p>
                        <p className="font-medium text-gray-800">{selectedMerchant.remark}</p>
                      </div>
                    )}
                    {selectedMerchant.admin_remark && (
                      <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                        <p className="text-gray-500 text-sm">审核备注</p>
                        <p className="font-medium text-gray-800">{selectedMerchant.admin_remark}</p>
                      </div>
                    )}
                  </div>

                  {selectedMerchant.status === 'pending' && (
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openReviewModal(selectedMerchant, 'approve')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>通过申请</span>
                      </button>
                      <button
                        onClick={() => openReviewModal(selectedMerchant, 'reject')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>拒绝申请</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 审核弹窗 */}
        {showReviewModal && selectedMerchant && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {reviewAction === 'approve' ? '通过申请' : '拒绝申请'}
                </h3>
                <p className="text-gray-600 mb-4">
                  商户: <span className="font-medium">{selectedMerchant.shop_name}</span>
                </p>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    审核备注
                  </label>
                  <textarea
                    value={adminRemark}
                    onChange={(e) => setAdminRemark(e.target.value)}
                    placeholder={reviewAction === 'approve' ? '可选：填写通过备注' : '请填写拒绝原因'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleReview}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                      reviewAction === 'approve'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    确认{reviewAction === 'approve' ? '通过' : '拒绝'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
