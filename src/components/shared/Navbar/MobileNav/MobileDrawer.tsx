'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Left drawer for the mobile menu. It stays mounted and slides with translate-x and a CSS
// transition, so opening and closing both animate. While closed it is inert (not focusable).
// duration-300! keeps the slide even when the OS asks for reduced motion (see globals.css).
const MobileDrawer = ({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // While open: Escape closes, Tab stays inside, the page behind does not scroll,
  // and focus goes back to where it was (the menu button) on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>('[data-close]')?.focus({ preventScroll: true });
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      html.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="lg:hidden">
      {/* Backdrop fades in and out. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-[3px] transition-opacity duration-300! ease-out',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        ref={panel}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open}
        data-drawer=""
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'fixed inset-y-0 left-0 z-[60] flex w-[86%] max-w-sm flex-col overflow-y-auto rounded-r-3xl border-r border-white/70 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-lift backdrop-blur-2xl',
          'transform-gpu transition-transform duration-300! ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        {description && <p className="sr-only">{description}</p>}
        <button
          type="button"
          data-close=""
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-2.5 top-2.5 flex size-10 items-center justify-center rounded-full text-gray-500 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-slate-100"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default MobileDrawer;
