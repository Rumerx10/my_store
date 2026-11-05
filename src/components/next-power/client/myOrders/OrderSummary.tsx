'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/common/BackButton';
import { Home, Loader2, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentOrOrderSuccess from '@/components/next-power/PaymentOrOrderSuccess';
import OrderTotals from '@/components/next-power/cart/OrderTotals';
import EmptyCart from '@/components/next-power/cart/EmptyCart';
import { PageLoader } from '@/components/common/QueryState';
import { ApiError, errorMessage } from '@/lib/api/client';
import { useCheckoutTotals } from '@/lib/checkout';
import { startSession } from '@/lib/query/account';
import { useAddresses } from '@/lib/query/addresses';
import { useCart, useCartActions } from '@/lib/query/cart';
import { usePlaceOrder } from '@/lib/query/orders';
import { useSession } from '@/lib/query/session';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch } from '@/redux/hooks';
import { checkoutDone } from '@/redux/features/checkout/checkoutSlice';

const EMPTY_ADDRESS = {
  name: '',
  phone: '',
  district: '',
  thana: '',
  villageOrWard: '',
  addressLine: '',
};

const FIELDS: { key: keyof typeof EMPTY_ADDRESS; label: string; type?: string }[] = [
  { key: 'name', label: 'Full name' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'district', label: 'District' },
  { key: 'thana', label: 'Thana / upazila' },
  { key: 'villageOrWard', label: 'Village / ward' },
  { key: 'addressLine', label: 'House, road (optional)' },
];

const cardClass =
  'flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 dark:border-white/10 p-4 font-normal transition-colors hover:bg-gray-50 dark:hover:bg-white/5 has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand-soft/60';

