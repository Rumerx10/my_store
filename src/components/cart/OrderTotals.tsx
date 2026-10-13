import { formatPrice } from '@/lib/utils';
import { calculateTotals, VAT_RATE } from '@/lib/checkout';

type Totals = ReturnType<typeof calculateTotals>;

// The line items under every order summary: subtotal, discount, delivery, VAT, total.
const OrderTotals = ({ totals }: { totals: Totals }) => {
  const rows = [
    {
      label: `Subtotal (${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'})`,
      value: formatPrice(totals.subTotal),
    },
    ...(totals.coupon
      ? [
          {
            label: `Promo ${totals.coupon.code} (−${totals.coupon.discount}%)`,
            value: `−${formatPrice(totals.couponDiscount)}`,
            className: 'text-green',
          },
        ]
      : []),
    { label: `Delivery · ${totals.shippingOption.name}`, value: formatPrice(totals.shipping) },
    ...(totals.giftWrapFee > 0 ? [{ label: 'Gift wrap', value: formatPrice(totals.giftWrapFee) }] : []),
    { label: `VAT (${VAT_RATE}%)`, value: formatPrice(totals.vat) },
  ];

  return (
    <div>
      <dl className="space-y-2.5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-gray-600">{row.label}</dt>
            <dd className={`tabular-nums text-gray-900 ${row.className ?? ''}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-gray-200 pt-4">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="text-xl font-semibold tabular-nums text-gray-900">
          {formatPrice(totals.total)}
        </span>
      </div>
    </div>
  );
};

export default OrderTotals;
