'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ChapterNavigation from '@/components/ChapterNavigation';
import StickyHeader from '@/components/StickyHeader';
import VerseReader from '@/components/VerseReader';
import { findBookById, BIBLE_BOOKS } from '@/data/bible-books';
import { useBibleStore } from '@/hooks/use-bible-store';
import { getChapterVerses } from '@/lib/bible-parser';
import { BibleVerse, FontSize, ResolvedTheme, ThemeMode } from '@/types/bible';

const READING_THEME_STORAGE_KEY = 'bb-bible-reading-theme';

const READING_THEME_COLORS: Record<
  ResolvedTheme,
  {
    pageBackground: string;
    surfaceBackground: string;
    textPrimary: string;
    textSecondary: string;
    loadingBorder: string;
    buttonBackground: string;
  }
> = {
  light: {
    pageBackground: '#FFFFFF',
    surfaceBackground: '#F9F8F4',
    textPrimary: '#343434',
    textSecondary: '#6E6A63',
    loadingBorder: '#8D8881',
    buttonBackground: '#8D8881',
  },
  dark: {
    pageBackground: '#171717',
    surfaceBackground: '#232323',
    textPrimary: '#F3EFE8',
    textSecondary: '#B9B0A4',
    loadingBorder: '#C8BDAE',
    buttonBackground: '#C8BDAE',
  },
};

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ChapterReadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = params.bookId as string;
  const chapterNumber = parseInt(params.chapter as string, 10);
  const startVerse = searchParams.get('startVerse') ? parseInt(searchParams.get('startVerse')!, 10) : 1;

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<FontSize['size']>('small');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<ResolvedTheme>('light');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { loadBibleData, parsedData, isLoading: storeLoading, error: storeError } = useBibleStore();

  useEffect(() => {
    const savedFontSize = localStorage.getItem('bb-bible-font-size');
    if (savedFontSize === 'small' || savedFontSize === 'large') {
      setFontSize(savedFontSize);
    }

    const savedThemeMode = localStorage.getItem(READING_THEME_STORAGE_KEY);
    if (savedThemeMode === 'light' || savedThemeMode === 'dark' || savedThemeMode === 'system') {
      setThemeMode(savedThemeMode);
      setEffectiveTheme(savedThemeMode === 'system' ? getSystemTheme() : savedThemeMode);
    } else {
      setEffectiveTheme(getSystemTheme());
    }
  }, []);

  useEffect(() => {
    if (themeMode !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setEffectiveTheme(event.matches ? 'dark' : 'light');
    };

    setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [themeMode]);

  const handleFontSizeChange = (size: FontSize['size']) => {
    setFontSize(size);
    localStorage.setItem('bb-bible-font-size', size);
  };

  const handleThemeModeChange = (nextThemeMode: ThemeMode) => {
    setThemeMode(nextThemeMode);
    localStorage.setItem(READING_THEME_STORAGE_KEY, nextThemeMode);
    setEffectiveTheme(nextThemeMode === 'system' ? getSystemTheme() : nextThemeMode);
  };

  const decodedBookId = decodeURIComponent(bookId);
  const book = findBookById(decodedBookId);

  useEffect(() => {
    if (!parsedData && !storeLoading && !storeError) {
      loadBibleData();
    }
  }, [parsedData, storeLoading, storeError, loadBibleData]);

  useEffect(() => {
    if (parsedData && book) {
      try {
        setIsLoading(true);
        const chapterVerses = getChapterVerses(parsedData, book.id, chapterNumber);
        setVerses(chapterVerses);
        setError(null);
      } catch (loadError) {
        console.error('구절 로딩 오류:', loadError);
        setError('구절을 불러오는 중 문제가 발생했어요.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [parsedData, book, chapterNumber]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const colors = READING_THEME_COLORS[effectiveTheme];

  if (!book) {
    return (
      <StateScreen
        backgroundColor={colors.surfaceBackground}
        titleColor={colors.textPrimary}
        bodyColor={colors.textSecondary}
        buttonColor={colors.buttonBackground}
        title="책을 찾을 수 없어요"
        body="요청한 성경 책이 존재하지 않습니다."
        buttonLabel="성경 목록으로 돌아가기"
        onClick={() => router.push('/bible')}
      />
    );
  }

  if (chapterNumber < 1 || chapterNumber > book.chapters) {
    return (
      <StateScreen
        backgroundColor={colors.surfaceBackground}
        titleColor={colors.textPrimary}
        bodyColor={colors.textSecondary}
        buttonColor={colors.buttonBackground}
        title="장을 찾을 수 없어요"
        body={`${book.name}${book.chapters}장까지 있습니다.`}
        buttonLabel={`${book.name} 목록으로 돌아가기`}
        onClick={() => router.push(`/bible/${bookId}`)}
      />
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen p-4 flex items-center justify-center"
        style={{ backgroundColor: colors.surfaceBackground }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.loadingBorder }}
          />
          <p style={{ color: colors.textSecondary }}>성경을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateScreen
        backgroundColor={colors.surfaceBackground}
        titleColor={colors.textPrimary}
        bodyColor={colors.textSecondary}
        buttonColor={colors.buttonBackground}
        title="오류가 발생했어요"
        body={error}
        buttonLabel="다시 시도"
        onClick={() => window.location.reload()}
      />
    );
  }

  const handleBookChapterSelect = () => {
    router.push('/bible');
  };

  const getPrevNextUrls = () => {
    let prevUrl: string | undefined;
    let nextUrl: string | undefined;

    if (chapterNumber > 1) {
      prevUrl = `/bible/${bookId}/${chapterNumber - 1}`;
    } else {
      const currentBookIndex = BIBLE_BOOKS.findIndex((bibleBook) => bibleBook.id === book.id);
      if (currentBookIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
        prevUrl = `/bible/${prevBook.id}/${prevBook.chapters}`;
      }
    }

    if (chapterNumber < book.chapters) {
      nextUrl = `/bible/${bookId}/${chapterNumber + 1}`;
    } else {
      const currentBookIndex = BIBLE_BOOKS.findIndex((bibleBook) => bibleBook.id === book.id);
      if (currentBookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentBookIndex + 1];
        nextUrl = `/bible/${nextBook.id}/1`;
      }
    }

    return { prevUrl, nextUrl };
  };

  const { prevUrl, nextUrl } = getPrevNextUrls();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.pageBackground }}>
      <StickyHeader
        bookName={book.name}
        chapterNumber={chapterNumber}
        fontSize={fontSize}
        themeMode={themeMode}
        effectiveTheme={effectiveTheme}
        isVisible={isHeaderVisible}
        onBookChapterSelect={handleBookChapterSelect}
        onFontSizeChange={handleFontSizeChange}
        onThemeModeChange={handleThemeModeChange}
      />

      <div className="pt-[80px]">
        <div className="px-[30px]">
          <VerseReader
            verses={verses}
            fontSize={fontSize}
            effectiveTheme={effectiveTheme}
            selectionActionBarBottomOffset={isHeaderVisible ? 16 : 116}
            onFontSizeChange={handleFontSizeChange}
            startVerse={startVerse}
          />
        </div>
      </div>

      <ChapterNavigation
        bookName={book.name}
        chapter={chapterNumber}
        effectiveTheme={effectiveTheme}
        isVisible={!isHeaderVisible}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
      />
    </div>
  );
}

interface StateScreenProps {
  backgroundColor: string;
  titleColor: string;
  bodyColor: string;
  buttonColor: string;
  title: string;
  body: string;
  buttonLabel: string;
  onClick: () => void;
}

function StateScreen({
  backgroundColor,
  titleColor,
  bodyColor,
  buttonColor,
  title,
  body,
  buttonLabel,
  onClick,
}: StateScreenProps) {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center" style={{ backgroundColor }}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2" style={{ color: titleColor }}>
          {title}
        </h2>
        <p className="mb-4" style={{ color: bodyColor }}>
          {body}
        </p>
        <button
          onClick={onClick}
          className="px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
