'use client';
import { forwardRef } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

export interface FormProblem {
  id: string;
  message: string;
}

const describe = (path: string, message: string) => {
  const option = path.match(/^options\.(\d+)/);
  return option ? `Variants, option ${Number(option[1]) + 1}: ${message}` : message;
};

// Walks nested react-hook-form errors into a flat list of { field id, message }.
export const listProblems = (errors: FieldErrors, prefix = ''): FormProblem[] =>
  Object.entries(errors).flatMap(([key, value]) => {
    if (!value || key === 'ref' || key === 'type' || key === 'types') return [];
    const path = key === 'root' ? prefix : prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
      return value.message ? [{ id: path, message: describe(path, value.message) }] : [];
    }
    return typeof value === 'object' ? listProblems(value as FieldErrors, path) : [];
  });

// Moves focus to a field; array-level errors focus the first input inside the array.
const focusField = (id: string) => {
  const element =
    document.getElementById(id) ?? document.querySelector<HTMLElement>(`[id^="${id}."]`);
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element?.focus({ preventScroll: true });
};

// Shown above the form after a failed save, linking each problem to its field.
const ErrorSummary = forwardRef<HTMLDivElement, { problems: FormProblem[] }>(
  ({ problems }, ref) => (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      aria-labelledby="form-errors-title"
      className="mb-4 rounded-xl border border-red/30 bg-red/5 p-4 outline-none focus-visible:ring-2 focus-visible:ring-red/40"
    >
      <h2
        id="form-errors-title"
        className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-100"
      >
        <AlertCircle className="size-4 text-red" aria-hidden="true" />
        {problems.length === 1
          ? 'Fix 1 problem to save'
          : `Fix ${problems.length} problems to save`}
      </h2>
      <ul className="mt-2 space-y-1 pl-6 text-sm">
        {problems.map((problem) => (
          <li key={problem.id} className="list-disc text-red marker:text-red/60">
            <button
              type="button"
              onClick={() => focusField(problem.id)}
              className="rounded text-left underline underline-offset-2 hover:no-underline"
            >
              {problem.message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ),
);
ErrorSummary.displayName = 'ErrorSummary';

export default ErrorSummary;
