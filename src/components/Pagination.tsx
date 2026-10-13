import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationProps } from '@/types/table';

const Pagination = <TData,>({ table }: PaginationProps<TData>) => {
  const total = table.getFilteredRowModel().rows.length;
  if (total === 0) return null;

  const { pageIndex, pageSize } = table.getState().pagination;
  const first = pageIndex * pageSize + 1;
  const last = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/80 px-4 py-3 text-sm text-gray-600 md:px-5">
      <div className="flex items-center gap-2">
        <span id="rows-per-page">Rows</span>
        <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger className="h-9 w-[4.5rem]" aria-labelledby="rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          {first}–{last} of {total}
        </span>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="shadow-none"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="shadow-none"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
