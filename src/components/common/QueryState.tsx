'use client';
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import { errorMessage } from '@/lib/api/client';
import { cn } from '@/lib/utils';

// While a page's data loads.
export const PageLoader = ({
  label = 'Loading',
  className,
}: {
  label?: string;
  className?: string;
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      'flex min-h-[40vh] items-center justify-center gap-2 text-sm text-gray-500 dark:text-slate-400',
      className,
    )}
  >
    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
    {label}…
  </div>
);

// When a request failed: what went wrong, and a way to try again.
export const ErrorState = ({
  error,
  onRetry,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}) => (
  <div
    role="alert"
    className={cn(
      'flex flex-col items-center rounded-xl border border-dashed border-red/30 bg-white/60 px-6 py-12 text-center dark:bg-slate-900/60',
      className,
    )}
  >
    <AlertTriangle className="size-8 text-red" aria-hidden="true" />
    <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">{errorMessage(error)}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/5"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Try again
      </button>
    )}
  </div>
);
