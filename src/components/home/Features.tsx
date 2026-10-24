import { FEATURES } from '@/docs/homeDocs';

// Icon chip colours, one per feature.
const CHIP_COLORS = [
  'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300',
  'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300',
  'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',
];

const Features = () => {
  return (
    <section aria-label="Why shop with us" className="container mt-4 md:mt-6">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {FEATURES.map((feature, index) => (
          <li
            key={feature.title}
            className="flex items-start gap-3 rounded-2xl glass p-4 md:items-center md:p-5"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${CHIP_COLORS[index % CHIP_COLORS.length]}`}
            >
              {feature.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {feature.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-slate-400 md:text-sm">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
