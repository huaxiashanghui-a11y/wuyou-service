'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { Image } from 'lucide-react';

export default function MediaPage() {
  return (
    <SimpleAdminPage
      title="素材管理"
      subtitle="管理平台图片和素材"
      moduleName="素材管理"
      icon={<Image className="w-6 h-6" />}
      color="#00BCD4"
    />
  );
}
