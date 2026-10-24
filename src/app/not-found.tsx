import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="container flex min-h-[60dvh] items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-3xl glass p-8 md:p-12">
        <p className="text-sm font-medium tabular-nums text-brand">404</p>
        <h1 className="mt-2 text-3xl text-gray-900 dark:text-slate-100 md:text-4xl">
          We can&apos;t find that page
        </h1>
        <p className="mt-3 max-w-md text-gray-600 dark:text-slate-400">
          The link may be out of date, or the page may have moved. Try the home page or browse the
          catalog.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98]"
          >
            Go to home page
          </Link>
          <Link
            href="/products"
            className="rounded text-sm font-medium text-gray-900 dark:text-slate-100 underline decoration-gray-300 dark:decoration-slate-600 underline-offset-4 transition-colors hover:decoration-gray-900 dark:hover:decoration-slate-100"
          >
            Browse all products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
