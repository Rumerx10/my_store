import { Phone, Scissors } from 'lucide-react';
import Barcode from './Barcode';
import QrCode from './QrCode';
import {
  amountInWords,
  areaLine,
  fullAddress,
  localPhone,
  money,
  printedDate,
  wholeMoney,
} from './format';
import type { InvoiceData, InvoiceStore } from './types';

// One order on one A4 sheet. The top half is the parcel label: who it's from, where it goes,
// the phone to call and the cash to collect, readable at arm's length. The bottom half is the
// customer's invoice, which goes inside the box. Everything is black on white so it prints
// cleanly on an office laser printer; the one solid block is the amount to collect.
//
// Fonts come from two CSS variables, --font-invoice (Latin, with a condensed width) and
// --font-invoice-bn (Bangla and ৳), and fall back to system fonts when they aren't set.

const SHEET_STYLE = {
  '--ink': '#000000',
  '--graphite': '#4a4f57',
  '--rule': '#c6cbd2',
  '--wash': '#f1f3f5',
  fontFamily:
    'var(--font-invoice, ui-sans-serif), var(--font-invoice-bn, sans-serif), system-ui, sans-serif',
  // The site's stylistic sets are for its own font, not this one.
  fontFeatureSettings: 'normal',
} as React.CSSProperties;

// Condensed and heavy: the routing details a courier reads first.
const ROUTING = '[font-stretch:75%] font-extrabold tabular-nums';
const LABEL = 'text-[7.5pt] font-medium text-(--graphite)';

const StoreLines = ({ store, large = false }: { store: InvoiceStore; large?: boolean }) => (
  <div className="flex min-w-0 items-start gap-[3mm]">
    {store.logoUrl && (
      // A plain img prints the logo as it is, with no resizing service in between.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={store.logoUrl}
        alt=""
        className="h-[10mm] w-auto max-w-[26mm] shrink-0 object-contain"
      />
    )}
    <div className="min-w-0 leading-snug">
      <p className={large ? 'text-[12pt] font-bold leading-tight' : 'text-[9.5pt] font-semibold'}>
        {store.name}
      </p>
      {store.address && <p className="mt-[0.6mm]">{store.address}</p>}
      <p className="tabular-nums">{localPhone(store.phone)}</p>
      <p className="text-(--graphite)">{large ? store.website : store.email}</p>
      {!large && <p className="text-(--graphite)">{store.website}</p>}
    </div>
  </div>
);

// The amount the courier collects, or why there is nothing to collect.
const CollectBox = ({ invoice, currency }: { invoice: InvoiceData; currency: string }) => {
  const { due } = invoice.totals;
  if (invoice.state !== 'open') {
    return (
      <div className="rounded-[2.5mm] border-[1.4pt] border-dashed border-(--ink) px-[4mm] py-[3.5mm]">
        <p className={`${ROUTING} text-[17pt] leading-tight`}>Do not deliver</p>
        <p className="mt-[1mm] text-[8pt]">This order was {invoice.state}.</p>
      </div>
    );
  }
  if (due > 0) {
    return (
      <div className="rounded-[2.5mm] bg-(--ink) px-[4mm] py-[3.5mm] text-white">
        <p className="text-[8pt] font-medium text-white/80">Collect from the customer</p>
        <p className={`${ROUTING} mt-[0.8mm] text-[27pt] font-black leading-none`}>
          {Number.isInteger(due) ? wholeMoney(due, currency) : money(due, currency)}
        </p>
        <p className="mt-[1.8mm] text-[7.5pt] text-white/80">{invoice.paymentMethod}</p>
      </div>
    );
  }
  return (
    <div className="rounded-[2.5mm] border-[1.4pt] border-(--ink) px-[4mm] py-[3.5mm]">
      <p className="text-[8pt] font-medium text-(--graphite)">Paid in full</p>
      <p className={`${ROUTING} mt-[0.8mm] text-[19pt] leading-none`}>Collect nothing</p>
      <p className="mt-[1.8mm] text-[7.5pt] text-(--graphite)">
        {invoice.paymentMethod}
        {invoice.paidAt ? `, ${printedDate(invoice.paidAt)}` : ''}
      </p>
    </div>
  );
};

