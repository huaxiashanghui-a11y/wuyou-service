'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  RefreshCw,
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
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

// 支付方式列表
const PAYMENT_METHODS = [
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信' },
  { value: 'manual', label: '人工充值' },
  { value: 'bocoin', label: '波币钱包送5%' },
  { value: 'unionpay', label: '银联转账' },
  { value: 'digital_rmb', label: '数字人民币' },
];

// 设备类型选项
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

  // 筛选状态
  const [activeTab, setActiveTab] = useState('all');
  const [keyword, setKeyword] = useState('');

  // 排序状态
  const [sortField, setSortField] = useState('sort_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 模态框状态
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

  // 删除确认
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

  const handleRefresh = () => {
    fetchData();
  };

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
    if (!formData.payment_method) {
      alert('请选择支付方式');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = '/api/admin/finance';
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

      const res = await fetch(url, {
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

  const handleToggleStatus = async (id: number, currentStatus: number) => {
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const getPaymentMethodName = (method: string) => {
    const found = PAYMENT_METHODS.find(m => m.value === method);
    return found ? found.label : method;
  };

  const getTabCount = (tab: string) => {
    if (tab === 'all') return total;
    return channels.filter(c => {
      if (tab === 'disabled') return c.status === 0;
      return c.payment_method === tab;
    }).length;
  };

  // 排序图标组件
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortOrder === 'asc'
      ? <ChevronUp className="w-4 h-4 text-[#3498DB]" />
      : <ChevronDown className="w-4 h-4 text-[#3498DB]" />;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span>资金管理</span>
          <span>/</span>
          <span className="text-gray-700">支付配置</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">支付渠道配置</h1>
            <p className="text-gray-500 mt-1">管理平台支付渠道和手续费设置</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>刷新</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#3498DB] text-[#3498DB] rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {/* 支付方式筛选标签 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#3498DB] text-white'
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">商户名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">支付方式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">设备类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">随机支付分组</th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('fee_rate')}
                  >
                    <div className="flex items-center gap-1">
                      手续费比例
                      <SortIcon field="fee_rate" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">支付层级</th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sort_order')}
                  >
                    <div className="flex items-center gap-1">
                      排序
                      <SortIcon field="sort_order" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : channels.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  channels.map((channel) => (
                    <tr key={channel.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{channel.name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {channel.merchant_name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                          {channel.payment_method_name || getPaymentMethodName(channel.payment_method)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {channel.device_type || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {channel.random_group || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${channel.fee_rate > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {channel.fee_rate > 0 ? `${(channel.fee_rate * 100).toFixed(2)}%` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(channel.id, channel.status)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            channel.status === 1
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
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
                      <td className="px-4 py-3 text-gray-600">
                        {channel.payment_level || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {channel.sort_order}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(channel)}
                            className="p-1.5 text-gray-500 hover:text-[#3498DB] hover:bg-blue-50 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(channel.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              显示 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)}，共 {total} 条
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                上一页
              </button>
              <span className="px-3 py-1.5 text-gray-700 text-sm">
                第 {page} / {totalPages} 页
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 添加/编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{modalTitle}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  渠道名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入渠道名称"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  商户名称
                </label>
                <input
                  type="text"
                  value={formData.merchant_name}
                  onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
                  placeholder="请输入商户名称"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  支付方式 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  设备类型
                </label>
                <select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                >
                  {DEVICE_TYPES.map((device) => (
                    <option key={device.value} value={device.value}>
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  随机支付分组
                </label>
                <input
                  type="text"
                  value={formData.random_group}
                  onChange={(e) => setFormData({ ...formData, random_group: e.target.value })}
                  placeholder="如: A组, B组"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  手续费比例 (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.fee_rate}
                  onChange={(e) => setFormData({ ...formData, fee_rate: e.target.value })}
                  placeholder="如: 0.5"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  支付层级
                </label>
                <input
                  type="text"
                  value={formData.payment_level}
                  onChange={(e) => setFormData({ ...formData, payment_level: e.target.value })}
                  placeholder="如: 一级, 二级"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  排序
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  placeholder="数值越小越靠前"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-500 mb-6">确定要删除该支付渠道吗？此操作不可撤销。</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteId(null);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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