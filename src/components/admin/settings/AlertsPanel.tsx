'use client';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ApiStoreSettings } from '@/lib/api/types';
import { useUpdateStoreSettings } from '@/lib/query/admin';

const ALERTS = [
  { key: 'notifyNewOrder', label: 'New orders', hint: 'When a customer places an order.' },
  {
    key: 'notifyLowStock',
    label: 'Low stock',
    hint: 'When a product reaches the low-stock level.',
  },
  { key: 'notifyWeeklySummary', label: 'Weekly summary', hint: 'A sales summary every Saturday.' },
] as const;

// Which emails the owner wants. Saved right away; sending starts once email is set up.
const AlertsPanel = ({ settings }: { settings: ApiStoreSettings }) => {
  const update = useUpdateStoreSettings();

  return (
    <Panel title="Alerts">
      <p className="-mt-2 mb-3 text-sm text-gray-600 dark:text-slate-400">
        Your choices are saved now. Email delivery isn&apos;t switched on yet, so no alerts are sent
        until it is.
      </p>
      <ul className="divide-y divide-gray-100 dark:divide-white/10">
        {ALERTS.map(({ key, label, hint }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <Label
                htmlFor={`alert-${key}`}
                className="font-medium text-gray-900 dark:text-slate-100"
              >
                {label}
              </Label>
              <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">{hint}</p>
            </div>
            <Switch
              id={`alert-${key}`}
              checked={settings[key]}
              disabled={update.isPending}
              onCheckedChange={(checked) =>
                update.mutate(
                  { [key]: checked },
                  { onSuccess: () => toast.success(`${label} alerts ${checked ? 'on' : 'off'}`) },
                )
              }
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
};

export default AlertsPanel;
