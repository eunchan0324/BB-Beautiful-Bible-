'use client';

import { ReactNode } from 'react';

interface DropdownHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
}

export default function DropdownHeader({ 
  title, 
  subtitle, 
  rightElement 
}: DropdownHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          BB
        </h1>
      </div>
      
      <div className="h-[36px] flex items-center">
        {rightElement || (
          title && (
            <div className="text-right">
              <div className="font-medium text-gray-700">
                {title}
              </div>
              {subtitle && (
                <div className="text-sm text-gray-500">
                  {subtitle}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
