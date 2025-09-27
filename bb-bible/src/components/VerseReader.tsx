'use client';

import { useState, useEffect, useRef } from 'react';
import { BibleVerse, FontSize } from '@/types/bible';
import { getHighlight, toggleHighlight, getHighlightClass } from '@/lib/highlight';
import { createVerseKey } from '@/lib/bible-parser';
import { FONT_SIZE_CLASSES } from '@/hooks/use-bible-store';

interface VerseReaderProps {
  verses: BibleVerse[];
  fontSize: FontSize['size'];
  onFontSizeChange: (size: FontSize['size']) => void;
  startVerse?: number; // 스크롤할 시작 절 번호
}

export default function VerseReader({ verses, fontSize, onFontSizeChange, startVerse }: VerseReaderProps) {
  const [highlights, setHighlights] = useState<Record<string, any>>({});
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 컴포넌트 마운트 시 하이라이트 데이터 로드
  useEffect(() => {
    const loadedHighlights: Record<string, any> = {};
    verses.forEach(verse => {
      const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);
      const highlight = getHighlight(verseKey);
      if (highlight) {
        loadedHighlights[verseKey] = highlight;
      }
    });
    setHighlights(loadedHighlights);
  }, [verses]);

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

  const handleVerseClick = (verse: BibleVerse) => {
    const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);
    const isHighlighted = toggleHighlight(verseKey);
    
    if (isHighlighted) {
      const highlight = getHighlight(verseKey);
      if (highlight) {
        setHighlights(prev => ({
          ...prev,
          [verseKey]: highlight
        }));
      }
    } else {
      setHighlights(prev => {
        const newHighlights = { ...prev };
        delete newHighlights[verseKey];
        return newHighlights;
      });
    }
  };

  return (
    <div className="space-y-4">

      {/* 구절들 */}
      <div className="space-y-3">
        {verses.map((verse) => {
          const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);
          const highlight = highlights[verseKey];
          const highlightClass = highlight ? getHighlightClass(highlight.color) : '';

          return (
            <div
              key={verseKey}
              ref={(el) => { verseRefs.current[verse.verse] = el; }}
              onClick={() => handleVerseClick(verse)}
              className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                highlightClass || 'bg-white'
              }`}
            >
              <div className={`${FONT_SIZE_CLASSES[fontSize]}`}>
                <span className="font-bold text-amber-800 mr-2">
                  {verse.verse}
                </span>
                <span className="text-gray-900">
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
