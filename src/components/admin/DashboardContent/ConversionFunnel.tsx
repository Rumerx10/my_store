import Panel from '@/components/dashboard/Panel';
import { funnelFor, type TimeRange } from '@/docs/adminDashboard';
import { formatCompact } from '@/lib/utils';
import { CHART } from './chartKit';

// Visitors to orders, step by step. The biggest drop is the step worth fixing first.
const ConversionFunnel = ({
  timeRange,
  className,
}: {
  timeRange: TimeRange;
  className?: string;
}) => {
  const { steps, conversion } = funnelFor(timeRange);
  const first = steps[0].count || 1;
  const kept = steps.map((step, i) => (i === 0 ? 1 : step.count / (steps[i - 1].count || 1)));
  // The step that loses the largest share of the shoppers who reached it.
  const worst = kept.reduce(
    (worstIndex, rate, i) => (i > 0 && rate < kept[worstIndex] ? i : worstIndex),
    1,
  );

  return (
    <Panel title="Conversion funnel" className={className}>
      <p className="-mt-2 mb-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{conversion.toFixed(1)}%</span> of visits end
        in an order.
      </p>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={step.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-gray-700">{step.label}</span>
              <span className="tabular-nums">
                <span className="font-semibold text-gray-900">{formatCompact(step.count)}</span>
                {i > 0 && (
                  <span className="ml-1.5 text-xs text-gray-500">
                    {(kept[i] * 100).toFixed(0)}% of previous step
                  </span>
                )}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-brand-soft/60" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{
                  width: `${Math.max((step.count / first) * 100, 1.5)}%`,
                  background: CHART.current,
                }}
              />
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-lg bg-sun-soft/70 px-3 py-2 text-xs text-sun-ink">
        Biggest drop: <span className="font-semibold">{steps[worst - 1].label.toLowerCase()}</span>{' '}
        → <span className="font-semibold">{steps[worst].label.toLowerCase()}</span>. Only{' '}
        {(kept[worst] * 100).toFixed(0)}% move on, so this step has the most room to grow.
      </p>
    </Panel>
  );
};

export default ConversionFunnel;
