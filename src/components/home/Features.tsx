import { FEATURES } from '@/docs/homeDocs';

// Icon chip colours, one per feature.
const CHIP_COLORS = [
  'bg-rose-100 text-rose-600',
  'bg-violet-100 text-violet-600',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-600',
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
              <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
              <p className="text-xs text-gray-600 md:text-sm">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
