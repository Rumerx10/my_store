import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// "Back to …" link styled as a button, placed at the right of a page's title row.
const BackButton = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={cn(
      'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-gray-300 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 px-4 text-sm font-medium text-gray-800 dark:text-slate-200 transition-colors hover:bg-white dark:hover:bg-slate-900',
      className,
    )}
  >
    <ArrowLeft className="size-4" aria-hidden="true" />
    {children}
  </Link>
);

export default BackButton;
