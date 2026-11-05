import { cn } from '@/lib/utils';

// Bordered white surface with an optional title row, used across the dashboards.
const Panel = ({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={cn('rounded-xl glass p-5 md:p-6', className)}>
    {(title || action) && (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {title && <h2 className="text-base text-gray-900 dark:text-slate-100">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);

export default Panel;
