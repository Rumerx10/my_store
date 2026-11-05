import Link from 'next/link';

// Paths outside every vendor segment. A vendor's own 404 (with its header and footer) is its
// segment's not-found.tsx, e.g. app/next-power/not-found.tsx.
const NotFound = () => (
  <main className="flex min-h-dvh items-center justify-center p-6">
    <div className="w-full max-w-md rounded-3xl glass p-8 text-center">
      <p className="text-sm font-medium tabular-nums text-brand">404</p>
      <h1 className="mt-2 text-2xl text-gray-900 dark:text-slate-100">Page not found</h1>
      <p className="mt-3 text-gray-600 dark:text-slate-400">
        This address does not belong to any store.
      </p>
      <Link
        href="/next-power"
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98]"
      >
        Go to NextPower
      </Link>
    </div>
  </main>
);

export default NotFound;
