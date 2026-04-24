'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  RefreshCw,
  Download,
  Eye,
  DollarSign,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface FinanceStats {
  total_revenue: number;
  total_expense: number;
  total_balance: number;
  total_points: number;
  today_revenue: number;
  today_expense: number;
  month_revenue: number;
  month_expense: number;
}

interface Transaction {
  id: number;
  user_id: number;
  username: string;
  nickname: string;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  remark: string;
  created_at: string;
}

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FinanceStats>({
    total_revenue: 0,
    total_expense: 0,
    total_balance: 0,
    total_points: 0,
    today_revenue: 0,
    today_expense: 0,
    month_revenue: 0,
    month_expense: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionType, setTransactionType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);

  useEffect(() => {
    fetchData();
  }, [page, transactionType, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 获取统计数据
      const statsRes = await fetch('/api/admin/finance/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();

      // 获取交易记录
      const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
      if (transactionType) params.append('type', transactionType);
      if (dateRange) params.append('date', dateRange);

      const transRes = await fetch(`/api/admin/finance/transactions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transData = await transRes.json();

      if (statsData.code === 200) {
        setStats(statsData.data || stats);
      }

      if (transData.code === 200) {
        setTransactions(transData.data?.list || []);
        setTotal(transData.data?.total || 0);
      } else {
        setTransactions([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取财务数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', '用户', '类型', '金额', '余额', '备注', '时间'].join(','),
      ...transactions.map(t => [
        t.id, t.nickname || t.username, t.type, t.amount,
        t.balance_after, t.remark, t.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `finance_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatCurrency = (amount: number) => {
    return '¥' + amount.toFixed(2);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  const getTransactionTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      'recharge': { bg: 'bg-green-100', text: 'text-green-700', label: '充值' },
      'consume': { bg: 'bg-blue-100', text: 'text-blue-700', label: '消费' },
      'refund': { bg: 'bg-orange-100', text: 'text-orange-700', label: '退款' },
      'withdraw': { bg: 'bg-red-100', text: 'text-red-700', label: '提现' },
      'award': { bg: 'bg-purple-100', text: 'text-purple-700', label: '奖励' },
      'adjust': { bg: 'bg-gray-100', text: 'text-gray-700', label: '调整' },
    };
    const style = styles[type] || { bg: 'bg-gray-100', text: 'text-gray-700', label: type };
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span className="text-gray-700">财务管理</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">财务报表</h1>
            <p className="text-gray-500 mt-1">查看平台财务状况</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">总收入</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.total_revenue)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">总支出</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.total_expense)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">平台余额</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.total_balance)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Coins className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">积分总量</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total_points.toLocaleString()}</p>
          </div>
        </div>

        {/* 收支对比 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-gray-800">今日收支</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">今日收入</p>
                <p className="text-xl font-bold text-green-600">+{formatCurrency(stats.today_revenue)}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">今日支出</p>
                <p className="text-xl font-bold text-red-600">-{formatCurrency(stats.today_expense)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">本月收支</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">本月收入</p>
                <p className="text-xl font-bold text-green-600">+{formatCurrency(stats.month_revenue)}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm mb-1">本月支出</p>
                <p className="text-xl font-bold text-red-600">-{formatCurrency(stats.month_expense)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <select
              value={transactionType}
              onChange={(e) => { setTransactionType(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部类型</option>
              <option value="recharge">充值</option>
              <option value="consume">消费</option>
              <option value="refund">退款</option>
              <option value="withdraw">提现</option>
              <option value="award">奖励</option>
              <option value="adjust">调整</option>
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

        {/* 交易记录表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">余额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备注</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      暂无交易记录
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{transaction.nickname || transaction.username || '-'}</p>
                        <p className="text-sm text-gray-500">UID: {transaction.user_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        {getTransactionTypeBadge(transaction.type)}
                      </td>
                      <td className="px-4 py-3">
                        <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {formatCurrency(transaction.balance_after)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {transaction.remark || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {formatDate(transaction.created_at)}
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
      </div>
    </AdminLayout>
  );
}
