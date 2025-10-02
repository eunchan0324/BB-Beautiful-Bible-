'use client';

import { useState, useEffect, useRef } from 'react';
import { BibleVerse, FontSize } from '@/types/bible';
import { createVerseKey } from '@/lib/bible-parser';
import { FONT_SIZE_CLASSES } from '@/hooks/use-bible-store';

interface VerseReaderProps {
  verses: BibleVerse[];
  fontSize: FontSize['size'];
  onFontSizeChange: (size: FontSize['size']) => void;
  startVerse?: number; // 스크롤할 시작 절 번호
}

export default function VerseReader({ verses, fontSize, onFontSizeChange, startVerse }: VerseReaderProps) {
  // 임시 선택 상태 (저장되지 않음)
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 특정 절로 자동 스크롤
  useEffect(() => {
    if (startVerse && verseRefs.current[startVerse]) {
      // 약간의 지연을 두고 스크롤 (DOM 렌더링 완료 후)
      setTimeout(() => {
        verseRefs.current[startVerse]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [startVerse, verses]);

  // 구절 선택/해제 토글
  const handleVerseClick = (verse: BibleVerse) => {
    const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);
    
    setSelectedVerses(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(verseKey)) {
        newSelected.delete(verseKey);
      } else {
        newSelected.add(verseKey);
      }
      return newSelected;
    });
  };

  return (
    <div className="space-y-4">

      {/* 구절들 */}
      <div style={{ marginTop: '-5px' }}>
        {verses.map((verse, index) => {
          const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);
          const isSelected = selectedVerses.has(verseKey);
          
          // 이전 절이 선택되어 있는지 확인
          const prevVerse = verses[index - 1];
          const prevVerseKey = prevVerse ? createVerseKey(prevVerse.book, prevVerse.chapter, prevVerse.verse) : null;
          const isPrevSelected = prevVerseKey ? selectedVerses.has(prevVerseKey) : false;
          
          // 연속 선택 체크 - 둘 다 선택되어 있고 연속된 절 번호일 때만
          const isConsecutiveWithPrev = isSelected && isPrevSelected && 
                                       prevVerse && (verse.verse === prevVerse.verse + 1);

          return (
            <div
              key={verseKey}
              ref={(el) => { verseRefs.current[verse.verse] = el; }}
              onClick={() => handleVerseClick(verse)}
              className="cursor-pointer transition-colors hover:bg-gray-50"
              style={{ 
                // 모든 절에 동일한 고정 여백 적용 (패딩 포함해서 계산)
                marginBottom: fontSize === 'large' ? '5px' : '2px', // 30px - 8px, 20px - 8px
                padding: '8px 0',
                // 선택 시 배경색 적용
                backgroundColor: isSelected ? '#DFD4C4' : 'transparent',
                // 전체 너비로 확장 (상위 컨테이너 패딩 무시)
                marginLeft: '-30px',
                marginRight: '-30px',
                paddingLeft: '30px',
                paddingRight: '30px',
                // 연속 선택 시 상하 여백 조정으로 이어지게 만들기
                marginTop: isConsecutiveWithPrev ? '0px' : '0px' // marginBottom과 일치하도록 조정
              }}
            >
              <div className={`${FONT_SIZE_CLASSES[fontSize]}`} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span 
                  style={{
                    fontFamily: 'Glory, sans-serif',
                    fontWeight: 'medium',
                    fontSize: fontSize === 'large' ? '16px' : '14px',
                    color: '#3C3C3C',
                    marginRight: '10px',
                    flexShrink: 0
                  }}
                >
                  {verse.verse}
                </span>
                <span 
                  style={{
                    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 'medium',
                    fontSize: fontSize === 'large' ? '30px' : '18px',
                    color: '#2A2A2A',
                    lineHeight: '1.5'
                  }}
                >
                  {verse.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
