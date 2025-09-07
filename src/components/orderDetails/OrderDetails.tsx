'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Printer, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/types/order';
import CancelOrderModal from '@/components/CancelOrderModal';
import BuyerInfo from './BuyerInfo';
import OrderTimeline from './OrderTimeline';
import OrderItemCard from './OrderItemCard';
import { getStatusColor, getStatusIcon } from '@/lib/utils';
import { MockOrders } from '@/docs/Orders';

const OrderDetailsPage = () => {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [order, setOrder] = useState<Order>(MockOrders[0]);

  const handleCallBuyer = () => {
    window.open(`tel:${order.buyerPhone}`);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // const handleShipOrder = () => {
  //   setOrder((prevOrder) => ({
  //     ...prevOrder,
  //     status: 'shipped',
  //   }));
  //   console.log('Order shipped:', order.id);
  // };

  const handleCancelOrder = (reason: string) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      status: 'cancelled',
    }));
    console.log('Cancelling order:', order.id, 'Reason:', reason);
    setShowCancelModal(false);
  };

  return (
    <div className="container w-full min-h-screen bg-gray-50">
      <div className="w-full flex flex-col py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
              {/* <p className="text-muted-foreground">Order #{order.id}</p> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-40 font-medium flex gap-2 items-center border rounded-lg px-4 py-2 bg-white hover:bg-gray-100 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
            <Button
              variant="outline"
              onClick={handleCallBuyer}
              className="w-40 font-medium flex gap-2 items-center border rounded-lg px-4 py-2 bg-white hover:bg-gray-100 cursor-pointer"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Buyer
            </Button>
            <Button
              variant="outline"
              onClick={handlePrintInvoice}
              className="w-40 font-medium flex gap-2 items-center border rounded-lg px-4 py-2 bg-white hover:bg-gray-100 cursor-pointer"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>
        {/* Order Timeline */}
        <OrderTimeline orderId = {order.id} date={new Date(order.date).toLocaleDateString()} />

        <div className="grid gap-4 md:grid-cols-3">
          {/* Order Summary */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Summary</CardTitle>
                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <OrderItemCard key={item.id} item={item} />
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <BuyerInfo order={order} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            className="w-40 bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white"
            variant="outline"
            onClick={() => setShowCancelModal(true)}
            disabled={order.status === 'delivered' || order.status === 'cancelled'}
          >
            Cancel Order
          </Button>
          <Button variant="outline" className="w-40 bg-green-600 hover:bg-green-700 text-white hover:text-white" onClick={() => ''} disabled={order.status !== 'pending'}>
            <Truck className="h-4 w-4 mr-2" />
            Ship Order
          </Button>
        </div>
      </div>

      <CancelOrderModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onConfirm={handleCancelOrder}
        orderId={order.id}
      />
    </div>
  );
};

export default OrderDetailsPage;
