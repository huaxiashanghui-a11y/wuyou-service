'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react';

interface MerchantApply {
  id: number;
  user_id: number;
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  shop_name: string;
  contact_phone: string;
  business_category: string | null;
  remark: string | null;
  status: string;
  admin_remark: string | null;
  created_at: string;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminMerchantsPage() {
  const [applies, setApplies] = useState<MerchantApply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectApplyId, setRejectApplyId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // 获取申请列表
  useEffect(() => {
    const fetchApplies = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') {
          params.set('status', statusFilter);
        }
        params.set('limit', '50');

        const response = await fetch(`/api/admin/merchants?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.success) {
          setApplies(data.data.list || []);
          setTotal(data.data.total || 0);
        }
      } catch (error) {
        console.error('获取申请列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplies();
  }, [statusFilter]);

  // 通过申请
  const handleApprove = async (id: number) => {
    if (!confirm('确认通过此申请？用户将成为平台商家。')) return;

    setProcessingId(id);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/admin/merchants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'approve',
          apply_id: id,
          admin_remark: '审核通过',
        }),
      });

      const data = await response.json();
      if (data.success) {
        // 更新列表
        setApplies(applies.map(a =>
          a.id === id ? { ...a, status: 'approved' } : a
        ));
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('通过申请失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setProcessingId(null);
    }
  };

  // 驳回申请
  const handleReject = async () => {
    if (!rejectApplyId) return;

    setProcessingId(rejectApplyId);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/admin/merchants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'reject',
          apply_id: rejectApplyId,
          admin_remark: rejectReason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setApplies(applies.map(a =>
          a.id === rejectApplyId ? { ...a, status: 'rejected', admin_remark: rejectReason } : a
        ));
        setShowRejectModal(false);
        setRejectApplyId(null);
        setRejectReason('');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('驳回申请失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setProcessingId(null);
    }
  };

  // 过滤搜索
  const filteredApplies = applies.filter(apply =>
    apply.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apply.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (apply.phone && apply.phone.includes(searchQuery))
  );

  // 状态统计
  const statusCounts = {
    all: applies.length,
    pending: applies.filter(a => a.status === 'pending').length,
    approved: applies.filter(a => a.status === 'approved').length,
    rejected: applies.filter(a => a.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '待审核', color: 'text-orange-400', bg: 'bg-orange-400/20' };
      case 'approved':
        return { label: '已通过', color: 'text-account-success', bg: 'bg-account-success/20' };
      case 'rejected':
        return { label: '已驳回', color: 'text-account-danger', bg: 'bg-account-danger/20' };
      default:
        return { label: status, color: 'text-account-secondary', bg: 'bg-account-bg' };
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Store className="w-7 h-7 text-purple-400" />
            商家入驻审核
          </h1>
          <div className="text-account-secondary">
            共 {total} 条申请
          </div>
        </div>

        {/* 状态筛选和搜索 */}
        <div className="bg-account-card rounded-xl p-4 mb-6 border border-account-border">
          <div className="flex flex-wrap items-center gap-4">
            {/* 状态筛选 */}
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-purple-500 text-white'
                      : 'bg-account-bg text-account-secondary hover:text-white'
                  }`}
                >
                  {status === 'all' ? '全部' : status === 'pending' ? '待审核' : status === 'approved' ? '已通过' : '已驳回'}
                  <span className="ml-1 opacity-70">
                    ({status === 'all' ? statusCounts.all : status === 'pending' ? statusCounts.pending : status === 'approved' ? statusCounts.approved : statusCounts.rejected})
                  </span>
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-account-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索店铺名称、用户名..."
                  className="w-full pl-10 pr-4 py-2 bg-account-bg text-white rounded-lg border border-account-border focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 申请列表 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredApplies.length === 0 ? (
          <div className="bg-account-card rounded-xl p-12 text-center border border-account-border">
            <Store className="w-16 h-16 text-account-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">暂无申请</h3>
            <p className="text-account-secondary">当前没有符合条件的商家入驻申请</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplies.map((apply) => {
              const statusBadge = getStatusBadge(apply.status);
              return (
                <div
                  key={apply.id}
                  className="bg-account-card rounded-xl p-6 border border-account-border"
                >
                  {/* 头部信息 */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{apply.shop_name}</h3>
                      <p className="text-account-secondary text-sm">
                        申请人：{apply.nickname || apply.username} (ID: {apply.user_id})
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${statusBadge.bg} ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* 详细信息 */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-account-bg rounded-lg p-3">
                      <p className="text-account-secondary text-xs mb-1">联系电话</p>
                      <p className="text-white font-medium">{apply.contact_phone}</p>
                    </div>
                    <div className="bg-account-bg rounded-lg p-3">
                      <p className="text-account-secondary text-xs mb-1">主营类目</p>
                      <p className="text-white font-medium">{apply.business_category || '-'}</p>
                    </div>
                    <div className="bg-account-bg rounded-lg p-3">
                      <p className="text-account-secondary text-xs mb-1">申请时间</p>
                      <p className="text-white font-medium">{new Date(apply.created_at).toLocaleString('zh-CN')}</p>
                    </div>
                  </div>

                  {/* 备注 */}
                  {apply.remark && (
                    <div className="bg-account-bg rounded-lg p-3 mb-4">
                      <p className="text-account-secondary text-xs mb-1">备注说明</p>
                      <p className="text-white text-sm">{apply.remark}</p>
                    </div>
                  )}

                  {/* 审核备注 */}
                  {apply.admin_remark && (
                    <div className="bg-account-primary/10 rounded-lg p-3 mb-4 border border-account-primary/20">
                      <p className="text-account-primary text-xs mb-1">审核备注</p>
                      <p className="text-white text-sm">{apply.admin_remark}</p>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  {apply.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-account-border">
                      <button
                        onClick={() => handleApprove(apply.id)}
                        disabled={processingId === apply.id}
                        className="flex-1 py-3 bg-account-success text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {processingId === apply.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        通过申请
                      </button>
                      <button
                        onClick={() => {
                          setRejectApplyId(apply.id);
                          setShowRejectModal(true);
                        }}
                        disabled={processingId === apply.id}
                        className="flex-1 py-3 bg-account-danger text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                        驳回申请
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 驳回弹窗 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-account-card rounded-2xl p-6 w-full max-w-md animate-fade-in border border-account-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-account-danger/20 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-account-danger" />
              </div>
              <h3 className="text-xl font-bold text-white">驳回申请</h3>
            </div>

            <div className="mb-6">
              <label className="text-account-secondary text-sm block mb-2">驳回原因</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入驳回原因（选填）"
                rows={3}
                className="w-full py-3 px-4 bg-account-bg text-white rounded-xl border border-account-border focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectApplyId(null);
                  setRejectReason('');
                }}
                className="flex-1 py-3 bg-account-bg text-white rounded-xl hover:bg-account-border transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleReject}
                disabled={processingId !== null}
                className="flex-1 py-3 bg-account-danger text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processingId !== null ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  '确认驳回'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}