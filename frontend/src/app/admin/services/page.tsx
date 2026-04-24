'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { Headphones } from 'lucide-react';

export default function ServicesPage() {
  return (
    <SimpleAdminPage
      title="服务管理"
      subtitle="管理平台各类服务"
      moduleName="服务管理"
      icon={<Headphones className="w-6 h-6" />}
      color="#3498DB"
    />
  );
}
