'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { findBookById, BIBLE_BOOKS } from '@/data/bible-books';
import { useBibleStore } from '@/hooks/use-bible-store';
import { getChapterVerses } from '@/lib/bible-parser';
import { BibleVerse, FontSize } from '@/types/bible';
import VerseReader from '@/components/VerseReader';
import StickyHeader from '@/components/StickyHeader';
import ChapterNavigation from '@/components/ChapterNavigation';

export default function ChapterReadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = params.bookId as string;
  const chapterNumber = parseInt(params.chapter as string);
  const startVerse = searchParams.get('startVerse') ? parseInt(searchParams.get('startVerse')!) : 1;
  
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loadBibleData, parsedData, isLoading: storeLoading, error: storeError } = useBibleStore();

  // 폰트 크기 상태 (기본값: 'small')
  const [fontSize, setFontSize] = useState<FontSize['size']>('small');

  // 스크롤 상태 (헤더와 네비게이션 제어)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 클라이언트에서만 localStorage 읽기 (Hydration 이슈 방지)
  useEffect(() => {
    const saved = localStorage.getItem('bb-bible-font-size');
    if (saved === 'small' || saved === 'large') {
      setFontSize(saved);
    }
  }, []);

  // 폰트 크기 변경 시 localStorage에 저장
  const handleFontSizeChange = (size: FontSize['size']) => {
    setFontSize(size);
    localStorage.setItem('bb-bible-font-size', size);
  };

  // 책 정보 찾기
  const decodedBookId = decodeURIComponent(bookId);
  const book = findBookById(decodedBookId);

  // 성경 데이터 로드
  useEffect(() => {
    if (!parsedData && !storeLoading && !storeError) {
      loadBibleData();
    }
  }, [parsedData, storeLoading, storeError, loadBibleData]);

  // 구절 데이터 로드
  useEffect(() => {
    if (parsedData && book) {
      try {
        setIsLoading(true);
        const chapterVerses = getChapterVerses(parsedData, book.id, chapterNumber);
        setVerses(chapterVerses);
        setError(null);
      } catch (err) {
        console.error('구절 로딩 오류:', err);
        setError('구절을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [parsedData, book, chapterNumber]);

  // 스크롤 감지 (헤더와 네비게이션 반대로 제어)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤 방향에 따라 헤더/네비게이션 표시/숨김
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // 위로 스크롤하거나 최상단 근처일 때 헤더 표시, 네비게이션 숨김
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤하고 100px 이상일 때 헤더 숨김, 네비게이션 표시
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            책을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            요청하신 성경책이 존재하지 않습니다.
          </p>
          <button
            onClick={() => router.push('/bible')}
            className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            성경 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (chapterNumber < 1 || chapterNumber > book.chapters) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            장을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            {book.name}는 {book.chapters}장까지 있습니다.
          </p>
          <button
            onClick={() => router.push(`/bible/${bookId}`)}
            className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            {book.name} 장 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-gray-600">성경을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const handleBookChapterSelect = () => {
    // 책 선택 페이지로 이동 (사용자가 다시 선택할 수 있도록)
    router.push('/bible');
  };

  // 이전/다음 장 URL 계산
  const getPrevNextUrls = () => {
    let prevUrl: string | undefined;
    let nextUrl: string | undefined;

    // 이전 장
    if (chapterNumber > 1) {
      prevUrl = `/bible/${bookId}/${chapterNumber - 1}`;
    } else {
      // 현재 책의 첫 장이면 이전 책의 마지막 장으로
      const currentBookIndex = BIBLE_BOOKS.findIndex(b => b.id === book.id);
      if (currentBookIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
        prevUrl = `/bible/${prevBook.id}/${prevBook.chapters}`;
      }
    }

    // 다음 장
    if (chapterNumber < book.chapters) {
      nextUrl = `/bible/${bookId}/${chapterNumber + 1}`;
    } else {
      // 현재 책의 마지막 장이면 다음 책의 첫 장으로
      const currentBookIndex = BIBLE_BOOKS.findIndex(b => b.id === book.id);
      if (currentBookIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentBookIndex + 1];
        nextUrl = `/bible/${nextBook.id}/1`;
      }
    }

    return { prevUrl, nextUrl };
  };

  const { prevUrl, nextUrl } = getPrevNextUrls();

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Sticky Header */}
      <StickyHeader
        bookName={book.name}
        chapterNumber={chapterNumber}
        fontSize={fontSize}
        isVisible={isHeaderVisible}
        onBookChapterSelect={handleBookChapterSelect}
        onFontSizeChange={handleFontSizeChange}
      />

      {/* 상단 여백 (Sticky Header 공간 확보) */}
      <div className="pt-[80px]">
        {/* 구절 읽기 */}
        <div className="px-[30px]">
          <VerseReader
            verses={verses}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            startVerse={startVerse}
          />
        </div>
      </div>

      {/* 하단 장 네비게이션 (스크롤 내릴 때만 표시) */}
      <ChapterNavigation
        bookName={book.name}
        chapter={chapterNumber}
        isVisible={!isHeaderVisible}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
      />
    </div>
  );
}