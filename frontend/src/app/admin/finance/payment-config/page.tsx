'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  CreditCard,
} from 'lucide-react';

interface PaymentChannel {
  id: number;
  name: string;
  merchant_name: string;
  payment_method: string;
  payment_method_name: string;
  device_type: string;
  random_group: string;
  fee_rate: number;
  status: number;
  status_name: string;
  payment_level: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ModalFormData {
  name: string;
  merchant_name: string;
  payment_method: string;
  device_type: string;
  random_group: string;
  fee_rate: string;
  payment_level: string;
  sort_order: string;
}

const PAYMENT_METHODS = [
  { value: 'alipay', label: '支付宝', color: 'bg-blue-100 text-blue-700' },
  { value: 'wechat', label: '微信', color: 'bg-green-100 text-green-700' },
  { value: 'manual', label: '人工充值', color: 'bg-purple-100 text-purple-700' },
  { value: 'bocoin', label: '波币钱包送5%', color: 'bg-orange-100 text-orange-700' },
  { value: 'unionpay', label: '银联转账', color: 'bg-red-100 text-red-700' },
  { value: 'digital_rmb', label: '数字人民币', color: 'bg-pink-100 text-pink-700' },
];

const DEVICE_TYPES = [
  { value: 'pc', label: 'PC' },
  { value: 'mobile', label: '移动端' },
  { value: 'all', label: '全部' },
];

export default function PaymentConfigPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState('sort_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加支付渠道');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ModalFormData>({
    name: '',
    merchant_name: '',
    payment_method: 'alipay',
    device_type: 'all',
    random_group: '',
    fee_rate: '0',
    payment_level: '',
    sort_order: '0',
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page, activeTab, sortField, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        type: 'payment',
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortField,
        sortOrder,
      });

      if (activeTab !== 'all') {
        params.append('paymentMethod', activeTab);
      }
      if (keyword) {
        params.append('keyword', keyword);
      }

