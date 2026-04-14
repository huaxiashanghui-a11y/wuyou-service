'use client';

export default function Background() {
  return (
    <>
      {/* 全局背景层 - 固定定位，不随滚动 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/bg-industrial.jpg')`,
          filter: 'blur(10px) brightness(0.4)',
          transform: 'scale(1.1)', // 轻微放大确保覆盖
        }}
      />
      {/* 暗色遮罩层 - 增强对比度 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
    </>
  );
}
