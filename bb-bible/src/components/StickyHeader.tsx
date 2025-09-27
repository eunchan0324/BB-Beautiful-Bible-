'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';
import { FontSize } from '@/types/bible';

interface StickyHeaderProps {
  bookName: string;
  chapterNumber: number;
  fontSize: FontSize['size'];
  onBookChapterSelect: () => void;
  onFontSizeChange: (size: FontSize['size']) => void;
}

export default function StickyHeader({ 
  bookName, 
  chapterNumber, 
  fontSize,
  onBookChapterSelect, 
  onFontSizeChange 
}: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤 방향에 따라 헤더 표시/숨김
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // 위로 스크롤하거나 최상단 근처일 때 표시
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤하고 100px 이상일 때 숨김
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      ref={headerRef}
      className={`fixed top-[69px] left-0 right-0 z-50 bg-white border-b border-gray-200 px-[30px] py-3 transition-transform duration-300 ease-in-out ${
        isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* 왼쪽: 책+장 텍스트 버튼 */}
        <button
          onClick={onBookChapterSelect}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-[22px] font-medium text-gray-900">
            {bookName} {chapterNumber}장
          </span>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </button>

        {/* 오른쪽: 폰트 크기 텍스트 버튼 */}
        <button
          onClick={() => onFontSizeChange(fontSize === 'small' ? 'large' : 'small')}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-sm font-medium text-gray-700">
            {fontSize === 'small' ? '작은글' : '큰글'}
          </span>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
