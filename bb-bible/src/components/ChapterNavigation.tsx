'use client';

import { useRouter } from 'next/navigation';

interface ChapterNavProps {
    bookName: string;
    chapter: number;
    prevUrl? : string;
    nextUrl? : string;
}

export default function ChapterNav({ bookName, chapter, prevUrl, nextUrl }: ChapterNavProps) {
    const router = useRouter();

    return (
        <div className="flex justify-center items-center w-full max-w-[375px] h-[100px] bg-white mx-auto">
            <div className='flex justify-between items-center w-[315px] h-[50px] bg-[#F0EEE7] rounded-[50px] px-4'>
                {/* 왼쪽 화살표 */}
                <button 
                    onClick={() => prevUrl && router.push(prevUrl)}
                    disabled={!prevUrl}
                    className='text-[#343434] text-[22px] disabled:opacity-30'
                    >
                        <span className='material-symbols-outlined'>chevron_left</span>
                    </button>
            </div>
        </div>
    )
}