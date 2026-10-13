import { HOW_IT_WORKS } from '@/docs/homeDocs';

const HowItWorks = () => {
  return (
    <section aria-labelledby="how-it-works" className="container mt-14 md:mt-20">
      <div className="rounded-3xl glass p-6 md:p-10">
        <h2 id="how-it-works" className="text-2xl text-gray-900 md:text-3xl">
          How ordering works
        </h2>
        <p className="mt-2 max-w-xl text-sm text-gray-600 md:text-base">
          From search to your doorstep in four steps.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step) => (
            <li
              key={step.step}
              className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                  {step.icon}
                </span>
                <span className="text-3xl font-semibold tabular-nums text-gradient opacity-40">
                  {step.step}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
