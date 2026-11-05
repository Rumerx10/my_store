import { HomeIcon } from '@/components/common/homeIcons';
import type { ApiHomeSection } from '@/lib/api/types';
import { cn } from '@/lib/utils';

type Steps = Extract<ApiHomeSection, { type: 'steps' }>;

const COLUMNS = ['', '', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-2 lg:grid-cols-4'];

// Numbered steps: they are a sequence, so the numbers carry meaning.
const HowItWorks = ({ section }: { section: Steps }) => {
  const headingId = `${section.id}-title`;
  return (
    <section aria-labelledby={headingId} className="container mt-14 md:mt-20">
      <div className="rounded-3xl glass p-6 md:p-10">
        <h2 id={headingId} className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-slate-400 md:text-base">
            {section.subtitle}
          </p>
        )}
        <ol
          className={cn(
            'mt-8 grid gap-4',
            COLUMNS[section.steps.length] ?? 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {section.steps.map((step, index) => (
            <li
              key={`${index}-${step.title}`}
              className="rounded-2xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                  <HomeIcon name={step.icon} className="size-5" />
                </span>
                <span className="text-3xl font-semibold tabular-nums text-gradient opacity-40">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-slate-100">
                {step.title}
              </h3>
              {step.text && (
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                  {step.text}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
