'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { Globe } from 'lucide-react';

export default function ForexPage() {
  return (
    <SimpleAdminPage
      title="外汇管理"
      subtitle="管理外汇交易服务"
      moduleName="外汇管理"
      icon={<Globe className="w-6 h-6" />}
      color="#34495E"
    />
  );
}
