import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: '无忧服务 - 专业游戏点卡商城',
  description: '提供王者荣耀、原神、Steam等游戏点卡充值服务，安全快速，自动发货',
  keywords: '游戏点卡, 点卡充值, 王者荣耀点卡, 原神月卡, Steam充值',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
