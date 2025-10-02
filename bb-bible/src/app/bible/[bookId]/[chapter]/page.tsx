'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { findBookById } from '@/data/bible-books';
import { useBibleStore } from '@/hooks/use-bible-store';
import { getChapterVerses } from '@/lib/bible-parser';
import { BibleVerse, FontSize } from '@/types/bible';
import DropdownHeader from '@/components/DropdownHeader';
import VerseReader from '@/components/VerseReader';
import StickyHeader from '@/components/StickyHeader';

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

  // localStorage에서 폰트 크기 로드 (기본값: 'small')
  const [fontSize, setFontSize] = useState<FontSize['size']>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bb-bible-font-size');
      return (saved === 'small' || saved === 'large') ? saved : 'small';
    }
    return 'small';
  });

  // 폰트 크기 변경 시 localStorage에 저장
  const handleFontSizeChange = (size: FontSize['size']) => {
    setFontSize(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bb-bible-font-size', size);
    }
  };

  // 책 정보 찾기
  const decodedBookId = decodeURIComponent(bookId);
  const book = findBookById(decodedBookId);

  // 성경 데이터 로드
  useEffect(() => {
    console.log('데이터 로드 useEffect:', { 
      hasParsedData: !!parsedData, 
      storeLoading,
      storeError 
    });
    
    if (!parsedData && !storeLoading && !storeError) {
      console.log('데이터 로딩 시작 요청...');
      loadBibleData();
    }
  }, [parsedData, storeLoading, storeError]);

  // 구절 데이터 로드
  useEffect(() => {
    console.log('구절 로드 useEffect:', { 
      hasParsedData: !!parsedData, 
      hasBook: !!book,
      decodedBookId,
      chapterNumber 
    });
    
    if (parsedData && book) {
      try {
        setIsLoading(true);
        console.log('구절 파싱 시작:', decodedBookId, chapterNumber);
        
        const chapterVerses = getChapterVerses(parsedData, decodedBookId, chapterNumber);
        console.log('구절 파싱 완료:', chapterVerses.length, '개 구절');
        
        setVerses(chapterVerses);
        setError(null);
      } catch (err) {
        console.error('구절 로딩 오류:', err);
        setError('구절을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [parsedData, book, decodedBookId, chapterNumber]);

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
    </div>
  );
}