'use client';

import { Copy, Highlighter, Share2, X } from 'lucide-react';
import { HighlightColor, ResolvedTheme } from '@/types/bible';
import {
  DARK_HIGHLIGHT_BACKGROUND_COLORS,
  HIGHLIGHT_BACKGROUND_COLORS,
} from '@/lib/highlight';

interface SelectionActionBarProps {
  selectedReference: string;
  effectiveTheme: ResolvedTheme;
  isColorPickerOpen: boolean;
  onClearSelection: () => void;
  onToggleColorPicker: () => void;
  onShare: () => void;
  onCopy: () => void;
  onHighlightRemove: () => void;
  onHighlightColorSelect: (color: HighlightColor) => void;
}

const ACTION_BAR_THEME_COLORS: Record<
  ResolvedTheme,
  {
    surface: string;
    border: string;
    text: string;
    icon: string;
    removePatternA: string;
    removePatternB: string;
  }
> = {
  light: {
    surface: '#FFFFFF',
    border: '#D2CFC8',
    text: '#414141',
    icon: '#8D8881',
    removePatternA: '#E8E5DF',
    removePatternB: '#FFFFFF',
  },
  dark: {
    surface: '#232323',
    border: 'rgba(255, 255, 255, 0.10)',
    text: '#F3EFE8',
    icon: '#C8BDAE',
    removePatternA: '#3A3A3A',
    removePatternB: '#232323',
  },
};

const HIGHLIGHT_COLOR_ORDER: HighlightColor[] = ['yellow', 'blue', 'green', 'pink'];

export default function SelectionActionBar({
  selectedReference,
  effectiveTheme,
  isColorPickerOpen,
  onClearSelection,
  onToggleColorPicker,
  onShare,
  onCopy,
  onHighlightRemove,
  onHighlightColorSelect,
}: SelectionActionBarProps) {
  const colors = ACTION_BAR_THEME_COLORS[effectiveTheme];
  const highlightColors =
    effectiveTheme === 'dark' ? DARK_HIGHLIGHT_BACKGROUND_COLORS : HIGHLIGHT_BACKGROUND_COLORS;

  return (
    <div
      className="fixed left-0 right-0 z-40 px-5 safe-area-bottom"
      style={{ bottom: '16px' }}
    >
      {isColorPickerOpen && (
        <div className="mx-auto mb-3 flex max-w-[768px] justify-end">
          <div
            className="flex items-center gap-2 rounded-full border px-3 py-2"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              boxShadow:
                effectiveTheme === 'dark'
                  ? '0 8px 24px rgba(0, 0, 0, 0.28)'
                  : '0 8px 24px rgba(65, 65, 65, 0.10)',
            }}
          >
            <button
              type="button"
              onClick={onHighlightRemove}
              className="flex h-7 w-7 items-center justify-center rounded-full border transition-transform hover:scale-105"
              style={{
                borderColor: colors.border,
                background: `conic-gradient(from 45deg, ${colors.removePatternA} 0deg 90deg, ${colors.removePatternB} 90deg 180deg, ${colors.removePatternA} 180deg 270deg, ${colors.removePatternB} 270deg 360deg)`,
              }}
              aria-label="하이라이트 해제"
            >
              <span
                className="block h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    effectiveTheme === 'dark' ? 'rgba(35, 35, 35, 0.88)' : 'rgba(255, 255, 255, 0.85)',
                }}
              />
            </button>
            {HIGHLIGHT_COLOR_ORDER.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onHighlightColorSelect(color)}
                className="h-7 w-7 rounded-full border transition-transform hover:scale-105"
                style={{
                  backgroundColor: highlightColors[color],
                  borderColor: colors.border,
                }}
                aria-label={`${color} highlight`}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="mx-auto flex items-center gap-2 rounded-[22px] border px-4 py-3"
        style={{
          maxWidth: '768px',
          backgroundColor: colors.surface,
          borderColor: colors.border,
          boxShadow:
            effectiveTheme === 'dark'
              ? '0 10px 28px rgba(0, 0, 0, 0.35)'
              : '0 8px 24px rgba(65, 65, 65, 0.12)',
        }}
      >
        <button
          type="button"
          onClick={onClearSelection}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ color: colors.text }}
          aria-label="선택 해제"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="min-w-0 flex-1">
          <div
            className="truncate font-semibold"
            style={{
              color: colors.text,
              fontSize: '16px',
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {selectedReference}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleColorPicker}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: colors.icon }}
            aria-label="하이라이트 색상"
          >
            <Highlighter size={19} />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: colors.icon }}
            aria-label="공유"
          >
            <Share2 size={19} />
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: colors.icon }}
            aria-label="복사"
          >
            <Copy size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
