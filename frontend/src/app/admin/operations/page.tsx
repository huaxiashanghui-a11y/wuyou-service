'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { Zap } from 'lucide-react';

export default function OperationsPage() {
  return (
    <SimpleAdminPage
      title="运营管理"
      subtitle="管理平台运营活动"
      moduleName="运营管理"
      icon={<Zap className="w-6 h-6" />}
      color="#E91E63"
    />
  );
}
