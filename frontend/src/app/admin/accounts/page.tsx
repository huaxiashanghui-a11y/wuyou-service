'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { UserCog } from 'lucide-react';

export default function AccountsPage() {
  return (
    <SimpleAdminPage
      title="账号管理"
      subtitle="管理平台账号体系"
      moduleName="账号管理"
      icon={<UserCog className="w-6 h-6" />}
      color="#9B59B6"
    />
  );
}
