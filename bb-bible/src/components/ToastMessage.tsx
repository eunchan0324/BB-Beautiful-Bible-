'use client';

interface ToastMessageProps {
  message: string;
}

export default function ToastMessage({ message }: ToastMessageProps) {
  return (
    <div className="fixed bottom-[108px] left-1/2 z-50 -translate-x-1/2 px-4">
      <div
        className="rounded-full px-4 py-2"
        style={{
          backgroundColor: 'rgba(65, 65, 65, 0.92)',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 8px 24px rgba(65, 65, 65, 0.18)',
          whiteSpace: 'nowrap',
        }}
      >
        {message}
      </div>
    </div>
  );
}
