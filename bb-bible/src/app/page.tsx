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
          하루를 기록하는 가장 간단한
          <br />
          간단한 방법 간단한
        </div>
      </div>

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />
    </div>
  );
}