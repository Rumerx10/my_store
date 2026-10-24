import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

// Column header that toggles sorting for the admin tables.
const SortHeader = <T,>({ column, label }: { column: Column<T, unknown>; label: string }) => {
  const sorted = column.getIsSorted();
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-gray-900 dark:hover:text-slate-100"
    >
      {label}
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  );
};

export default SortHeader;
