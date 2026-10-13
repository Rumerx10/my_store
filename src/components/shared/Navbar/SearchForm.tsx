'use client';

import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchForm = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
  autoFocus = false,
  className,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
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
        className="pointer-events-none absolute left-3.5 size-4 text-gray-400"
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
        className="h-11 w-full rounded-full border border-white/80 bg-white/70 pl-10 pr-24 shadow-card text-sm text-gray-900 placeholder:text-gray-500 transition-colors focus:border-brand focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            inputRef.current?.focus();
          }}
          className="absolute right-[5.25rem] flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-1.5 h-8 rounded-full bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
