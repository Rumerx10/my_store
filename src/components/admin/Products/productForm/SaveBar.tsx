'use client';
import { ChevronDown, Copy, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type SaveIntent = 'save' | 'add-new' | 'duplicate';

const secondaryClass =
  'inline-flex h-10 items-center gap-2 rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-gray-800 dark:text-slate-200 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50';

// Sticky bar with the save actions, always in reach while scrolling the form.
const SaveBar = ({
  isNew,
  isDirty,
  isSubmitting,
  onSave,
  onDiscard,
}: {
  isNew: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  onSave: (intent: SaveIntent) => void;
  onDiscard: () => void;
}) => (
  <div className="sticky bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom)+0.75rem)] z-30 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl glass px-4 py-3">
    <p
      className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300"
      aria-live="polite"
    >
      <span
        className={cn('size-2 rounded-full', isDirty ? 'bg-sun' : 'bg-green')}
        aria-hidden="true"
      />
      {isDirty ? 'Unsaved changes' : isNew ? 'New product' : 'All changes saved'}
    </p>

    <div className="flex flex-wrap items-center gap-2">
      {isDirty && (
        <button
          type="button"
          onClick={onDiscard}
          className="h-10 rounded-full px-4 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-white/80 dark:hover:bg-slate-900/80"
        >
          Discard
        </button>
      )}
      <button
        type="button"
        onClick={() => onSave('duplicate')}
        disabled={isSubmitting}
        className={cn(secondaryClass, 'hidden md:inline-flex')}
      >
        <Copy className="size-4" aria-hidden="true" />
        Save and duplicate
      </button>
      <button
        type="button"
        onClick={() => onSave('add-new')}
        disabled={isSubmitting}
        className={cn(secondaryClass, 'hidden md:inline-flex')}
      >
        <PlusCircle className="size-4" aria-hidden="true" />
        Save and add another
      </button>

      <div className="flex">
        <button
          type="button"
          onClick={() => onSave('save')}
          disabled={isSubmitting}
          className="h-10 rounded-l-full bg-brand pl-5 pr-4 text-sm font-semibold text-white disabled:opacity-60 md:rounded-full md:px-5"
        >
          {isNew ? 'Save product' : 'Save changes'}
        </button>
        {/* On small screens the other save actions sit behind this menu. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            disabled={isSubmitting}
            className="flex h-10 items-center rounded-r-full border-l border-white/30 bg-brand px-2.5 text-white md:hidden"
            aria-label="More save options"
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer" onSelect={() => onSave('add-new')}>
              <PlusCircle aria-hidden="true" />
              Save and add another
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onSelect={() => onSave('duplicate')}>
              <Copy aria-hidden="true" />
              Save and duplicate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
);

export default SaveBar;
