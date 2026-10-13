'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Home, Building2, Truck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import PaymentGateway from '@/components/PaymentGateway';
import PaymentOrOrderSuccess from '@/components/PaymentOrOrderSuccess';
import OrderTotals from '@/components/cart/OrderTotals';
import EmptyCart from '@/components/cart/EmptyCart';
import { DELIVERY_ADDRESSES } from '@/docs/checkout';
import { calculateTotals } from '@/lib/checkout';
import { formatPrice } from '@/lib/utils';
import { addOrder, PaymentMethodId } from '@/redux/features/order/orderSlice';
import { clearCart } from '@/redux/features/cart/cartSlice';

type Step = 'review' | 'pay' | 'done';

const newOrderId = () => {
  const now = new Date();
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  return `NM-${yymm}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { items, shippingId, couponCode, giftWrap } = useSelector((state: RootState) => state.cart);
  const [step, setStep] = useState<Step>('review');
  const [addressId, setAddressId] = useState(DELIVERY_ADDRESSES[0].id);
  const [placed, setPlaced] = useState<{ id: string; method: PaymentMethodId } | null>(null);

  const totals = calculateTotals(items, { shippingId, couponCode, giftWrap });
  const address = DELIVERY_ADDRESSES.find((a) => a.id === addressId) ?? DELIVERY_ADDRESSES[0];

  const placeOrder = (method: PaymentMethodId) => {
    const id = newOrderId();
    dispatch(
      addOrder({
        id,
        date: new Date().toISOString().slice(0, 10),
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: Math.round(totals.total * 100) / 100,
        status: 'pending',
        paymentMethod: method,
        paymentStatus: method === 'cod' ? 'unpaid' : 'paid',
        address: { label: address.label, name: address.name, line: address.line, phone: address.phone },
      }),
    );
    dispatch(clearCart());
    setPlaced({ id, method });
    setStep('done');
    window.scrollTo({ top: 0 });
  };

  if (step === 'done' && placed) {
    return (
      <div className="container py-10 md:py-16">
        <PaymentOrOrderSuccess
          title={placed.method === 'cod' ? 'Order placed' : 'Payment received, order placed'}
          orderId={placed.id}
          subTitle={
            placed.method === 'cod'
              ? "We'll call to confirm the order. Pay in cash when it arrives."
              : "We've emailed your receipt. You can follow the delivery from My orders."
          }
        />
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="container py-6 md:py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 rounded text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to cart
      </Link>
      <h1 className="mt-3 text-2xl text-gray-900 md:text-3xl">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          {step === 'pay' ? (
            <PaymentGateway
              payable={totals.total}
              onPaid={placeOrder}
              onBack={() => setStep('review')}
            />
          ) : (
            <>
              <section
                aria-labelledby="delivery-heading"
                className="rounded-xl glass p-5 md:p-6"
              >
                <h2 id="delivery-heading" className="text-lg text-gray-900">
                  Delivery address
                </h2>
                <RadioGroup value={addressId} onValueChange={setAddressId} className="mt-4 gap-3 md:grid-cols-2">
                  {DELIVERY_ADDRESSES.map((addr) => {
                    const Icon = addr.id === 'home' ? Home : Building2;
                    return (
                      <Label
                        key={addr.id}
                        htmlFor={`addr-${addr.id}`}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 font-normal transition-colors hover:bg-gray-50 has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand-soft/60"
                      >
                        <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="mt-0.5" />
                        <span className="min-w-0 flex-1 space-y-1">
                          <span className="flex items-center gap-2 font-medium text-gray-900">
                            <Icon className="size-4 text-gray-500" aria-hidden="true" />
                            {addr.label}
                          </span>
                          <span className="block text-sm text-gray-700">{addr.name}</span>
                          <span className="block text-sm leading-snug text-gray-600">{addr.line}</span>
                          <span className="block text-sm tabular-nums text-gray-500">{addr.phone}</span>
                        </span>
                      </Label>
                    );
                  })}
                </RadioGroup>
                <Link
                  href="/profile/address-book"
                  className="mt-4 inline-block rounded text-sm font-medium text-brand hover:text-brand-hover"
                >
                  Manage addresses
                </Link>
              </section>

              <section
                aria-labelledby="items-heading"
                className="rounded-xl glass p-5 md:p-6"
              >
                <h2 id="items-heading" className="text-lg text-gray-900">
                  Items ({totals.itemCount})
                </h2>
                <ul className="mt-4 divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 py-3">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm tabular-nums text-gray-500">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>

        <aside
          aria-label="Payment"
          className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start"
        >
          <div className="rounded-xl glass p-5 md:p-6">
            <h2 className="text-lg text-gray-900">Order total</h2>
            <div className="mt-4">
              <OrderTotals totals={totals} />
            </div>
            {step === 'review' && (
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('pay');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98]"
                >
                  <CreditCard className="size-4" aria-hidden="true" />
                  Pay now
                </button>
                <button
                  type="button"
                  onClick={() => placeOrder('cod')}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <Truck className="size-4" aria-hidden="true" />
                  Cash on delivery
                </button>
                <p className="text-center text-xs text-gray-500">
                  Delivering to {address.label.toLowerCase()} · {totals.shippingOption.days}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderSummary;
