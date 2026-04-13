import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: '无忧服务 - 专业游戏点卡商城',
  description: '提供各类游戏点卡、充值服务的专业平台，安全可靠，快速到账',
  keywords: '游戏点卡, 点卡商城, 游戏充值, 卡密, Steam, 王者荣耀, 原神',
  authors: [{ name: '无忧服务' }],
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
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
