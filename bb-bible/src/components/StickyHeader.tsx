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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      className={`fixed left-0 right-0 z-50 bg-white px-[30px] py-5 transition-all duration-300 ease-in-out ${
        isVisible ? 'top-0 opacity-100' : '-top-full opacity-0'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* 왼쪽: 책+장 텍스트 버튼 */}
        <button
          onClick={onBookChapterSelect}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <span 
            className="font-semibold"
            style={{
              fontSize: '22px',
              color: '#414141',
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            {bookName} {chapterNumber}장
          </span>
          <ChevronDownIcon 
            className="w-6 h-6" 
            style={{ 
              color: '#414141',
              transform: 'translateY' // 수동 위치 조절
            }} 
          />
        </button>

        {/* 오른쪽: 폰트 크기 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative hover:opacity-70 transition-opacity rounded-md"
            style={{
              width: '73px',
              height: '36px',
              backgroundColor: '#F0EEE7',
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
              padding: '0'
            }}
          >
            <span 
              className="font-bold absolute"
              style={{
                fontSize: '14px',
                color: '#414141',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              {fontSize === 'small' ? '작은글' : '큰글'}
            </span>
            <ChevronDownIcon 
              className="absolute w-3.5 h-3.5" 
              style={{ 
                color: '#414141',
                width: '14px',
                height: '14px',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} 
            />
          </button>
          
          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div 
              className="absolute top-full right-0 mt-1 rounded-md z-50"
              style={{
                backgroundColor: 'rgba(240, 238, 231, 0.8)',
                backdropFilter: 'blur(4px)',
                width: '73px'
              }}
            >
              <div>
                <button
                  onClick={() => {
                    onFontSizeChange('small');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left hover:bg-gray-100 transition-colors rounded-t-md"
                  style={{
                    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '14px',
                    color: '#414141',
                    fontWeight: 'medium',
                    width: '73px',
                    height: '36px',
                    paddingLeft: '10px',
                    paddingRight: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  작은글
                </button>
                <div 
                  className="h-px"
                  style={{ backgroundColor: 'rgba(217, 217, 217, 0.8)' }}
                />
                <button
                  onClick={() => {
                    onFontSizeChange('large');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left hover:bg-gray-100 transition-colors rounded-b-md"
                  style={{
                    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '14px',
                    color: '#414141',
                    fontWeight: 'medium',
                    width: '73px',
                    height: '36px',
                    paddingLeft: '10px',
                    paddingRight: '16px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  큰글
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
