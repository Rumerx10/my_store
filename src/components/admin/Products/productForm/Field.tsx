import { cn } from '@/lib/utils';

// Label, control, hint and inline error for one form field.
// Error and hint ids follow `${id}-error` / `${id}-hint` so controls can reference them.
const Field = ({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn('space-y-1.5', className)}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-slate-100">
      {label}
    </label>
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="text-xs text-gray-500 dark:text-slate-400">
        {hint}
      </p>
    )}
    {error && (
      <p id={`${id}-error`} className="text-sm text-red">
        {error}
      </p>
    )}
  </div>
);

export default Field;

// aria props for a control inside <Field>.
export const fieldAria = (id: string, error?: string, hasHint = false) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
});

export const inputClass =
  'h-10 w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 px-3 text-sm text-gray-900 dark:text-slate-100 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-brand focus:ring-3 focus:ring-brand/15 aria-invalid:border-red aria-invalid:focus:ring-red/15';

// Number input with a currency prefix. React 19 passes `ref` through as a normal prop.
export const MoneyInput = ({ className, ...props }: React.ComponentProps<'input'>) => (
  <div className="relative">
    <span
      className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500 dark:text-slate-400"
      aria-hidden="true"
    >
      ৳
    </span>
    <input
      type="number"
      inputMode="decimal"
      step="0.01"
      min="0"
      className={cn(inputClass, 'pl-7 tabular-nums', className)}
      {...props}
    />
  </div>
);
