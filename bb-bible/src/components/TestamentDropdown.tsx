'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface TestamentDropdownProps {
  value: 'old' | 'new';
  onChange: (value: 'old' | 'new') => void;
}

export default function TestamentDropdown({ value, onChange }: TestamentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'old' as const, label: '구약' },
    { value: 'new' as const, label: '신약' },
  ];

  const currentOption = options.find(option => option.value === value);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue: 'old' | 'new') => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[73px] h-[36px] px-3 rounded-lg transition-colors backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <span 
          className="font-bold text-sm"
          style={{
            color: value === 'old' ? '#3F74AB' : '#8C4643'
          }}
        >
          {currentOption?.label}
        </span>
        <ChevronDown 
          size={14} 
          className="transition-transform"
          style={{
            color: '#414141',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-1 w-[73px] rounded-lg backdrop-blur-sm z-50 overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          {options.map((option, index) => (
            <div key={option.value}>
              <button
                onClick={() => handleSelect(option.value)}
                className="w-full px-3 py-2 text-left hover:bg-white/20 transition-colors"
                style={{
                  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                <span 
                  className="font-medium text-sm"
                  style={{
                    color: '#414141'
                  }}
                >
                  {option.label}
                </span>
              </button>
              {index < options.length - 1 && (
                <div 
                  className="h-px"
                  style={{
                    backgroundColor: 'rgba(217, 217, 217, 0.8)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
