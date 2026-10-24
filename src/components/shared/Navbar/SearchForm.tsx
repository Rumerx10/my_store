'use client';

import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchForm = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
  autoFocus = false,
  compact = false,
  className,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  // Slim version for the desktop bar: no Search button, Enter submits.
  compact?: boolean;
  className?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={cn('relative flex items-center', className)}
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 size-4 text-gray-400 dark:text-slate-500"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id="site-search"
        type="search"
        autoFocus={autoFocus}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products and brands"
        className={cn(
          'w-full rounded-full border text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 transition-colors focus:border-brand focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-3 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden',
          compact
            ? 'h-10 border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-white/10 pl-10 pr-10 hover:bg-slate-100 dark:hover:bg-white/10'
            : 'h-11 border-white/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 pl-10 pr-24 shadow-card',
        )}
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            inputRef.current?.focus();
          }}
          className={cn(
            'absolute flex size-8 items-center justify-center rounded-full text-gray-400 dark:text-slate-500 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-slate-300',
            compact ? 'right-1' : 'right-[5.25rem]',
          )}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        type="submit"
        hidden={compact}
        className="absolute right-1.5 h-8 rounded-full bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
