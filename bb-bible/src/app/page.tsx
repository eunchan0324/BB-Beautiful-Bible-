'use client';

import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-[30px]">
      {/* BB 로고 */}
      <div className="flex flex-col items-center mb-8">
        <div className="text-8xl font-bold text-amber-800 mb-8">
          BB
        </div>
        
        {/* 설명 텍스트 */}
        <div className="text-center leading-relaxed max-w-xs font-semibold text-lg text-[var(--text-primary)]">
          '성경' 아이콘을 눌러
          <br />
          성경읽기를 시작해보세요
        </div>
      </div>

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />
    </div>
  );
}