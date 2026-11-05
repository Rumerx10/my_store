import { PiggyBank, UserPlus } from 'lucide-react';
import Panel from '@/components/common/Panel';
import { changeFrom, rangeInfo, type Dashboard } from '@/lib/dashboard';
import { formatCompactPrice } from '@/lib/utils';
import { Delta } from './chartKit';

// New customers and profit margin for the period, each against the period before.
const CustomersAndProfit = ({ data, className }: { data: Dashboard; className?: string }) => {
  const range = rangeInfo(data.range);
  const t = data.totals;
  const margin = t.revenue > 0 ? (t.profit / t.revenue) * 100 : undefined;
  const prevMargin = t.prevRevenue > 0 ? (t.prevProfit / t.prevRevenue) * 100 : undefined;
  const rows = [
    {
      icon: UserPlus,
      label: 'New customers',
      value: t.newCustomers.toLocaleString('en-US'),
      detail: `${t.prevNewCustomers.toLocaleString('en-US')} ${range.previous}`,
      change: changeFrom(t.newCustomers, t.prevNewCustomers),
      suffix: '%',
    },
    {
      icon: PiggyBank,
      label: 'Profit margin',
      value: margin === undefined ? '—' : `${margin.toFixed(1)}%`,
      detail: `${formatCompactPrice(t.profit)} profit on ${formatCompactPrice(t.revenue)}`,
      change: margin !== undefined && prevMargin !== undefined ? margin - prevMargin : undefined,
      suffix: ' pts',
    },
  ];

  return (
    <Panel title="Customers and profit" className={className}>
      <ul className="divide-y divide-gray-100 dark:divide-white/10">
        {rows.map(({ icon: Icon, ...row }) => (
          <li key={row.label} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600 dark:text-slate-400">{row.label}</p>
              <p className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                {row.value}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <Delta value={row.change} suffix={row.suffix} />
                {row.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
        Profit counts products that have a cost price.
      </p>
    </Panel>
  );
};

export default CustomersAndProfit;
