'use client';

import SimpleAdminPage from '@/components/admin/SimpleAdminPage';
import { Gamepad2 } from 'lucide-react';

export default function GamesPage() {
  return (
    <SimpleAdminPage
      title="游戏管理"
      subtitle="管理平台游戏服务"
      moduleName="游戏管理"
      icon={<Gamepad2 className="w-6 h-6" />}
      color="#2ECC71"
    />
  );
}
