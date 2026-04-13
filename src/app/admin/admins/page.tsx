'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Users, Shield, X } from 'lucide-react';
import { Admin } from '@/lib/types';

// 模拟管理员数据
const initialAdmins: Admin[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@wuyou.com',
    role: 'admin',
    permissions: ['products', 'cards', 'orders'],
    lastLogin: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'superadmin',
    email: 'super@wuyou.com',
    role: 'superadmin',
    permissions: ['all'],
    lastLogin: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as const,
    permissions: [] as string[]
  });

  const allPermissions = [
    { id: 'products', name: '商品管理' },
    { id: 'cards', name: '卡密管理' },
    { id: 'orders', name: '订单管理' },
    { id: 'admins', name: '管理员管理' },
    { id: 'settings', name: '系统设置' }
  ];

  const filteredAdmins = admins.filter(admin =>
    admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        email: admin.email,
        password: '',
        role: admin.role,
        permissions: admin.permissions
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: []
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      setAdmins(admins.map(a =>
        a.id === editingAdmin.id ? { ...a, ...formData, password: formData.password || a.id } : a
      ));
    } else {
      const newAdmin: Admin = {
        ...formData,
        id: Date.now().toString(),
        lastLogin: undefined,
        createdAt: new Date().toISOString()
      };
      setAdmins([...admins, newAdmin]);
    }
    
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个管理员吗？')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">管理员管理</h1>
          <p className="text-gray-500">管理后台用户账号</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>添加管理员</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索管理员..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最后登录</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">{admin.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-800">{admin.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      admin.role === 'superadmin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {admin.role === 'superadmin' ? '超级管理员' : '管理员'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : '从未登录'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(admin)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingAdmin ? '编辑管理员' : '添加管理员'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码 {editingAdmin && '(不修改请留空)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                  required={!editingAdmin}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
                >
                  <option value="admin">管理员</option>
                  <option value="superadmin">超级管理员</option>
                </select>
              </div>
              
              {formData.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">权限</label>
                  <div className="grid grid-cols-2 gap-2">
                    {allPermissions.map(perm => (
                      <label key={perm.id} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="text-sm">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  {editingAdmin ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
