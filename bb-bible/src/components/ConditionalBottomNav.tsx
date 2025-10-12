'use client';

import { usePathname } from 'next/navigation';
import BottomNavigation from './BottomNavigation';

export default function ConditionalBottomNav() {
    const pathname = usePathname();
    const isChapterPage = /^\/bible\/[^\/]+\/\d+$/.test(pathname);

    if (isChapterPage) return null; // 구절 읽기 페이지에서 숨김
    return <BottomNavigation />;
}