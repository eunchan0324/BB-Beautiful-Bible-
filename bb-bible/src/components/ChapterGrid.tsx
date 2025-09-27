'use client';

interface ChapterGridProps {
  totalChapters: number;
  onChapterSelect: (chapter: number) => void;
}

export default function ChapterGrid({ totalChapters, onChapterSelect }: ChapterGridProps) {
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-3">
      {chapters.map((chapter) => (
        <button
          key={chapter}
          onClick={() => onChapterSelect(chapter)}
          className="aspect-square bg-white border border-gray-200 rounded-lg flex items-center justify-center font-medium text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-colors"
        >
          {chapter}
        </button>
      ))}
    </div>
  );
}