// Checkout: a delivery address, then the order is placed with cash on delivery. Guests give
// their details and a password, and the order creates their account.
const OrderSummary = () => {
  const dispatch = useAppDispatch();
  const { user, ready } = useSession();
  const { totals, cart, choices, loading } = useCheckoutTotals();
  const items = cart.items;
  const { data: addresses = [] } = useAddresses();
  const { refetch: refetchCart } = useCart();
  const { emptied } = useCartActions();
  const placeOrder = usePlaceOrder();
  // Until the shopper picks one, the default address is used.
  const [picked, setPicked] = useState('');
  const addressId = picked || ((addresses.find((a) => a.isDefault) ?? addresses[0])?.id ?? '');
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [password, setPassword] = useState('');
  const [placed, setPlaced] = useState<{ label: string; id: string } | null>(null);
  // One key per checkout, so a double click or a retry can't order twice.
  const idempotencyKey = useRef(crypto.randomUUID());

  const newAddress = !user || addresses.length === 0 || addressId === 'new';
  const busy = placeOrder.isPending;

  const submit = async () => {
    if (newAddress && FIELDS.some((f) => f.key !== 'addressLine' && !form[f.key].trim())) {
      toast.error('Fill in the delivery address.');
      return;
    }
    if (!user && password.length < 8) {
      toast.error('Choose a password of at least 8 characters.');
      return;
    }
    if (!totals.shippingOption.id) {
      toast.error('The store has no delivery options yet.');
      return;
    }
    const address = { ...form, addressLine: form.addressLine.trim() || undefined };
    try {
      const { order, auth } = await placeOrder.mutateAsync({
        idempotencyKey: idempotencyKey.current,
        shippingRateId: totals.shippingOption.id,
        paymentMethod: 'COD',
        couponCode: choices.couponCode ?? undefined,
        installation: choices.installation || undefined,
        ...(newAddress ? { address, saveAddress: true } : { addressId }),
        ...(user ? {} : { name: form.name, phone: form.phone, password }),
      });
      // A guest's order made their account: they're signed in now.
      if (auth) await startSession(auth);
      emptied();
      dispatch(checkoutDone());
      setPlaced({ label: `#${order.orderNumber}`, id: order.id });
      window.scrollTo({ top: 0 });
    } catch (error) {
      // Lines that can't be bought (sold out, too few left) show their reason in the list.
      const lines = error instanceof ApiError && (error.body as { items?: unknown })?.items;
      toast.error(
        lines ? 'Some items in your cart need attention before ordering.' : errorMessage(error),
      );
      refetchCart();
      // A refused order may be retried with changes; it needs a new key.
      if (error instanceof ApiError && error.status < 500) {
        idempotencyKey.current = crypto.randomUUID();
      }
    }
  };

  if (placed) {
    return (
      <div className="container py-10 md:py-16">
        <PaymentOrOrderSuccess
          title="Order placed"
          orderId={placed.label}
          trackHref={`/next-power/orders/${placed.id}`}
          subTitle="We'll call to confirm the order. Pay in cash when it arrives."
        />
      </div>
    );
  }

  if (loading || !ready) return <PageLoader label="Loading your cart" />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">Checkout</h1>
        <BackButton href="/next-power/cart">Back to cart</BackButton>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="delivery-heading" className="rounded-xl glass p-5 md:p-6">
            <h2 id="delivery-heading" className="text-lg text-gray-900 dark:text-slate-100">
              Delivery address
            </h2>
            {user && addresses.length > 0 && (
              <RadioGroup
                value={addressId}
                onValueChange={setPicked}
                className="mt-4 gap-3 md:grid-cols-2"
              >
                {addresses.map((addr) => (
                  <Label key={addr.id} htmlFor={`addr-${addr.id}`} className={cardClass}>
                    <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="mt-0.5" />
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-slate-100">
                        <Home
                          className="size-4 text-gray-500 dark:text-slate-400"
                          aria-hidden="true"
                        />
                        {addr.label ?? 'Address'}
                      </span>
                      <span className="block text-sm text-gray-700 dark:text-slate-300">
                        {addr.name}
                      </span>
                      <span className="block text-sm leading-snug text-gray-600 dark:text-slate-400">
                        {[addr.addressLine, addr.villageOrWard, addr.thana, addr.district]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                      <span className="block text-sm tabular-nums text-gray-500 dark:text-slate-400">
                        {addr.phone}
                      </span>
                    </span>
                  </Label>
                ))}
                <Label htmlFor="addr-new" className={cardClass}>
                  <RadioGroupItem value="new" id="addr-new" className="mt-0.5" />
                  <span className="font-medium text-gray-900 dark:text-slate-100">New address</span>
                </Label>
              </RadioGroup>
            )}
            {newAddress && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label htmlFor={`f-${field.key}`}>{field.label}</Label>
                    <Input
                      id={`f-${field.key}`}
                      type={field.type ?? 'text'}
                      value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  </div>
                ))}
                {!user && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="f-password">Password for your account</Label>
                    <Input
                      id="f-password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Already have an account?{' '}
                      <Link
                        href="/next-power/login?next=/next-power/checkout"
                        className="font-medium text-brand hover:text-brand-hover"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section aria-labelledby="items-heading" className="rounded-xl glass p-5 md:p-6">
            <h2 id="items-heading" className="text-lg text-gray-900 dark:text-slate-100">
              Items ({totals.itemCount})
            </h2>
            <ul className="mt-4 divide-y divide-gray-100 dark:divide-white/10">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-slate-100">
                      {item.title}
                    </p>
                    {item.variant && (
                      <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                        {item.variant}
                      </p>
                    )}
                    {item.problem && <p className="text-xs text-red">{item.problem}</p>}
                    <p className="text-sm tabular-nums text-gray-500 dark:text-slate-400">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside
          aria-label="Order total"
          className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start"
        >
          <div className="rounded-xl glass p-5 md:p-6">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Order total</h2>
            <div className="mt-4">
              <OrderTotals totals={totals} />
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={busy}
                onClick={submit}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-medium text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Truck className="size-4" aria-hidden="true" />
                )}
                Place order · cash on delivery
              </button>
              {totals.shippingOption.days && (
                <p className="text-center text-xs text-gray-500 dark:text-slate-400">
                  Delivery in {totals.shippingOption.days}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderSummary;
