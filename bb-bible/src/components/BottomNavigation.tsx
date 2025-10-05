'use client';

import { Home, Book } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      id: 'home',
      label: '홈',
      icon: Home,
      path: '/',
    },
    {
      id: 'bible',
      label: '성경',
      icon: Book,
      path: '/bible',
    },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t safe-area-bottom"
      style={{ 
        backgroundColor: '#F0EEE7',
        borderColor: '#D2CFC8'
      }}
    >
      <div className="flex h-[101px] max-h-[13.47vh]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'bible'
            ? (pathname === '/bible' || pathname.startsWith('/bible/'))
            : pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="flex-1 flex flex-col items-center justify-center px-4"
            >
              {item.id === 'home' ? (
                <Image
                  src={isActive ? '/icons/home-filled-active.svg' : '/icons/home-filled-inactive.svg'}
                  alt="홈"
                  width={24}
                  height={24}
                  className="mb-1"
                />
              ) : item.id === 'bible' ? (
                <Image
                  src={isActive ? '/icons/bible-active.svg' : '/icons/bible-inactive.svg'}
                  alt="성경"
                  width={24}
                  height={24}
                  className="mb-1"
                />
              ) : (
                <Icon 
                  size={24} 
                  className="mb-1"
                  style={{
                    color: isActive ? '#8D8881' : '#D2CFC8',
                    fill: isActive ? '#8D8881' : 'transparent',
                    stroke: isActive ? '#8D8881' : '#D2CFC8'
                  }}
                />
              )}
              <span 
                className="text-xs font-medium"
                style={{ color: '#343434' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
