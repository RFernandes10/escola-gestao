'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md transition-colors disabled:opacity-30"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-standard)'
        }}
        title="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className="min-w-[40px] h-10 rounded-md transition-colors font-medium text-sm"
              style={{ 
                backgroundColor: page === currentPage 
                  ? (isDark ? '#5e6ad2' : '#5e6ad2')
                  : 'var(--bg-surface)',
                color: page === currentPage 
                  ? 'white' 
                  : 'var(--text-secondary)',
                border: '1px solid ' + (page === currentPage ? 'transparent' : 'var(--border-standard)')
              }}
            >
              {page}
            </button>
          ) : (
            <span 
              key={idx} 
              className="px-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {page}
            </span>
          )
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md transition-colors disabled:opacity-30"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-standard)'
        }}
        title="Próxima página"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}