'use client';

import { useRouter } from 'next/navigation';

interface ChapterNavProps {
    bookName: string;
    chapter: number;
    isVisible: boolean;
    prevUrl?: string;
    nextUrl?: string;
}

export default function ChapterNavigation({ bookName, chapter, isVisible, prevUrl, nextUrl }: ChapterNavProps) {
    const router = useRouter();

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center items-start pt-[15px] transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
            style={{
                backgroundColor: '#FFFFFF',
                height: '100px'
            }}
        >
            <div className='flex justify-between items-center w-[315px] h-[50px] bg-[#F0EEE7] rounded-[50px] px-4'>
                {/* 왼쪽 화살표 */}
                <button
                    onClick={() => prevUrl && router.push(prevUrl)}
                    disabled={!prevUrl}
                    className='flex items-center justify-center text-[#343434] text-[22px] disabled:opacity-30'
                >
                    <span className='material-symbols-outlined'>chevron_left</span>
                </button>

                {/* 중앙 텍스트 */}
                <span className='font-pretendard font-semibold text-[18px] text-[#343434]'>
                    {bookName} {chapter}{bookName === '시편' ? '편' : '장'}
                </span>

                {/* 오른쪽 화살표 */}
                <button
                    onClick={() => nextUrl && router.push(nextUrl)}
                    disabled={!nextUrl}
                    className='flex items-center justify-center text-[#343434] text-[22px] disabled:opacity-30'
                >
                    <span className='material-symbols-outlined'>chevron_right</span>
                </button>
            </div>
        </div>
    );
}