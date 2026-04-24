'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit2,
  Trash2,
  UserX,
  UserCheck,
  RefreshCw,
  Download,
  MoreVertical,
  Crown,
  Shield,
  Star
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  balance: number;
  points: number;
  member_level: string;
  real_name: string;
  is_merchant: number;
  status: string;
  created_at: string;
  last_login: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [memberLevel, setMemberLevel] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, status, memberLevel, keyword]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (keyword) params.append('keyword', keyword);
      if (status) params.append('status', status);
      if (memberLevel) params.append('memberLevel', memberLevel);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.code === 200) {
        setUsers(data.data.list);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId, action: 'updateStatus', status: newStatus }),
      });

      const data = await res.json();
      if (data.code === 200) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新失败');
    }
    setShowActionMenu(null);
  };

  const handleResetPoints = async (userId: number) => {
    if (!confirm('确定要重置该用户的积分吗？')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId, action: 'resetPoints' }),
      });

      const data = await res.json();
      if (data.code === 200) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('重置积分失败:', error);
      alert('操作失败');
    }
    setShowActionMenu(null);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', '用户名', '昵称', '手机号', '邮箱', '会员等级', '余额', '积分', '状态', '注册时间'].join(','),
      ...users.map(u => [
        u.id, u.username, u.nickname, u.phone, u.email,
        u.member_level, u.balance, u.points, u.status, u.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getMemberLevelBadge = (level: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      'vip': { bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown },
      'svip': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Star },
      'admin': { bg: 'bg-red-100', text: 'text-red-700', icon: Shield },
    };
    const badge = badges[level] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {level || '普通'}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      'active': { bg: 'bg-green-100', text: 'text-green-700' },
      'frozen': { bg: 'bg-red-100', text: 'text-red-700' },
      'banned': { bg: 'bg-gray-100', text: 'text-gray-700' },
    };
    const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    const labels: Record<string, string> = {
      'active': '正常',
      'frozen': '冻结',
      'banned': '封禁',
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span>用户管理</span>
          <span>/</span>
          <span className="text-gray-700">用户列表</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">用户列表</h1>
            <p className="text-gray-500 mt-1">管理平台所有用户，共 {total} 人</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
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
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索用户名、昵称、手机号或邮箱..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB]"
              />
            </div>

            {/* 状态筛选 */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">
                  {status ? (status === 'active' ? '正常' : status === 'frozen' ? '冻结' : '封禁') : '全部状态'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                  <button
                    onClick={() => { setStatus(''); setShowFilterDropdown(false); setPage(1); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                  >
                    全部状态
                  </button>
                  <button
                    onClick={() => { setStatus('active'); setShowFilterDropdown(false); setPage(1); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                  >
                    正常
                  </button>
                  <button
                    onClick={() => { setStatus('frozen'); setShowFilterDropdown(false); setPage(1); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                  >
                    冻结
                  </button>
                  <button
                    onClick={() => { setStatus('banned'); setShowFilterDropdown(false); setPage(1); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                  >
                    封禁
                  </button>
                </div>
              )}
            </div>

            {/* 会员等级筛选 */}
            <select
              value={memberLevel}
              onChange={(e) => { setMemberLevel(e.target.value); setPage(1); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB] text-gray-700"
            >
              <option value="">全部等级</option>
              <option value="vip">VIP</option>
              <option value="svip">SVIP</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>

        {/* 用户表格 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户信息</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">联系方式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">会员等级</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">余额/积分</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">注册时间</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      暂无用户数据
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-500 font-medium">
                                {(user.nickname || user.username || 'U').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.nickname || user.username}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                          {user.is_merchant === 1 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              商户
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{user.phone || '-'}</p>
                        <p className="text-sm text-gray-500">{user.email || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        {getMemberLevelBadge(user.member_level)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800 font-medium">¥{user.balance?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-gray-500">{user.points || 0} 积分</p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                          {showActionMenu === user.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                              <button
                                onClick={() => { setSelectedUser(user); setShowActionMenu(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                                <span>查看详情</span>
                              </button>
                              <button
                                onClick={() => {
                                  user.status === 'active' || !user.status
                                    ? handleUpdateStatus(user.id, 'frozen')
                                    : handleUpdateStatus(user.id, 'active');
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                              >
                                {user.status === 'active' || !user.status ? (
                                  <>
                                    <UserX className="w-4 h-4" />
                                    <span>冻结账户</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4" />
                                    <span>解冻账户</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleResetPoints(user.id)}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700"
                              >
                                <RefreshCw className="w-4 h-4" />
                                <span>重置积分</span>
                              </button>
                            </div>
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

        {/* 用户详情弹窗 */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">用户详情</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {selectedUser.avatar ? (
                        <img src={selectedUser.avatar} alt={selectedUser.nickname} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl text-gray-500 font-medium">
                          {(selectedUser.nickname || selectedUser.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{selectedUser.nickname || selectedUser.username}</p>
                      <p className="text-gray-500">ID: {selectedUser.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">用户名</p>
                      <p className="font-medium text-gray-800">{selectedUser.username || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">手机号</p>
                      <p className="font-medium text-gray-800">{selectedUser.phone || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">邮箱</p>
                      <p className="font-medium text-gray-800">{selectedUser.email || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">会员等级</p>
                      <p className="font-medium text-gray-800">{getMemberLevelBadge(selectedUser.member_level)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">账户余额</p>
                      <p className="font-medium text-gray-800">¥{selectedUser.balance?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">积分</p>
                      <p className="font-medium text-gray-800">{selectedUser.points || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">真实姓名</p>
                      <p className="font-medium text-gray-800">{selectedUser.real_name || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-sm">状态</p>
                      <p className="font-medium">{getStatusBadge(selectedUser.status)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-gray-500 text-sm">注册时间</p>
                      <p className="font-medium text-gray-800">{formatDate(selectedUser.created_at)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-gray-500 text-sm">最后登录</p>
                      <p className="font-medium text-gray-800">{formatDate(selectedUser.last_login)}</p>
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
