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
      'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-gray-300 bg-white/90 px-4 text-sm font-medium text-gray-800 transition-colors hover:bg-white',
      className,
    )}
  >
    <ArrowLeft className="size-4" aria-hidden="true" />
    {children}
  </Link>
);

export default BackButton;
