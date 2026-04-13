import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: '无忧服务 - 专业充值服务平台',
  description: '提供小红书薯币、游戏点卡充值服务，即享8折优惠，安全快速，自动发货',
  keywords: '小红书充值, 薯币充值, 游戏充值, 点卡充值, 原神, 王者荣耀',
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
