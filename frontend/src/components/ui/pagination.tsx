import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  totalItems,
}: PaginationProps) {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200'>
      {/* Left side - rows per page selector */}
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-700'>Rows per page:</span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Center - page info */}
      <div className='text-sm text-gray-700'>
        {startItem}–{endItem} of {totalItems}
      </div>

      {/* Right side - navigation buttons */}
      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className='h-8 w-8 p-0'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <span className='text-sm text-gray-700 px-2'>
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className='h-8 w-8 p-0'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
