'use client';

import { Copy, Highlighter, Share2, X } from 'lucide-react';
import { HighlightColor } from '@/types/bible';
import { HIGHLIGHT_BACKGROUND_COLORS } from '@/lib/highlight';

interface SelectionActionBarProps {
  selectedReference: string;
  isColorPickerOpen: boolean;
  onClearSelection: () => void;
  onToggleColorPicker: () => void;
  onShare: () => void;
  onCopy: () => void;
  onHighlightRemove: () => void;
  onHighlightColorSelect: (color: HighlightColor) => void;
}

const HIGHLIGHT_COLOR_ORDER: HighlightColor[] = ['yellow', 'blue', 'green', 'pink'];

export default function SelectionActionBar({
  selectedReference,
  isColorPickerOpen,
  onClearSelection,
  onToggleColorPicker,
  onShare,
  onCopy,
  onHighlightRemove,
  onHighlightColorSelect,
}: SelectionActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-5 pb-4 safe-area-bottom">
      {isColorPickerOpen && (
        <div className="mx-auto mb-3 flex max-w-[768px] justify-end">
          <div
            className="flex items-center gap-2 rounded-full border px-3 py-2"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#D2CFC8',
              boxShadow: '0 8px 24px rgba(65, 65, 65, 0.10)',
            }}
          >
            <button
              type="button"
              onClick={onHighlightRemove}
              className="flex h-7 w-7 items-center justify-center rounded-full border transition-transform hover:scale-105"
              style={{
                borderColor: '#D2CFC8',
                background:
                  'conic-gradient(from 45deg, #E8E5DF 0deg 90deg, #FFFFFF 90deg 180deg, #E8E5DF 180deg 270deg, #FFFFFF 270deg 360deg)',
              }}
              aria-label="하이라이트 해제"
            >
              <span
                className="block h-3 w-3 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
              />
            </button>
            {HIGHLIGHT_COLOR_ORDER.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onHighlightColorSelect(color)}
                className="h-7 w-7 rounded-full border transition-transform hover:scale-105"
                style={{
                  backgroundColor: HIGHLIGHT_BACKGROUND_COLORS[color],
                  borderColor: '#D2CFC8',
                }}
                aria-label={`${color} 하이라이트`}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="mx-auto flex items-center gap-2 rounded-[22px] border px-4 py-3"
        style={{
          maxWidth: '768px',
          backgroundColor: '#FFFFFF',
          borderColor: '#D2CFC8',
          boxShadow: '0 8px 24px rgba(65, 65, 65, 0.12)',
        }}
      >
        <button
          type="button"
          onClick={onClearSelection}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ color: '#414141' }}
          aria-label="선택 해제"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="min-w-0 flex-1">
          <div
            className="truncate font-semibold"
            style={{
              color: '#414141',
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
            style={{ color: '#8D8881' }}
            aria-label="하이라이트 색상"
          >
            <Highlighter size={19} />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: '#8D8881' }}
            aria-label="공유"
          >
            <Share2 size={19} />
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: '#8D8881' }}
            aria-label="복사"
          >
            <Copy size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
