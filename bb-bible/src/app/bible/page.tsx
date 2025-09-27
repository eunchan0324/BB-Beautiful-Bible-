'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '@/data/bible-books';
import { BibleBook } from '@/types/bible';
import BookList from '@/components/BookList';
import DropdownHeader from '@/components/DropdownHeader';
import BreadcrumbTabs from '@/components/BreadcrumbTabs';
import TestamentDropdown from '@/components/TestamentDropdown';

export default function BiblePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');

  const currentBooks = activeTab === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;

  const handleBookSelect = (book: BibleBook) => {
    router.push(`/bible/${book.id}`);
  };

  const handleTestamentChange = (testament: 'old' | 'new') => {
    setActiveTab(testament);
  };

  const breadcrumbSteps = [
    { id: 'book', label: '책', active: true },
    { id: 'chapter', label: '장', active: false },
    { id: 'verse', label: '절', active: false },
  ];

  return (
    <div className="min-h-screen px-[30px] pt-[69px]">
      {/* 헤더 */}
      <DropdownHeader
        title=""
        rightElement={
          <TestamentDropdown
            value={activeTab}
            onChange={handleTestamentChange}
          />
        }
      />

      {/* 책-장-절 브레드크럼 */}
      <BreadcrumbTabs steps={breadcrumbSteps} />

      {/* 성경책 목록 */}
      <BookList
        books={currentBooks}
        onBookSelect={handleBookSelect}
        testament={activeTab}
      />
    </div>
  );
}
