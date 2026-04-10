'use client';

import { useEffect, useRef, useState } from 'react';
import SelectionActionBar from '@/components/SelectionActionBar';
import ToastMessage from '@/components/ToastMessage';
import { FONT_SIZE_CLASSES } from '@/hooks/use-bible-store';
import { createVerseKey } from '@/lib/bible-parser';
import {
  addHighlight,
  DARK_HIGHLIGHT_BACKGROUND_COLORS,
  HIGHLIGHT_BACKGROUND_COLORS,
  loadHighlights,
  removeHighlight,
} from '@/lib/highlight';
import { formatSelectedReference, formatSelectedText } from '@/lib/verse-selection';
import { BibleVerse, FontSize, HighlightColor, ResolvedTheme } from '@/types/bible';

interface VerseReaderProps {
  verses: BibleVerse[];
  fontSize: FontSize['size'];
  effectiveTheme: ResolvedTheme;
  selectionActionBarBottomOffset?: number;
  onFontSizeChange?: (size: FontSize['size']) => void;
  startVerse?: number;
}

type ToastState = {
  id: number;
  message: string;
} | null;

const READER_THEME_COLORS: Record<
  ResolvedTheme,
  {
    verseNumber: string;
    verseText: string;
    selectionUnderline: string;
  }
> = {
  light: {
    verseNumber: '#3C3C3C',
    verseText: '#2A2A2A',
    selectionUnderline: '#55524F',
  },
  dark: {
    verseNumber: '#C8BDAE',
    verseText: '#F3EFE8',
    selectionUnderline: '#D8CCBD',
  },
};

