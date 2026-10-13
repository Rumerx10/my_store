import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const;
const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
  pending: 'Order placed',
  processing: 'Being packed',
  shipped: 'On the way',
  delivered: 'Delivered',
};

// Four-step delivery progress bar. Cancelled orders are handled by the caller.
const OrderProgress = ({ status }: { status: string }) => {
  const currentStep = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <ol className="grid grid-cols-4 gap-2">
      {STEPS.map((step, index) => {
        const done = index <= currentStep;
        return (
          <li key={step} className="flex flex-col gap-2">
            <span
              className={cn('h-1.5 rounded-full', done ? 'bg-brand' : 'bg-gray-200')}
              aria-hidden="true"
            />
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-medium md:text-sm',
                done ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {done && <Check className="hidden size-3.5 text-brand sm:block" aria-hidden="true" />}
              {STEP_LABELS[step]}
              {index === currentStep && <span className="sr-only">(current)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderProgress;
