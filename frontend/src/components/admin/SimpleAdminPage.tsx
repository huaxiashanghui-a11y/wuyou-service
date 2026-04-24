'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { RefreshCw, Download, Plus, Settings, Search } from 'lucide-react';

interface SimpleAdminPageProps {
  title: string;
  subtitle: string;
  moduleName: string;
  icon: React.ReactNode;
  color: string;
}

export default function SimpleAdminPage({
  title,
  subtitle,
  moduleName,
  icon,
  color
}: SimpleAdminPageProps) {
  const [loading] = useState(false);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>首页</span>
          <span>/</span>
          <span className="text-gray-700">{moduleName}</span>
        </div>

        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{ backgroundColor: color + '20' }}>
              <div style={{ color }}>{icon}</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              <p className="text-gray-500 mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">刷新</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#2980B9] transition-colors">
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#67C23A] text-white rounded-lg hover:bg-[#5DAF34] transition-colors">
              <Plus className="w-4 h-4" />
              <span>添加</span>
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
                placeholder={`搜索${title}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3498DB]"
              />
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center`} style={{ backgroundColor: color + '15' }}>
              <div style={{ color }} className="w-8 h-8">{icon}</div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}模块</h3>
            <p className="text-gray-500 mb-4">此模块正在开发中...</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                功能开发中
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
