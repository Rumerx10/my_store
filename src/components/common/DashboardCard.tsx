import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Flat stat tile for the dashboards. `value` is shown as given, so format money before passing it.
const DashboardCard = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
}) => {
  return (
    <div className="h-full rounded-xl glass p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600 dark:text-slate-400">{title}</p>
        <Icon className="size-4 shrink-0 text-gray-400 dark:text-slate-500" aria-hidden="true" />
      </div>
      <p className="mt-2 break-words text-xl font-semibold tabular-nums text-gray-900 dark:text-slate-100 md:text-2xl">
        {value}
      </p>
      {subtitle && (
        <p
          className={cn(
            'mt-1 text-xs',
            trend === 'up' && 'text-hGreen',
            trend === 'down' && 'text-red',
            !trend && 'text-gray-500 dark:text-slate-400',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
