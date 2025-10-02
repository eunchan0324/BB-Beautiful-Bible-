'use client';

import { useParams, useRouter } from 'next/navigation';
import { findBookById } from '@/data/bible-books';
import DropdownHeader from '@/components/DropdownHeader';
import BreadcrumbTabs from '@/components/BreadcrumbTabs';
import ChapterGrid from '@/components/ChapterGrid';

export default function ChapterVersesPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const chapterNumber = parseInt(params.chapter as string);

  // 책 정보 찾기 (URL 디코딩 적용)
  const decodedBookId = decodeURIComponent(bookId);
  const book = findBookById(decodedBookId);

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

  const handleVerseSelect = (verse: number) => {
    // 구절 읽기 페이지로 이동
    router.push(`/bible/${bookId}/${chapterNumber}?startVerse=${verse}`);
  };

  const breadcrumbSteps = [
    { 
      id: 'book', 
      label: '책', 
      active: false, 
      clickable: true,
      onClick: () => router.push('/bible')
    },
    { 
      id: 'chapter', 
      label: '장', 
      active: false, 
      clickable: true,
      onClick: () => router.push(`/bible/${bookId}`)
    },
    { id: 'verse', label: '절', active: true },
  ];

  // 임시로 절 수를 30개로 설정 (나중에 실제 데이터에서 가져올 예정)
  const estimatedVerses = 30;

  return (
    <div className="min-h-screen px-[30px] pt-[69px]">
      {/* 헤더 */}
      <DropdownHeader
        title=""
      />

      {/* 책-장-절 브레드크럼 */}
      <BreadcrumbTabs steps={breadcrumbSteps} />

      {/* 현재 선택 상태 */}
      <div>
        <h2 
          className="font-semibold"
          style={{
            color: '#8D8881',
            fontSize: '14px',
            fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
          }}
        >
          {book.name} {chapterNumber}장
        </h2>
      </div>

      {/* 절 선택 그리드 */}
      <ChapterGrid
        totalChapters={estimatedVerses}
        onChapterSelect={handleVerseSelect}
      />
    </div>
  );
}
