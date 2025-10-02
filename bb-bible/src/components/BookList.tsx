'use client';

import { BibleBook } from '@/types/bible';

interface BookListProps {
  books: BibleBook[];
  onBookSelect: (book: BibleBook) => void;
  testament: 'old' | 'new';
}

export default function BookList({ books, onBookSelect, testament }: BookListProps) {
  return (
    <div className="grid grid-cols-2 gap-[10px]">
      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => onBookSelect(book)}
          className="h-[50px] rounded-lg transition-colors hover:bg-gray-50 relative flex items-center"
          style={{
            backgroundColor: '#FFFFFF',
            fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
          }}
        >
          {/* 내부 동그라미 */}
          <div 
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center absolute"
            style={{
              left: '10px',
              backgroundColor: testament === 'old' ? '#CCE5FF' : '#FFD8D6'
            }}
          >
            <span 
              className="text-sm font-normal"
              style={{
                color: '#414141'
              }}
            >
              {book.id}
            </span>
          </div>
          
          {/* 책 이름 */}
          <span 
            className="font-semibold absolute"
            style={{
              left: '45px',
              fontSize: '14px',
              color: '#414141'
            }}
          >
            {book.name}
          </span>
        </button>
      ))}
    </div>
  );
}
