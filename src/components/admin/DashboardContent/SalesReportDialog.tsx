'use client';
import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApiSalesPeriod } from '@/lib/api/types';
import { useDownloadSalesReport, useStoreSettings } from '@/lib/query/admin';
import { useSession } from '@/lib/query/session';
import { cn } from '@/lib/utils';

const PERIODS: { value: ApiSalesPeriod; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All time' },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SELECT =
  'h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30';

// Today's date in Dhaka (the store's time zone), "YYYY-MM-DD".
const dhakaToday = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());

// Dates are handled as UTC midnights so the browser's own time zone never shifts the day.
const parse = (date: string) => new Date(`${date}T00:00:00Z`);
const longDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

// What the chosen report covers, as the server will read it (weeks run Monday to Sunday).
const covers = (period: ApiSalesPeriod, date: string, month: number, year: number) => {
  if (period === 'all') return 'Everything since your first order';
  if (period === 'year') return `1 January to 31 December ${year}`;
  if (period === 'month') return `${MONTHS[month - 1]} ${year}`;
  const day = parse(date);
  if (Number.isNaN(day.getTime())) return 'Pick a day';
  if (period === 'day') {
    return (
      day.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' }) + ` ${longDate(day)}`
    );
  }
  const monday = new Date(day.getTime() - ((day.getUTCDay() + 6) % 7) * 86_400_000);
  const sunday = new Date(monday.getTime() + 6 * 86_400_000);
  return `Monday ${longDate(monday)} to Sunday ${longDate(sunday)}`;
};

// The owner's "Download PDF" button and its dialog: pick a day, week, month, year or all time.
const SalesReportDialog = () => {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  if (user?.role !== 'OWNER') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 rounded-full shadow-none">
          <FileDown aria-hidden="true" />
          Download PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {/* Mounted only while open, so each opening starts from today. */}
        {open && <ReportForm onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
};

const ReportForm = ({ onDone }: { onDone: () => void }) => {
  const today = dhakaToday();
  const thisYear = Number(today.slice(0, 4));
  const thisMonth = Number(today.slice(5, 7));
  const settings = useStoreSettings();
  const firstYear = Math.min(
    thisYear,
    settings.data ? new Date(settings.data.createdAt).getFullYear() : thisYear - 2,
  );
  const years = Array.from({ length: thisYear - firstYear + 1 }, (_, i) => thisYear - i);

  const [period, setPeriod] = useState<ApiSalesPeriod>('month');
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(thisMonth);
  const [year, setYear] = useState(thisYear);
  const download = useDownloadSalesReport();

  const pickedDate =
    period === 'day' || period === 'week'
      ? date
      : period === 'month'
        ? `${year}-${String(month).padStart(2, '0')}-01`
        : period === 'year'
          ? `${year}-01-01`
          : undefined;
  const invalid = (period === 'day' || period === 'week') && (!date || date > today);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (invalid) return;
    download.mutate(
      { period, date: pickedDate },
      {
        onSuccess: () => {
          toast.success('Report downloaded');
          onDone();
        },
      },
    );
  };

  return (
    <form onSubmit={submit}>
      <DialogHeader>
        <DialogTitle>Download a sales report</DialogTitle>
        <DialogDescription>
          Revenue, profit, units, categories and best sellers as a PDF, in Bangladesh time.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-5 space-y-5">
        <div
          role="radiogroup"
          aria-label="Period"
          className="grid grid-cols-5 rounded-full bg-gray-100/90 p-1 dark:bg-white/10"
        >
          {PERIODS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={period === option.value}
              onClick={() => setPeriod(option.value)}
              className={cn(
                'h-8 whitespace-nowrap rounded-full px-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                period === option.value
                  ? 'bg-brand text-white shadow-[0_6px_16px_-8px_color-mix(in_srgb,var(--color-brand)_80%,transparent)]'
                  : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {(period === 'day' || period === 'week') && (
          <div className="space-y-1.5">
            <Label htmlFor="report-date">{period === 'day' ? 'Day' : 'Any day in the week'}</Label>
            <Input
              id="report-date"
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={invalid}
            />
          </div>
        )}

        {(period === 'month' || period === 'year') && (
          <div className={cn('grid gap-3', period === 'month' && 'grid-cols-2')}>
            {period === 'month' && (
              <div className="space-y-1.5">
                <Label htmlFor="report-month">Month</Label>
                <select
                  id="report-month"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className={SELECT}
                >
                  {MONTHS.map((name, i) => (
                    <option
                      key={name}
                      value={i + 1}
                      disabled={year === thisYear && i + 1 > thisMonth}
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="report-year">Year</Label>
              <select
                id="report-year"
                value={year}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setYear(next);
                  if (next === thisYear && month > thisMonth) setMonth(thisMonth);
                }}
                className={SELECT}
              >
                {years.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <p className="rounded-lg bg-brand-soft px-3 py-2.5 text-sm text-gray-700 dark:text-slate-300">
          <span className="text-gray-500 dark:text-slate-400">Covers: </span>
          {invalid ? 'Pick a day up to today' : covers(period, date, month, year)}
        </p>
      </div>

      <DialogFooter className="mt-6 gap-2">
        <Button type="button" variant="outline" className="shadow-none" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={invalid || download.isPending}>
          {download.isPending ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <FileDown aria-hidden="true" />
          )}
          {download.isPending ? 'Preparing…' : 'Download PDF'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SalesReportDialog;
