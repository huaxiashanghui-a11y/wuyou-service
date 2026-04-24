'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { TrendingUp } from 'lucide-react';

export default function PromotionPage() {
  return (
    <SimpleAdminPage
      title="推广管理"
      subtitle="管理平台推广活动"
      moduleName="推广管理"
      icon={<TrendingUp className="w-6 h-6" />}
      color="#FF5722"
    />
  );
}
