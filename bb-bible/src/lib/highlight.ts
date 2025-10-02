import { Highlight, HighlightStorage } from '@/types/bible';
import React from 'react';

const HIGHLIGHT_STORAGE_KEY = 'bb-bible-highlights';

// localStorage에서 하이라이트 데이터 로드
export function loadHighlights(): HighlightStorage {
  if (typeof window === 'undefined') {
    return { highlights: {} };
  }

  try {
    const stored = localStorage.getItem(HIGHLIGHT_STORAGE_KEY);
    if (!stored) {
      return { highlights: {} };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('하이라이트 데이터 로드 실패:', error);
    return { highlights: {} };
  }
}

// localStorage에 하이라이트 데이터 저장
export function saveHighlights(storage: HighlightStorage): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(HIGHLIGHT_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('하이라이트 데이터 저장 실패:', error);
  }
}

// 하이라이트 추가/업데이트
export function addHighlight(
  verseKey: string, 
  color: Highlight['color'], 
  note?: string
): void {
  const storage = loadHighlights();
  
  storage.highlights[verseKey] = {
    verseKey,
    color,
    timestamp: new Date().toISOString(),
    note: note?.trim() || undefined,
  };
  
  saveHighlights(storage);
}

// 하이라이트 제거
export function removeHighlight(verseKey: string): void {
  const storage = loadHighlights();
  delete storage.highlights[verseKey];
  saveHighlights(storage);
}

// 하이라이트 조회
export function getHighlight(verseKey: string): Highlight | undefined {
  const storage = loadHighlights();
  return storage.highlights[verseKey];
}

// 모든 하이라이트 조회
export function getAllHighlights(): Highlight[] {
  const storage = loadHighlights();
  return Object.values(storage.highlights);
}

// 하이라이트 토글 (있으면 제거, 없으면 추가)
export function toggleHighlight(
  verseKey: string, 
  color: Highlight['color'] = 'yellow'
): boolean {
  const existing = getHighlight(verseKey);
  
  if (existing) {
    removeHighlight(verseKey);
    return false; // 제거됨
  } else {
    addHighlight(verseKey, color);
    return true; // 추가됨
  }
}

// 하이라이트 색상 변경
export function changeHighlightColor(
  verseKey: string, 
  newColor: Highlight['color']
): void {
  const existing = getHighlight(verseKey);
  if (existing) {
    addHighlight(verseKey, newColor, existing.note);
  }
}

// 하이라이트 메모 업데이트
export function updateHighlightNote(verseKey: string, note: string): void {
  const existing = getHighlight(verseKey);
  if (existing) {
    addHighlight(verseKey, existing.color, note);
  }
}

// 하이라이트 색상에 따른 CSS 클래스
export function getHighlightClass(color: Highlight['color']): string {
  const classMap = {
    yellow: 'bg-yellow-200 dark:bg-yellow-800',
    blue: 'bg-blue-200 dark:bg-blue-800',
    green: 'bg-green-200 dark:bg-green-800',
    pink: 'bg-pink-200 dark:bg-pink-800',
  };
  
  return classMap[color];
}

// 커스텀 하이라이트 색상 스타일 - 텍스트 위치 변경 없이 배경색만 적용
export function getCustomHighlightStyle(): React.CSSProperties {
  return {
    backgroundColor: '#DFD4C4',
    borderRadius: '4px',
    padding: '8px 12px',
    margin: '0'
  };
}

// 하이라이트 통계
export function getHighlightStats(): {
  total: number;
  byColor: Record<Highlight['color'], number>;
} {
  const highlights = getAllHighlights();
  const byColor = {
    yellow: 0,
    blue: 0,
    green: 0,
    pink: 0,
  };
  
  highlights.forEach(highlight => {
    byColor[highlight.color]++;
  });
  
  return {
    total: highlights.length,
    byColor,
  };
}
