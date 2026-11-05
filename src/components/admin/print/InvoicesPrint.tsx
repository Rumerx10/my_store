'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, PackageCheck, Printer } from 'lucide-react';
import InvoiceSheet from '@/components/invoice/InvoiceSheet';
import RequireStaff from '@/components/admin/RequireStaff';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import type { ApiOrderStatus } from '@/lib/api/types';
import { useInvoices } from '@/lib/query/admin';
import { useAdminHref, useStorefrontUrl } from '@/components/admin/adminStore';

const ORDER_STATUSES: ApiOrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

const STATUS_TITLES: Partial<Record<ApiOrderStatus, string>> = {
  PENDING: 'Invoices for new orders',
  PROCESSING: 'Invoices for orders being packed',
  SHIPPED: 'Invoices for shipped orders',
};

// A4 is 210 mm wide: 793.7 CSS pixels.
const A4_WIDTH_PX = (210 / 25.4) * 96;

// Paper set-up while this page is open: A4 with no browser margins (each sheet has its own),
// and white paper whatever the screen theme.
const PAGE_CSS = `@page { size: A4 portrait; margin: 0; }
@media print { html, body { background: #fff !important; } }`;

// Shrinks the A4 preview on narrow screens; printing always uses the real size.
const useFitZoom = () => {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const update = () => setZoom(Math.min(1, (window.innerWidth - 24) / A4_WIDTH_PX));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return zoom;
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

// Waits for the sheets' fonts and logo, so the print dialog never shows a half-loaded page.
const sheetsReady = async () => {
  await nextFrame();
  await nextFrame();
  await document.fonts.ready;
  const images = [...document.querySelectorAll<HTMLImageElement>('.invoice-sheet img')];
  await Promise.all(
    images.map((image) =>
      image.complete
        ? undefined
        : new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          }),
    ),
  );
};

const Message = ({ title, text, back }: { title: string; text: string; back: string }) => (
  <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
    <PackageCheck className="size-10 text-gray-400 dark:text-slate-500" aria-hidden="true" />
    <h2 className="mt-4 text-lg font-semibold">{title}</h2>
    <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{text}</p>
    <Link
      href={back}
      className="mt-5 rounded text-sm font-medium text-brand hover:text-brand-hover"
    >
      Back to orders
    </Link>
  </div>
);

const InvoicesPreview = ({
  ids,
  status,
  autoPrint,
}: {
  ids?: string;
  status?: ApiOrderStatus;
  autoPrint: boolean;
}) => {
  const href = useAdminHref();
  const invoices = useInvoices({ ids, status });
  const zoom = useFitZoom();
  const data = invoices.data;
  const count = data?.invoices.length ?? 0;
  const single = count === 1 ? data?.invoices[0] : undefined;
  const title = single
    ? `Invoice ${single.number}`
    : status
      ? (STATUS_TITLES[status] ?? `Invoices for ${status.toLowerCase()} orders`)
      : `${count} invoices`;
  const back = ids && !ids.includes(',') ? href(`/orders/${ids}`) : href('/orders');

  // The tab's name is also the file name when the invoice is saved as a PDF.
  useEffect(() => {
    if (data) document.title = `${title} - ${data.store.name}`;
  }, [data, title]);

  // ?print=1 opens the print dialog once, when everything has loaded. The flag is dropped
  // first, so reloading the page doesn't print again.
  useEffect(() => {
    if (!autoPrint || count === 0) return;
    let stopped = false;
    sheetsReady().then(() => {
      if (stopped) return;
      const url = new URL(window.location.href);
      url.searchParams.delete('print');
      window.history.replaceState(window.history.state, '', url);
      window.print();
    });
    return () => {
      stopped = true;
    };
  }, [autoPrint, count]);

  // The label's QR code opens the order in the store's own shop.
  const storefront = useStorefrontUrl();
  const orderPage = (orderId: string) =>
    new URL(storefront(`/orders/${orderId}`), window.location.origin).toString();

  return (
    <div className="min-h-dvh bg-[#e3e5e9] text-gray-900 dark:bg-slate-950 dark:text-slate-100 print:min-h-0 print:bg-white">
      <style>{PAGE_CSS}</style>
      <div className="sticky top-0 z-10 border-b border-black/5 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-900/90 print:hidden">
        <div className="mx-auto flex max-w-[calc(210mm+2rem)] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={back}
              aria-label="Back to orders"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-gray-300 transition-colors hover:bg-gray-100 dark:ring-white/15 dark:hover:bg-white/5"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">{title}</h1>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                Print on A4, portrait, at 100% scale. Cut each sheet along the dashed line.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={count === 0}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer className="size-4" aria-hidden="true" />
            {count > 1 ? `Print ${count} invoices` : 'Print'}
          </button>
        </div>
      </div>

      {!ids && !status ? (
        <Message
          title="No orders chosen"
          text="Open an order, or the orders being packed, and choose Print invoice."
          back={back}
        />
      ) : invoices.isPending ? (
        <PageLoader label="Preparing the invoices" />
      ) : !data ? (
        <ErrorState error={invoices.error} onRetry={() => invoices.refetch()} />
      ) : count === 0 ? (
        <Message
          title="Nothing to print"
          text="No orders are in this step right now. Invoices appear here once orders reach it."
          back={back}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 px-3 py-6 print:block print:p-0">
          {data.invoices.map((invoice) => (
            <InvoiceSheet
              key={invoice.orderId}
              store={data.store}
              invoice={invoice}
              trackUrl={orderPage(invoice.orderId)}
              className="break-after-page shadow-[0_1px_2px_rgb(0_0_0/0.08),0_14px_36px_-14px_rgb(15_23_42/0.4)] last:break-after-auto print:shadow-none print:[zoom:1]!"
              style={{ zoom }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Printable invoices: /admin/<store>/print/invoices?ids=<id,id> or ?status=PROCESSING, plus
// &print=1 to open the print dialog straight away. Staff only.
const InvoicesPrint = () => {
  const params = useSearchParams();
  const rawStatus = params.get('status');
  const status = ORDER_STATUSES.find((value) => value === rawStatus);
  return (
    <RequireStaff>
      <InvoicesPreview
        ids={params.get('ids') ?? undefined}
        status={status}
        autoPrint={params.get('print') === '1'}
      />
    </RequireStaff>
  );
};

export default InvoicesPrint;
