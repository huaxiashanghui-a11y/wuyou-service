'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface RechargeRecord {
  id: number;
  user_id: number;
  username: string;
  nickname: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_no: string;
  created_at: string;
  processed_at?: string;
  processed_by?: number;
}

export default function RechargePage() {
  const [records, setRecords] = useState<RechargeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [selectedRecord, setSelectedRecord] = useState<RechargeRecord | null>(null);
  const [stats, setStats] = useState({ total: 0, count: 0, pending: 0 });

  useEffect(() => {
    fetchRecords();
  }, [page, status, dateRange, keyword]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (keyword) params.append('keyword', keyword);
      if (status) params.append('status', status);
      if (dateRange) params.append('date', dateRange);

      const res = await fetch(`/api/admin/payment/recharge?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.code === 200) {
        setRecords(data.data.list || []);
        setTotal(data.data.total || 0);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
      } else {
        setRecords([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取充值记录失败:', error);
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id: number, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/admin/payment/recharge', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action }),
      });

      const data = await res.json();
      if (data.code === 200) {
        fetchRecords();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('处理失败:', error);
      alert('操作失败');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', '用户', '金额', '支付方式', '状态', '交易号', '时间'].join(','),
      ...records.map(r => [
        r.id, r.nickname || r.username, r.amount, r.payment_method,
        r.status, r.transaction_no, r.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `recharge_${new Date().toISOString().split('T')[0]}.csv`;
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
      'pending': '待处理',
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span>支付管理</span>
          <span>/</span>
          <span className="text-gray-700">充值管理</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">充值管理</h1>
            <p className="text-gray-500 mt-1">管理用户充值记录</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRecords}
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

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">充值总额</p>
                <p className="text-2xl font-bold text-gray-800">¥{stats.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">充值笔数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">待处理</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户、交易号..."
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
              <option value="pending">待处理</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部时间</option>
              <option value="today">今日</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
            </select>
          </div>
        </div>

        {/* 充值表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">支付方式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">交易号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">时间</th>
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
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      暂无充值记录
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{record.nickname || record.username || '-'}</p>
                        <p className="text-sm text-gray-500">UID: {record.user_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-green-600">+¥{record.amount?.toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {record.payment_method || '微信支付'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800 font-mono text-sm">{record.transaction_no || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {formatDate(record.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            title="查看"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {record.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleProcess(record.id, 'approve')}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                title="通过"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleProcess(record.id, 'reject')}
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

        {/* 详情弹窗 */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">充值详情</h3>
                  <button onClick={() => setSelectedRecord(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">充值金额</p>
                    <p className="text-3xl font-bold text-green-600">+¥{selectedRecord.amount?.toFixed(2)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">用户</p>
                      <p className="font-medium text-gray-800">{selectedRecord.nickname || selectedRecord.username || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">状态</p>
                      <p className="font-medium">{getStatusBadge(selectedRecord.status)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">支付方式</p>
                      <p className="font-medium text-gray-800">{selectedRecord.payment_method || '微信支付'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">交易号</p>
                      <p className="font-medium text-gray-800 font-mono text-sm">{selectedRecord.transaction_no || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-gray-500 text-sm">申请时间</p>
                      <p className="font-medium text-gray-800">{formatDate(selectedRecord.created_at)}</p>
                    </div>
                  </div>

                  {selectedRecord.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => { handleProcess(selectedRecord.id, 'approve'); setSelectedRecord(null); }}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => { handleProcess(selectedRecord.id, 'reject'); setSelectedRecord(null); }}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        拒绝
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
