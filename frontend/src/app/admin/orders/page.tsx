'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  RefreshCw,
  Download,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  AlertCircle
} from 'lucide-react';

interface Order {
  id: number;
  order_no: string;
  user_id: number;
  username: string;
  nickname: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_status: string;
  created_at: string;
  updated_at: string;
  // 多币种对账字段
  buyer_email?: string;
  buyer_phone?: string;
  currency?: string;
  order_currency?: string;
  order_amount_minor?: number;
  pay_currency?: string;
  pay_amount_minor_or_micro?: number;
  fx_rate_snapshot?: string;
  quote_expires_at?: string;
  pay_status?: string;
  order_status?: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [page, status, paymentStatus, keyword]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('未登录');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (keyword) params.append('keyword', keyword);
      if (status) params.append('status', status);
      if (paymentStatus) params.append('payment_status', paymentStatus);

      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.code === 200) {
        setOrders(data.data?.list || []);
        setTotal(data.data?.total || 0);
      } else {
        console.error('获取订单列表失败:', data.message);
        setOrders([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['订单号', '用户', '金额', '支付状态', '订单状态', '下单时间'].join(','),
      ...orders.map(o => [
        o.order_no, o.nickname || o.username, o.total_amount,
        o.payment_status, o.status, o.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string, type: 'order' | 'payment' | 'shipping') => {
    if (type === 'payment') {
      const styles: Record<string, { bg: string; text: string }> = {
        'paid': { bg: 'bg-green-100', text: 'text-green-700' },
        'UNPAID': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        'unpaid': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        'refunded': { bg: 'bg-gray-100', text: 'text-gray-700' },
      };
      const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
      const labels: Record<string, string> = {
        'paid': '已支付',
        'UNPAID': '未支付',
        'unpaid': '未支付',
        'refunded': '已退款',
      };
      return <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{labels[status] || status}</span>;
    }

    if (type === 'shipping') {
      const styles: Record<string, { bg: string; text: string }> = {
        'shipped': { bg: 'bg-blue-100', text: 'text-blue-700' },
        'unshipped': { bg: 'bg-gray-100', text: 'text-gray-700' },
        'delivered': { bg: 'bg-green-100', text: 'text-green-700' },
      };
      const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
      const labels: Record<string, string> = {
        'shipped': '已发货',
        'unshipped': '未发货',
        'delivered': '已收货',
      };
      return <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{labels[status] || status}</span>;
    }

    // order status
    const styles: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'paid': 'bg-blue-100 text-blue-700',
      'processing': 'bg-indigo-100 text-indigo-700',
      'delivered': 'bg-green-100 text-green-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
      'NEW': 'bg-gray-100 text-gray-700',
      'confirmed': 'bg-blue-100 text-blue-700',
    };
    const stylesSimple: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'paid': 'bg-blue-100 text-blue-700',
      'processing': 'bg-indigo-100 text-indigo-700',
      'delivered': 'bg-green-100 text-green-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
      'NEW': 'bg-gray-100 text-gray-700',
      'confirmed': 'bg-blue-100 text-blue-700',
    };
    const styleClass = stylesSimple[status] || 'bg-gray-100 text-gray-700';
    const labels: Record<string, string> = {
      'pending': '待处理',
      'paid': '已支付',
      'processing': '处理中',
      'delivered': '已发货',
      'completed': '已完成',
      'cancelled': '已取消',
      'NEW': '新建',
      'confirmed': '已确认',
    };
    return <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${styleClass}`}>{labels[status] || status}</span>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  // 格式化多币种金额显示
  const formatPayAmount = (minorOrMicro: number | undefined, currency: string | undefined): string => {
    if (minorOrMicro === undefined || minorOrMicro === null) return '-';
    switch (currency?.toUpperCase()) {
      case 'USDT':
        return `$${(minorOrMicro / 1000000).toFixed(2)} (${minorOrMicro} micro)`;
      case 'CNY':
        return `¥${(minorOrMicro / 100).toFixed(2)} (${minorOrMicro} 分)`;
      case 'MMK':
        return `K${(minorOrMicro / 100).toFixed(0)} (${minorOrMicro} pyas)`;
      default:
        return `${minorOrMicro}`;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span>订单管理</span>
          <span>/</span>
          <span className="text-gray-700">订单列表</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">订单列表</h1>
            <p className="text-gray-500 mt-1">管理平台所有订单，共 {total} 笔</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
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
                placeholder="搜索订单号、用户名..."
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
              <option value="confirmed">已确认</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>

            <select
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部支付</option>
              <option value="paid">已支付</option>
              <option value="unpaid">未支付</option>
              <option value="refunded">已退款</option>
            </select>
          </div>
        </div>

        {/* 订单表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">订单信息</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">支付币种</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">支付状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">订单状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">下单时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      暂无订单数据
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 font-mono text-sm">{order.order_no}</p>
                            <p className="text-sm text-gray-500">ID: {order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{order.nickname || order.username || '-'}</p>
                        <p className="text-sm text-gray-500">UID: {order.user_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">¥{order.total_amount?.toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-3">
                        {order.pay_currency ? (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {order.pay_currency}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(order.pay_status || order.payment_status, 'payment')}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(order.order_status || order.status, 'order')}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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

        {/* 订单详情弹窗 */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">订单详情</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* 订单基本信息 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-gray-800 font-mono">{selectedOrder.order_no}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">下单时间：</span>
                        <span className="text-gray-800">{formatDate(selectedOrder.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">订单金额：</span>
                        <span className="text-gray-800 font-bold">¥{selectedOrder.total_amount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 状态信息 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">支付状态</p>
                      {getStatusBadge(selectedOrder.pay_status || selectedOrder.payment_status, 'payment')}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">订单状态</p>
                      {getStatusBadge(selectedOrder.order_status || selectedOrder.status, 'order')}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-gray-500 text-sm mb-1">配送状态</p>
                      {getStatusBadge(selectedOrder.shipping_status || '-', 'shipping')}
                    </div>
                  </div>

                  {/* 多币种对账信息（验收标准 #6） */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      多币种对账信息
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">订单币种：</span>
                        <span className="text-gray-800 font-medium">
                          {selectedOrder.order_currency || selectedOrder.currency || 'CNY'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">订单金额 (minor)：</span>
                        <span className="text-gray-800 font-medium">
                          {selectedOrder.order_amount_minor !== undefined && selectedOrder.order_amount_minor !== null
                            ? formatPayAmount(selectedOrder.order_amount_minor, selectedOrder.order_currency || 'CNY')
                            : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">支付币种：</span>
                        <span className="text-gray-800 font-medium">
                          {selectedOrder.pay_currency || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">支付金额 (minor/micro)：</span>
                        <span className="text-gray-800 font-medium">
                          {formatPayAmount(selectedOrder.pay_amount_minor_or_micro, selectedOrder.pay_currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">汇率快照：</span>
                        <span className="text-gray-800 font-mono text-xs">
                          {selectedOrder.fx_rate_snapshot || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">报价过期时间：</span>
                        <span className="text-gray-800">
                          {selectedOrder.quote_expires_at
                            ? formatDate(selectedOrder.quote_expires_at)
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 用户信息 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3">用户信息</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">用户：</span>
                        <span className="text-gray-800">{selectedOrder.nickname || selectedOrder.username || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">用户ID：</span>
                        <span className="text-gray-800">{selectedOrder.user_id}</span>
                      </div>
                      {selectedOrder.buyer_email && (
                        <div>
                          <span className="text-gray-500">邮箱：</span>
                          <span className="text-gray-800">{selectedOrder.buyer_email}</span>
                        </div>
                      )}
                      {selectedOrder.buyer_phone && (
                        <div>
                          <span className="text-gray-500">手机：</span>
                          <span className="text-gray-800">{selectedOrder.buyer_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 订单操作 */}
                  {selectedOrder.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                        <span>确认订单</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        <XCircle className="w-4 h-4" />
                        <span>取消订单</span>
                      </button>
                    </div>
                  )}

                  {selectedOrder.payment_status === 'paid' && selectedOrder.shipping_status === 'unshipped' && (
                    <div className="pt-4 border-t border-gray-100">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Truck className="w-4 h-4" />
                        <span>确认发货</span>
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
