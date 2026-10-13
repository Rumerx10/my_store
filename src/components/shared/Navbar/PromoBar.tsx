import Link from 'next/link';
import { COUPONS } from '@/lib/checkout';

// Slim offer strip above the header. It advertises the first real coupon, so it
// disappears on its own if there are none.
const PromoBar = () => {
  const coupon = COUPONS[0];
  if (!coupon) return null;

  return (
    <div className="bg-brand text-white">
      <p className="container flex h-8 items-center justify-center gap-2 truncate text-xs font-medium sm:text-[13px]">
        <span className="truncate">
          {coupon.discount}% off your order with code{' '}
          <span className="rounded bg-white/20 px-1.5 py-0.5 font-semibold tabular-nums">
            {coupon.code}
          </span>
        </span>
        <Link
          href="/deals"
          className="shrink-0 rounded underline decoration-white/60 underline-offset-2 hover:decoration-white"
        >
          Shop deals
        </Link>
      </p>
    </div>
  );
};

export default PromoBar;
