'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import BackButton from '@/components/shared/BackButton';
import { CreditCard, MapPin, Phone, Printer, Truck, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import CancelOrderModal from '@/components/CancelOrderModal';
import Panel from '@/components/dashboard/Panel';
import OrderProgress from '@/components/orders/OrderProgress';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { MockOrders } from '@/docs/Orders';
import { capitalize, formatOrderDate, formatPrice } from '@/lib/utils';
import type { Order } from '@/types/order';

const PAYMENT_LABELS: Record<Order['paymentType'], string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
};

const actionClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50';

// Seller view of one order: progress, items, buyer details and fulfilment actions.
const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const found = MockOrders.find((o) => o.id === decodeURIComponent(id));
  const [status, setStatus] = useState(found?.status);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!found || !status) notFound();
  const order = found;

  const handleShip = () => {
    setStatus('shipped');
    toast.success(`Order ${order.id} marked as shipped`);
  };

  const handleCancel = () => {
    setStatus('cancelled');
    setShowCancelModal(false);
    toast.success(`Order ${order.id} cancelled`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl tabular-nums text-gray-900 md:text-3xl">Order {order.id}</h1>
            <OrderStatusBadge status={status} className="text-sm" />
          </div>
          <p className="mt-1 text-sm text-gray-600">Placed {formatOrderDate(order.date)}</p>
        </div>
        <BackButton href="/admin/orders" className="print:hidden">
          All orders
        </BackButton>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <a href={`tel:${order.buyerPhone}`} className={actionClass}>
          <Phone className="size-4" aria-hidden="true" />
          Call buyer
        </a>
        <button type="button" onClick={() => window.print()} className={actionClass}>
          <Printer className="size-4" aria-hidden="true" />
          Print invoice
        </button>
      </div>

      <Panel className="mt-6">
        {status === 'cancelled' ? (
          <p className="flex items-center gap-2 text-sm text-red">
            <X className="size-4" aria-hidden="true" />
            This order was cancelled.
          </p>
        ) : (
          <OrderProgress status={status} />
        )}
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Panel title="Items">
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm tabular-nums text-gray-500">
                    {item.quantity} × {formatPrice(item.price)} · SKU {item.sku}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-gray-100 pt-4 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(order.amount)}</span>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <User className="size-4 text-gray-400" aria-hidden="true" />
              Buyer
            </h2>
            <p className="mt-2 text-sm text-gray-700">{order.buyerName}</p>
            <p className="break-words text-sm text-gray-600">{order.buyerEmail}</p>
            <p className="text-sm tabular-nums text-gray-500">{order.buyerPhone}</p>

            <h2 className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MapPin className="size-4 text-gray-400" aria-hidden="true" />
              Delivery address
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.state} {order.shippingAddress.zipCode},{' '}
              {order.shippingAddress.country}
            </p>

            <h2 className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CreditCard className="size-4 text-gray-400" aria-hidden="true" />
              Payment
            </h2>
            <p className="mt-2 text-sm text-gray-700">{PAYMENT_LABELS[order.paymentType]}</p>
            <p className="text-sm text-gray-500">{capitalize(order.paymentStatus)}</p>
          </Panel>

          {status === 'pending' && (
            <div className="flex flex-col gap-2 print:hidden">
              <button
                type="button"
                onClick={handleShip}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98]"
              >
                <Truck className="size-4" aria-hidden="true" />
                Mark as shipped
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="h-11 rounded-lg border border-red/30 bg-white text-sm font-medium text-red transition-colors hover:bg-red/5"
              >
                Cancel order
              </button>
            </div>
          )}
        </div>
      </div>

      <CancelOrderModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onConfirm={handleCancel}
        orderId={order.id}
      />
    </div>
  );
};

export default OrderDetails;