      const res = await fetch(`/api/admin/finance?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.code === 200) {
        setChannels(data.data.list || []);
        setTotal(data.data.total || 0);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('获取支付渠道数据失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => fetchData();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const openAddModal = () => {
    setModalTitle('添加支付渠道');
    setEditingId(null);
    setFormData({
      name: '',
      merchant_name: '',
      payment_method: 'alipay',
      device_type: 'all',
      random_group: '',
      fee_rate: '0',
      payment_level: '',
      sort_order: '0',
    });
    setShowModal(true);
  };

  const openEditModal = (channel: PaymentChannel) => {
    setModalTitle('编辑支付渠道');
    setEditingId(channel.id);
    setFormData({
      name: channel.name,
      merchant_name: channel.merchant_name || '',
      payment_method: channel.payment_method,
      device_type: channel.device_type || 'all',
      random_group: channel.random_group || '',
      fee_rate: channel.fee_rate ? channel.fee_rate.toString() : '0',
      payment_level: channel.payment_level || '',
      sort_order: channel.sort_order ? channel.sort_order.toString() : '0',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('请输入渠道名称');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';

      const body: any = {
        type: 'payment',
        name: formData.name.trim(),
        merchant_name: formData.merchant_name.trim(),
        payment_method: formData.payment_method,
        device_type: formData.device_type,
        random_group: formData.random_group.trim(),
        fee_rate: parseFloat(formData.fee_rate) || 0,
        payment_level: formData.payment_level.trim(),
        sort_order: parseInt(formData.sort_order) || 0,
        status: 1,
      };

      if (editingId) {
        body.action = 'update';
        body.id = editingId;
      }

      const res = await fetch('/api/admin/finance', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.code === 200) {
        setShowModal(false);
        fetchData();
        alert(editingId ? '更新成功' : '添加成功');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('操作失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/finance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'payment',
          action: 'toggleStatus',
          id,
        }),
      });
      const data = await res.json();

      if (data.code === 200) {
        fetchData();
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('切换状态失败:', error);
      alert('操作失败');
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/finance', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'payment',
          ids: [deleteId],
        }),
      });
      const data = await res.json();

      if (data.code === 200) {
        setShowDeleteConfirm(false);
        setDeleteId(null);
        fetchData();
        alert('删除成功');
      } else {
        alert(data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    const found = PAYMENT_METHODS.find(m => m.value === method);
    if (!found) return <span className="badge badge-gray">{method}</span>;
    return (
      <span className={`badge ${found.color}`}>
        {found.label}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortOrder === 'asc'
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">首页</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400">资金管理</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium">支付配置</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">支付渠道配置</h1>
            <p className="text-gray-500 mt-1">管理平台支付渠道和手续费设置</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>刷新</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-all font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 支付方式筛选标签 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-1 p-2 overflow-x-auto">
            {[
              { key: 'all', label: '全部' },
              { key: 'alipay', label: '支付宝' },
              { key: 'wechat', label: '微信' },
              { key: 'manual', label: '人工充值' },
              { key: 'bocoin', label: '波币钱包送5%' },
              { key: 'unionpay', label: '银联转账' },
              { key: 'digital_rmb', label: '数字人民币' },
              { key: 'disabled', label: '已禁用' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.key === 'all' && total > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 表格 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">名称</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">商户名称</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">支付方式</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">设备类型</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">随机支付分组</th>
                  <th
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('fee_rate')}
                  >
                    <div className="flex items-center gap-1">
                      手续费比例
                      <SortIcon field="fee_rate" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">状态</th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">支付层级</th>
                  <th
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('sort_order')}
                  >
                    <div className="flex items-center gap-1">
                      排序
                      <SortIcon field="sort_order" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    </td>
                  </tr>
                ) : channels.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <CreditCard className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">暂无数据</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  channels.map((channel) => (
                    <tr key={channel.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-gray-900">{channel.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {channel.merchant_name || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        {getPaymentMethodBadge(channel.payment_method)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {channel.device_type || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {channel.random_group || '-'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`font-semibold ${channel.fee_rate > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {channel.fee_rate > 0 ? `${(channel.fee_rate * 100).toFixed(2)}%` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(channel.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                            channel.status === 1
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm'
                              : 'bg-red-100 text-red-700 hover:bg-red-200 shadow-sm'
                          }`}
                        >
                          {channel.status === 1 ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                          {channel.status === 1 ? '启用' : '禁用'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {channel.payment_level || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        {channel.sort_order}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(channel)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(channel.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              显示 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}，共 {total} 条
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                上一页
              </button>
              <span className="px-4 py-2 text-gray-700 font-medium">
                第 {page} / {totalPages} 页
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="pagination-btn"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 添加/编辑模态框 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-content overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{modalTitle}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="form-label form-label-required">渠道名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入渠道名称"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="form-label">商户名称</label>
                <input
                  type="text"
                  value={formData.merchant_name}
                  onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
                  placeholder="请输入商户名称"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="form-label form-label-required">支付方式</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="select-dark w-full"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">设备类型</label>
                <select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className="select-dark w-full"
                >
                  {DEVICE_TYPES.map((device) => (
                    <option key={device.value} value={device.value}>
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">随机支付分组</label>
                <input
                  type="text"
                  value={formData.random_group}
                  onChange={(e) => setFormData({ ...formData, random_group: e.target.value })}
                  placeholder="如: A组, B组"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="form-label">手续费比例 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.fee_rate}
                  onChange={(e) => setFormData({ ...formData, fee_rate: e.target.value })}
                  placeholder="如: 0.5"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="form-label">支付层级</label>
                <input
                  type="text"
                  value={formData.payment_level}
                  onChange={(e) => setFormData({ ...formData, payment_level: e.target.value })}
                  placeholder="如: 一级, 二级"
                  className="input-dark"
                />
              </div>

              <div>
                <label className="form-label">排序</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  placeholder="数值越小越靠前"
                  className="input-dark"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-content overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除</h3>
              <p className="text-gray-500 mb-6">确定要删除该支付渠道吗？此操作不可撤销。</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-500/25"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
