'use client';

import { useRouter } from 'next/navigation';
import { ResolvedTheme } from '@/types/bible';

interface ChapterNavProps {
  bookName: string;
  chapter: number;
  effectiveTheme: ResolvedTheme;
  isVisible: boolean;
  prevUrl?: string;
  nextUrl?: string;
}

const CHAPTER_NAV_THEME_COLORS: Record<
  ResolvedTheme,
  {
    background: string;
    pillBackground: string;
    text: string;
  }
> = {
  light: {
    background: '#FFFFFF',
    pillBackground: '#F0EEE7',
    text: '#343434',
  },
  dark: {
    background: '#171717',
    pillBackground: '#232323',
    text: '#F3EFE8',
  },
};

export default function ChapterNavigation({
  bookName,
  chapter,
  effectiveTheme,
  isVisible,
  prevUrl,
  nextUrl,
}: ChapterNavProps) {
  const router = useRouter();
  const colors = CHAPTER_NAV_THEME_COLORS[effectiveTheme];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center items-start pt-[15px] transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{
        backgroundColor: colors.background,
        height: '100px',
      }}
    >
      <div
        className="flex justify-between items-center w-[315px] h-[50px] rounded-[50px] px-4"
        style={{ backgroundColor: colors.pillBackground }}
      >
        <button
          onClick={() => prevUrl && router.push(prevUrl)}
          disabled={!prevUrl}
          className="flex items-center justify-center text-[22px] disabled:opacity-30"
          style={{ color: colors.text }}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <span className="font-pretendard font-semibold text-[18px]" style={{ color: colors.text }}>
          {bookName} {chapter}
          {bookName === '시편' ? '편' : '장'}
        </span>

        <button
          onClick={() => nextUrl && router.push(nextUrl)}
          disabled={!nextUrl}
          className="flex items-center justify-center text-[22px] disabled:opacity-30"
          style={{ color: colors.text }}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
