'use client';

import { useParams, useRouter } from 'next/navigation';
import { findBookById } from '@/data/bible-books';
import DropdownHeader from '@/components/DropdownHeader';
import BreadcrumbTabs from '@/components/BreadcrumbTabs';
import ChapterGrid from '@/components/ChapterGrid';

export default function BookChaptersPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

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

  const handleChapterSelect = (chapter: number) => {
    // 절 선택 페이지로 이동
    router.push(`/bible/${bookId}/${chapter}/verses`);
  };

  const breadcrumbSteps = [
    { 
      id: 'book', 
      label: '책', 
      active: false, 
      clickable: true,
      onClick: () => router.push('/bible')
    },
    { id: 'chapter', label: '장', active: true },
    { id: 'verse', label: '절', active: false },
  ];

  return (
    <div className="min-h-screen px-[30px] pt-[69px]">
      {/* 헤더 */}
      <DropdownHeader
        title=""
      />

      {/* 책-장-절 탭 */}
      <BreadcrumbTabs steps={breadcrumbSteps} />

      {/* 현재 선택 상태 */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {book.name} <span className="text-sm text-gray-500 font-normal">총 {book.chapters}장</span>
        </h2>
      </div>

      {/* 장 선택 그리드 */}
      <ChapterGrid
        totalChapters={book.chapters}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  );
}
