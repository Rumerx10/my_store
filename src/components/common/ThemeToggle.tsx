'use client';
import { useEffect, useId, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Sets the `dark` class on <html> and remembers the choice in localStorage.theme, which the
// script in app/layout.tsx reads on the next visit (the Tailwind docs approach).
const setTheme = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {}
};

// Follows the html class, so every control stays in step whichever one changed it.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};
const useIsDark = () =>
  useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );

// Desktop navbar icon button. The icon follows the html class through dark: utilities, so the
// first render is right without reading the theme in React.
const ThemeToggle = ({ className }: { className?: string }) => {
  // Not-found pages raised by notFound() in a client component are served from Next's bare
  // error document, which skips the head script in app/layout.tsx. Apply the theme here too.
  useEffect(() => {
    let theme: string | null = null;
    try {
      theme = localStorage.getItem('theme');
    } catch {}
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setTheme(!document.documentElement.classList.contains('dark'))}
      className={className}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  );
};

// Mobile menu row: "Dark mode" with an on/off switch.
export const ThemeSwitch = ({ className }: { className?: string }) => {
  const dark = useIsDark();
  const id = useId();
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Moon className="size-[18px] text-gray-500 dark:text-slate-400" aria-hidden="true" />
      <label htmlFor={id} className="flex-1 cursor-pointer">
        Dark mode
      </label>
      <Switch id={id} checked={dark} onCheckedChange={setTheme} />
    </div>
  );
};

export default ThemeToggle;
