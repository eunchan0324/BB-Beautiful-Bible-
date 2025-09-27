// 성경 관련 타입 정의

export interface BibleVerse {
  book: string;     // "창", "마" 등
  chapter: number;  // 1, 2, 3...
  verse: number;    // 1, 2, 3...
  text: string;     // 구절 내용
}

export interface BibleBook {
  id: string;       // "창", "출", "레"...
  name: string;     // "창세기", "출애굽기"...
  chapters: number; // 총 장 수
  testament: 'old' | 'new'; // 구약/신약
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

// 하이라이팅 관련 타입
export interface Highlight {
  verseKey: string;     // "창1:1" 형식
  color: 'yellow' | 'blue' | 'green' | 'pink';
  timestamp: string;    // ISO 날짜
  note?: string;        // 선택적 메모
}

export interface HighlightStorage {
  highlights: Record<string, Highlight>;
}

// 원본 JSON 데이터 타입 (실제 bible.json 구조)
export interface BibleJsonData {
  [key: string]: string; // "창1:1": "태초에 하나님이..."
}

// 파싱된 성경 데이터 타입
export interface ParsedBibleData {
  [book: string]: {
    [chapter: number]: {
      [verse: number]: string;
    };
  };
}

// UI 상태 관련 타입
export interface FontSize {
  size: 'small' | 'large';
  className: string;
}

export interface NavigationState {
  currentBook?: string;
  currentChapter?: number;
  currentVerse?: number;
}