export default function VerseReader({
  verses,
  fontSize,
  effectiveTheme,
  selectionActionBarBottomOffset = 16,
  startVerse,
}: VerseReaderProps) {
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());
  const [highlightedVerses, setHighlightedVerses] = useState<Record<string, HighlightColor>>({});
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const hasSelection = selectedVerses.size > 0;
  const selectedVerseList = verses.filter((verse) =>
    selectedVerses.has(createVerseKey(verse.book, verse.chapter, verse.verse)),
  );
  const selectedVerseNumbers = selectedVerseList.map((verse) => verse.verse).sort((a, b) => a - b);
  const selectedReference = formatSelectedReference(verses, selectedVerseNumbers);
  const selectedText = formatSelectedText(selectedVerseList);
  const colors = READER_THEME_COLORS[effectiveTheme];
  const highlightColors =
    effectiveTheme === 'dark' ? DARK_HIGHLIGHT_BACKGROUND_COLORS : HIGHLIGHT_BACKGROUND_COLORS;

  useEffect(() => {
    if (startVerse && verseRefs.current[startVerse]) {
      setTimeout(() => {
        verseRefs.current[startVerse]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [startVerse, verses]);

  useEffect(() => {
    const storedHighlights = loadHighlights().highlights;
    const nextHighlights = Object.fromEntries(
      Object.entries(storedHighlights).map(([verseKey, highlight]) => [verseKey, highlight.color]),
    ) as Record<string, HighlightColor>;

    setHighlightedVerses(nextHighlights);
  }, []);

  useEffect(() => {
    if (!hasSelection) {
      setIsColorPickerOpen(false);
    }
  }, [hasSelection]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast((currentToast) => (currentToast?.id === toast.id ? null : currentToast));
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (message: string) => {
    setToast({
      id: Date.now(),
      message,
    });
  };

  const handleVerseClick = (verse: BibleVerse) => {
    const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);

    setSelectedVerses((prev) => {
      const next = new Set(prev);

      if (next.has(verseKey)) {
        next.delete(verseKey);
      } else {
        next.add(verseKey);
      }

      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedVerses(new Set());
    setIsColorPickerOpen(false);
  };

  const handleCopySelection = async () => {
    if (!selectedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedText);
      showToast('선택한 구절을 복사했어요.');
      handleClearSelection();
    } catch (error) {
      console.error('복사에 실패했습니다.', error);
      showToast('복사하지 못했어요. 다시 시도해보세요.');
    }
  };

  const handleShareSelection = async () => {
    if (!selectedText) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedReference,
          text: selectedText,
        });
        showToast('공유 시트를 열었어요.');
      } else {
        await navigator.clipboard.writeText(selectedText);
        showToast('공유를 지원하지 않아 복사로 대신했어요.');
      }

      handleClearSelection();
    } catch (error) {
      console.error('공유에 실패했습니다.', error);
      showToast('공유하지 못했어요. 다시 시도해보세요.');
    }
  };

  const handleHighlightColorSelect = (color: HighlightColor) => {
    const selectedKeys = selectedVerseList.map((verse) =>
      createVerseKey(verse.book, verse.chapter, verse.verse),
    );

    if (selectedKeys.length === 0) {
      return;
    }

    const nextHighlights = { ...highlightedVerses };

    selectedKeys.forEach((key) => {
      const currentColor = nextHighlights[key];

      if (currentColor === color) {
        removeHighlight(key);
        delete nextHighlights[key];
      } else {
        addHighlight(key, color);
        nextHighlights[key] = color;
      }
    });

    setHighlightedVerses(nextHighlights);
    handleClearSelection();
  };

  const handleHighlightRemove = () => {
    const selectedKeys = selectedVerseList.map((verse) =>
      createVerseKey(verse.book, verse.chapter, verse.verse),
    );

    if (selectedKeys.length === 0) {
      return;
    }

    const nextHighlights = { ...highlightedVerses };

    selectedKeys.forEach((key) => {
      removeHighlight(key);
      delete nextHighlights[key];
    });

    setHighlightedVerses(nextHighlights);
    handleClearSelection();
  };

  return (
    <div className="space-y-4 pb-[128px]">
      {toast && <ToastMessage message={toast.message} effectiveTheme={effectiveTheme} />}

      {hasSelection && (
        <SelectionActionBar
          selectedReference={selectedReference}
          effectiveTheme={effectiveTheme}
          bottomOffset={selectionActionBarBottomOffset}
          isColorPickerOpen={isColorPickerOpen}
          onClearSelection={handleClearSelection}
          onToggleColorPicker={() => setIsColorPickerOpen((prev) => !prev)}
          onShare={handleShareSelection}
          onCopy={handleCopySelection}
          onHighlightRemove={handleHighlightRemove}
          onHighlightColorSelect={handleHighlightColorSelect}
        />
      )}

      <div style={{ marginTop: '-5px' }}>
        {verses.map((verse, index) => {
          const verseKey = createVerseKey(verse.book, verse.chapter, verse.verse);
          const isSelected = selectedVerses.has(verseKey);
          const highlightColor = highlightedVerses[verseKey];

          const prevVerse = verses[index - 1];
          const prevVerseKey = prevVerse
            ? createVerseKey(prevVerse.book, prevVerse.chapter, prevVerse.verse)
            : null;
          const isPrevSelected = prevVerseKey ? selectedVerses.has(prevVerseKey) : false;
          const isConsecutiveWithPrev =
            isSelected && isPrevSelected && prevVerse && verse.verse === prevVerse.verse + 1;

          return (
            <div
              key={verseKey}
              ref={(element) => {
                verseRefs.current[verse.verse] = element;
              }}
              onClick={() => handleVerseClick(verse)}
              className="cursor-pointer transition-colors"
              style={{
                marginBottom: fontSize === 'large' ? '5px' : '2px',
                padding: '8px 0',
                backgroundColor: highlightColor ? highlightColors[highlightColor] : 'transparent',
                marginLeft: '-30px',
                marginRight: '-30px',
                paddingLeft: '30px',
                paddingRight: '30px',
                marginTop: isConsecutiveWithPrev ? '0px' : '0px',
                borderRadius: '0px',
                boxShadow: 'none',
                transform: 'none',
                transition: 'background-color 160ms ease',
              }}
            >
              <div
                className={`${FONT_SIZE_CLASSES[fontSize]}`}
                style={{ display: 'flex', alignItems: 'flex-start' }}
              >
                <span
                  style={{
                    fontFamily: 'Glory, sans-serif',
                    fontWeight: 'medium',
                    fontSize: fontSize === 'large' ? '16px' : '14px',
                    color: colors.verseNumber,
                    marginRight: '10px',
                    flexShrink: 0,
                    marginTop: fontSize === 'large' ? '3px' : '2px',
                  }}
                >
                  {verse.verse}
                </span>
                <span
                  style={{
                    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontWeight: 'medium',
                    fontSize: fontSize === 'large' ? '30px' : '18px',
                    color: colors.verseText,
                    lineHeight: '1.5',
                    textDecoration: isSelected ? 'underline' : 'none',
                    textDecorationColor: colors.selectionUnderline,
                    textDecorationThickness: '3px',
                    textUnderlineOffset: '6px',
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
