'use client';

import { useEffect } from 'react';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Image from 'next/image';
import BB_logo from '../../public/icons/BB_logo_main(180px).png'

export default function Home() {
  // 홈 화면에서만 body 스크롤 막기
  useEffect(() => {
    // 스크롤 막기
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // 컴포넌트 언마운트 시 원복
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  return (
      <div className="h-screen overflow-hidden flex flex-col items-center justify-center px-[30px]">
      {/* BB 로고 */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-[62px]">
          <Image src={BB_logo} alt="BB Logo" width={100} height={100} />
        </div>
        
        {/* 설명 텍스트 */}
        <div className="text-center leading-relaxed max-w-xs font-semibold text-lg text-[var(--text-primary)]">
          하단 성경 버튼을 눌러
          <br />
          성경읽기를 시작해보세요
        </div>
      </div>

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />
    </div>
  );
}