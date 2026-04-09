'use client';

import { useState } from 'react';
import { ChevronDownIcon, Monitor, Moon, Sun } from 'lucide-react';
import { FontSize, ResolvedTheme, ThemeMode } from '@/types/bible';

interface StickyHeaderProps {
  bookName: string;
  chapterNumber: number;
  fontSize: FontSize['size'];
  themeMode: ThemeMode;
  effectiveTheme: ResolvedTheme;
  isVisible: boolean;
  onBookChapterSelect: () => void;
  onFontSizeChange: (size: FontSize['size']) => void;
  onThemeModeChange: (mode: ThemeMode) => void;
}

const HEADER_THEME_COLORS: Record<
  ResolvedTheme,
  {
    background: string;
    text: string;
    controlBackground: string;
    dropdownBackground: string;
    divider: string;
  }
> = {
  light: {
    background: '#FFFFFF',
    text: '#414141',
    controlBackground: '#F0EEE7',
    dropdownBackground: 'rgba(240, 238, 231, 0.92)',
    divider: 'rgba(217, 217, 217, 0.8)',
  },
  dark: {
    background: '#171717',
    text: '#F3EFE8',
    controlBackground: '#2A2A2A',
    dropdownBackground: 'rgba(42, 42, 42, 0.96)',
    divider: 'rgba(255, 255, 255, 0.12)',
  },
};

export default function StickyHeader({
  bookName,
  chapterNumber,
  fontSize,
  themeMode,
  effectiveTheme,
  isVisible,
  onBookChapterSelect,
  onFontSizeChange,
  onThemeModeChange,
}: StickyHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const colors = HEADER_THEME_COLORS[effectiveTheme];
  const ThemeIcon = themeMode === 'system' ? Monitor : themeMode === 'dark' ? Moon : Sun;

  return (
    <div
      className={`fixed left-0 right-0 z-50 px-[30px] py-5 transition-all duration-300 ease-in-out ${
        isVisible ? 'top-0 opacity-100' : '-top-full opacity-0'
      }`}
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBookChapterSelect}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <span
            className="font-semibold"
            style={{
              fontSize: '22px',
              color: colors.text,
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {bookName} {chapterNumber}
            {bookName === '시편' ? '편' : '장'}
          </span>
          <ChevronDownIcon className="w-6 h-6" style={{ color: colors.text }} />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onThemeModeChange(
                themeMode === 'system' ? 'light' : themeMode === 'light' ? 'dark' : 'system',
              )
            }
            className="relative rounded-md transition-opacity hover:opacity-70"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: colors.controlBackground,
              color: colors.text,
              padding: '0',
              display: 'block',
            }}
            aria-label={`테마 변경: ${themeMode}`}
          >
            <ThemeIcon
              size={16}
              strokeWidth={2}
              className="absolute"
              style={{
                color: colors.text,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center justify-center gap-1 hover:opacity-70 transition-opacity rounded-md"
              style={{
                width: '73px',
                height: '36px',
                backgroundColor: colors.controlBackground,
                fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                padding: '0',
              }}
            >
              <span
                className="font-bold"
                style={{
                  fontSize: '14px',
                  color: colors.text,
                  lineHeight: '1',
                }}
              >
                {fontSize === 'small' ? '작은글' : '큰글'}
              </span>
              <ChevronDownIcon
                className="w-3.5 h-3.5 shrink-0"
                style={{
                  color: colors.text,
                  width: '14px',
                  height: '14px',
                }}
              />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute top-full right-0 mt-1 rounded-md z-50"
                style={{
                  backgroundColor: colors.dropdownBackground,
                  backdropFilter: 'blur(6px)',
                  width: '73px',
                }}
              >
                <div>
                  <button
                    onClick={() => {
                      onFontSizeChange('small');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left transition-colors rounded-t-md"
                    style={{
                      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '14px',
                      color: colors.text,
                      fontWeight: 'medium',
                      width: '73px',
                      height: '36px',
                      paddingLeft: '10px',
                      paddingRight: '16px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    작은글
                  </button>
                  <div className="h-px" style={{ backgroundColor: colors.divider }} />
                  <button
                    onClick={() => {
                      onFontSizeChange('large');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left transition-colors rounded-b-md"
                    style={{
                      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '14px',
                      color: colors.text,
                      fontWeight: 'medium',
                      width: '73px',
                      height: '36px',
                      paddingLeft: '10px',
                      paddingRight: '16px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    큰글
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
