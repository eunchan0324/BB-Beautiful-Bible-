'use client';

interface ChapterGridProps {
  totalChapters: number;
  onChapterSelect: (chapter: number) => void;
}

export default function ChapterGrid({ totalChapters, onChapterSelect }: ChapterGridProps) {
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  return (
    <div className="mt-[30px]">
      <div className="grid grid-cols-5 gap-[10px]">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() => onChapterSelect(chapter)}
            className="w-[58px] h-[40px] rounded-md flex items-center justify-center font-semibold transition-colors hover:bg-gray-50"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#414141',
              fontSize: '18px',
              fontFamily: 'Glory, -apple-system, BlinkMacSystemFont, sans-serif'
            }}
          >
            {chapter}
          </button>
        ))}
      </div>
    </div>
  );
}