const ParcelLabel = ({
  store,
  invoice,
  trackUrl,
}: {
  store: InvoiceStore;
  invoice: InvoiceData;
  trackUrl?: string;
}) => {
  const { shipTo } = invoice;
  const units = invoice.lines.reduce((sum, line) => sum + line.quantity, 0);
  const facts = [
    { label: 'Delivery', value: invoice.deliveryMethod },
    { label: 'In this parcel', value: `${units} ${units === 1 ? 'item' : 'items'}` },
    { label: 'Placed', value: printedDate(invoice.placedAt) },
  ];

  return (
    <section
      aria-label="Parcel label"
      className="flex h-[148.5mm] shrink-0 flex-col px-[10mm] pb-[6mm] pt-[9mm]"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[3.5mm] border-[1.4pt] border-(--ink)">
        <header className="flex items-start justify-between gap-[6mm] border-b-[0.75pt] border-(--ink) px-[6mm] py-[4mm] text-[8pt]">
          <div className="min-w-0">
            <p className={LABEL}>From</p>
            <div className="mt-[1mm]">
              <StoreLines store={store} large />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end text-right">
            <p className={LABEL}>Order</p>
            <p className={`${ROUTING} text-[19pt] leading-none`}>{invoice.number}</p>
            <Barcode
              value={String(invoice.number)}
              height="12mm"
              moduleMm={0.4}
              className="mt-[2mm]"
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 gap-[6mm] px-[6mm] py-[4.5mm]">
          <div className="min-w-0 flex-1">
            <p className={LABEL}>Deliver to</p>
            {/* Line height leaves room for Bangla vowel marks above and below. */}
            <p className={`${ROUTING} mt-[1.5mm] text-[27pt] leading-[1.15]`}>{areaLine(shipTo)}</p>
            <p className="mt-[2mm] text-[15pt] font-semibold leading-tight">{shipTo.name}</p>
            <p className="mt-[3mm] inline-flex items-center gap-[2.2mm] rounded-[2mm] border-[1.5pt] border-(--ink) py-[1.4mm] pl-[2.4mm] pr-[3.2mm]">
              <Phone className="size-[5.2mm]" strokeWidth={2.4} aria-label="Phone" />
              <span className={`${ROUTING} text-[25pt] leading-none tracking-[0.01em]`}>
                {localPhone(shipTo.phone)}
              </span>
            </p>
            <p className="mt-[3mm] max-w-[110mm] text-[11pt] leading-snug">{fullAddress(shipTo)}</p>
            {invoice.note && (
              <p className="mt-[3mm] max-w-[110mm] border-l-[2pt] border-(--ink) pl-[2.5mm] text-[9.5pt] leading-snug">
                {invoice.note}
              </p>
            )}
          </div>

          <div className="flex w-[54mm] shrink-0 flex-col gap-[4mm]">
            <CollectBox invoice={invoice} currency={store.currency} />
            {/* Bottom corner, where scanners expect a code on a parcel label. */}
            {trackUrl && (
              <div className="mt-auto flex items-center gap-[2.5mm]">
                <QrCode value={trackUrl} size="21mm" className="-m-[1.5mm] shrink-0" />
                <p className="text-[7.5pt] leading-snug text-(--graphite)">
                  Scan to see this order and its delivery status.
                </p>
              </div>
            )}
          </div>
        </div>

        <dl className="grid grid-cols-3 border-t-[0.75pt] border-(--ink)">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="min-w-0 border-l-[0.75pt] border-(--rule) px-[6mm] py-[2.2mm] first:border-l-0"
            >
              <dt className="text-[7pt] text-(--graphite)">{fact.label}</dt>
              <dd className="truncate text-[9pt] font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

// Where to cut: drawn on the half-page line itself, taking up no height, so the two halves
// stay exactly A5 each.
const CutLine = () => (
  <div
    role="separator"
    className="absolute inset-x-[5mm] top-[148.5mm] border-t-[0.75pt] border-dashed border-(--graphite)"
  >
    <span className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[1.5mm] bg-white px-[2.5mm] text-[7pt] text-(--graphite)">
      <Scissors className="size-[3.2mm]" aria-hidden="true" />
      Cut here. Tape the top half to the parcel and put this invoice inside.
    </span>
  </div>
);

const TotalRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-[4mm] py-[0.7mm]">
    <dt className="text-(--graphite)">{label}</dt>
    <dd className="tabular-nums">{value}</dd>
  </div>
);

const InvoiceBody = ({ store, invoice }: { store: InvoiceStore; invoice: InvoiceData }) => {
  const { totals, shipTo } = invoice;
  const cur = store.currency;
  const paid = totals.paid > 0 || totals.due === 0;
  const status =
    invoice.state === 'open'
      ? `${invoice.paymentMethod}, ${paid ? 'paid' : 'not paid yet'}`
      : `Order ${invoice.state}`;

  return (
    // When a long order runs onto another page, the padding repeats there too.
    <section
      aria-label="Invoice"
      className="flex flex-1 flex-col px-[10mm] pb-[8mm] pt-[8mm] [box-decoration-break:clone]"
    >
      <header className="grid grid-cols-[1.05fr_1fr_1fr] gap-[6mm] text-[8pt] leading-snug">
        <div>
          <h2 className="text-[18pt] font-semibold leading-none tracking-[-0.01em]">Invoice</h2>
          <dl className="mt-[3mm] grid grid-cols-[auto_1fr] gap-x-[3mm] gap-y-[0.6mm]">
            <dt className="text-(--graphite)">Number</dt>
            <dd className="font-semibold tabular-nums">{invoice.number}</dd>
            <dt className="text-(--graphite)">Date</dt>
            <dd>{printedDate(invoice.placedAt)}</dd>
            <dt className="text-(--graphite)">Payment</dt>
            <dd>{status}</dd>
            {store.taxId && (
              <>
                <dt className="text-(--graphite)">BIN</dt>
                <dd className="tabular-nums">{store.taxId}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="min-w-0">
          <p className={LABEL}>From</p>
          <div className="mt-[1mm]">
            <StoreLines store={store} />
          </div>
        </div>
        <div className="min-w-0">
          <p className={LABEL}>Billed to</p>
          <p className="mt-[1mm] text-[9.5pt] font-semibold">{shipTo.name}</p>
          <p className="tabular-nums">{localPhone(shipTo.phone)}</p>
          <p>{fullAddress(shipTo)}</p>
          {invoice.email && <p className="text-(--graphite)">{invoice.email}</p>}
        </div>
      </header>

      <table className="mt-[6mm] w-full border-collapse text-[8.5pt]">
        <thead>
          <tr className="border-b-[0.75pt] border-(--ink) text-left text-[7.5pt] text-(--graphite)">
            <th scope="col" className="w-[7mm] py-[1.5mm] pr-[2mm] font-medium">
              #
            </th>
            <th scope="col" className="py-[1.5mm] font-medium">
              Item
            </th>
            <th scope="col" className="w-[13mm] py-[1.5mm] text-right font-medium">
              Qty
            </th>
            <th scope="col" className="w-[30mm] py-[1.5mm] text-right font-medium">
              Unit price
            </th>
            <th scope="col" className="w-[32mm] py-[1.5mm] text-right font-medium">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((line, i) => (
            <tr
              key={`${line.sku}-${i}`}
              className="border-b-[0.5pt] border-(--rule) align-top [break-inside:avoid]"
            >
              <td className="py-[1.8mm] pr-[2mm] tabular-nums text-(--graphite)">{i + 1}</td>
              <td className="py-[1.8mm] pr-[4mm]">
                <p className="font-medium leading-snug">{line.title}</p>
                <p className="text-[7.5pt] text-(--graphite)">
                  SKU {line.sku}
                  {line.variant ? `, ${line.variant}` : ''}
                </p>
              </td>
              <td className="py-[1.8mm] text-right tabular-nums">{line.quantity}</td>
              <td className="py-[1.8mm] text-right tabular-nums">{money(line.unitPrice, cur)}</td>
              <td className="py-[1.8mm] text-right font-medium tabular-nums">
                {money(line.total, cur)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-[5mm] flex items-start justify-between gap-[10mm] [break-inside:avoid]">
        <div className="min-w-0 flex-1 space-y-[3.5mm] text-[8.5pt] leading-snug">
          <div>
            <p className={LABEL}>Amount in words</p>
            <p className="mt-[0.5mm] font-medium">{amountInWords(totals.total, cur)}</p>
          </div>
          {store.note && (
            <div>
              <p className={LABEL}>From {store.name}</p>
              <p className="mt-[0.5mm] whitespace-pre-line">{store.note}</p>
            </div>
          )}
        </div>
        <dl className="w-[74mm] shrink-0 text-[8.5pt]">
          <TotalRow label="Subtotal" value={money(totals.subtotal, cur)} />
          {totals.discount > 0 && (
            <TotalRow
              label={totals.couponCode ? `Discount (${totals.couponCode})` : 'Discount'}
              value={money(-totals.discount, cur)}
            />
          )}
          <TotalRow
            label={`Delivery (${invoice.deliveryMethod})`}
            value={money(totals.delivery, cur)}
          />
          {totals.installation > 0 && (
            <TotalRow label="Installation" value={money(totals.installation, cur)} />
          )}
          {totals.vat > 0 && <TotalRow label="VAT" value={money(totals.vat, cur)} />}
          <div className="mt-[1.2mm] flex justify-between gap-[4mm] border-t-[0.75pt] border-(--ink) pt-[1.5mm] text-[11pt] font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(totals.total, cur)}</dd>
          </div>
          {totals.paid > 0 && <TotalRow label="Paid" value={money(-totals.paid, cur)} />}
          <div className="mt-[1.5mm] flex justify-between gap-[4mm] rounded-[1.5mm] bg-(--wash) px-[2.5mm] py-[1.6mm] text-[10pt] font-semibold">
            <dt>Amount due</dt>
            <dd className="tabular-nums">{money(totals.due, cur)}</dd>
          </div>
        </dl>
      </div>

      <footer className="mt-auto flex items-end justify-between gap-[8mm] border-t-[0.5pt] border-(--rule) pt-[3mm] text-[7.5pt] leading-snug text-(--graphite)">
        <p className="max-w-[120mm]">
          Questions about this order? Call {localPhone(store.phone)} or write to {store.email}, and
          give invoice number {invoice.number}.
        </p>
        <p className="shrink-0 text-right">
          Computer-generated invoice.
          <br />
          No signature required.
        </p>
      </footer>
    </section>
  );
};

const InvoiceSheet = ({
  store,
  invoice,
  trackUrl,
  className = '',
  style,
}: {
  store: InvoiceStore;
  invoice: InvoiceData;
  // Where the label's QR code points, e.g. the customer's order page. No QR code without it.
  trackUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <article
    aria-label={`Invoice ${invoice.number}`}
    // In print the sheet is a millimetre short of A4, so rounding never pushes a footer onto a
    // page of its own. The black "collect" block prints even with background graphics off.
    className={`invoice-sheet relative flex min-h-[297mm] w-[210mm] flex-col bg-white text-[8.5pt] leading-[1.4] text-(--ink) [-webkit-print-color-adjust:exact] [print-color-adjust:exact] print:min-h-[296mm] ${className}`}
    style={{ ...SHEET_STYLE, ...style }}
  >
    <ParcelLabel store={store} invoice={invoice} trackUrl={trackUrl} />
    <CutLine />
    <InvoiceBody store={store} invoice={invoice} />
  </article>
);

export default InvoiceSheet;
