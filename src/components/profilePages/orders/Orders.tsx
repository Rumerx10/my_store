'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Package, Truck, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const orders: Order[] = [
    {
      id: '#ORD-2024-001',
      date: '2024-01-28',
      status: 'delivered',
      items: [{ id: '1', name: 'Premium Wireless Headphones', quantity: 1, price: 199.99 }],
      total: 199.99,
      trackingNumber: 'TRK-2024-0001234',
    },
    {
      id: '#ORD-2024-002',
      date: '2024-01-27',
      status: 'shipped',
      items: [
        { id: '2', name: '4K Monitor Stand', quantity: 1, price: 89.99 },
        { id: '3', name: 'USB-C Cable (2m)', quantity: 2, price: 15.99 },
      ],
      total: 121.97,
      estimatedDelivery: '2024-02-02',
      trackingNumber: 'TRK-2024-0001235',
    },
    {
      id: '#ORD-2024-003',
      date: '2024-01-26',
      status: 'processing',
      items: [{ id: '4', name: 'Mechanical Keyboard Bundle', quantity: 1, price: 159.99 }],
      total: 159.99,
      estimatedDelivery: '2024-01-31',
    },
    {
      id: '#ORD-2024-004',
      date: '2024-01-25',
      status: 'pending',
      items: [
        { id: '5', name: 'Wireless Mouse Pro', quantity: 1, price: 79.99 },
        { id: '6', name: 'Mouse Pad XL', quantity: 1, price: 24.99 },
      ],
      total: 104.98,
      estimatedDelivery: '2024-02-03',
    },
    {
      id: '#ORD-2024-005',
      date: '2024-01-20',
      status: 'delivered',
      items: [{ id: '7', name: 'LED Desk Lamp Pro', quantity: 1, price: 89.99 }],
      total: 89.99,
      trackingNumber: 'TRK-2024-0001233',
    },
    {
      id: '#ORD-2024-006',
      date: '2024-01-15',
      status: 'cancelled',
      items: [{ id: '8', name: 'Studio Microphone Set', quantity: 1, price: 159.99 }],
      total: 159.99,
    },
  ];

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      processing: <Package className="h-5 w-5 text-blue-600" />,
      shipped: <Truck className="h-5 w-5 text-blue-600" />,
      delivered: <CheckCircle className="h-5 w-5 text-green-600" />,
      cancelled: <AlertCircle className="h-5 w-5 text-red-600" />,
    };
    return icons[status as keyof typeof icons];
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-50 text-blue-800 border-blue-200',
      shipped: 'bg-blue-50 text-blue-800 border-blue-200',
      delivered: 'bg-green-50 text-green-800 border-green-200',
      cancelled: 'bg-red-50 text-red-800 border-red-200',
    };
    return badges[status as keyof typeof badges];
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
  };

  const statusTabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="mt-2 text-muted-foreground">Track and manage all your orders</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full overflow-hidden">
          <div>
            <TabsList className="border-border bg-muted/50 overflow-x-auto flex flex-nowrap scrollbar-modern">
              {statusTabs.map((status) => (
                <TabsTrigger key={status} value={status} className="capitalize">
                  {status === 'all' ? 'All Orders' : status}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {statusTabs.map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterOrdersByStatus(status).length > 0 ? (
                filterOrdersByStatus(status).map((order) => (
                  <Card
                    key={order.id}
                    className="border-border transition-all hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  >
                    {/* Order Header */}
                    <div className="border-b border-border px-6 py-4 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between sm:mt-0">
                        <Badge className={`${getStatusBadge(order.status)} border`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <ChevronRight className="ml-4 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {selectedOrder === order.id && (
                      <div className="space-y-4 px-6 py-4">
                        {/* Items */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between border-b border-border/50 pb-2"
                              >
                                <div>
                                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium text-foreground">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Subtotal</span>
                            <span className="text-sm font-medium text-foreground">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Shipping</span>
                            <span className="text-sm font-medium text-foreground">Free</span>
                          </div>
                          <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                            <span className="font-medium text-foreground">Total</span>
                            <span className="font-bold text-lg text-foreground">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Tracking Info */}
                        {order.trackingNumber && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">
                              Tracking Number
                            </p>
                            <p className="font-mono text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}

                        {order.estimatedDelivery && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">
                              Estimated Delivery
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.estimatedDelivery}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 flex-1 bg-transparent"
                          >
                            <Eye size={16} />
                            View Details
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Return Item
                            </Button>
                          )}
                          {order.status === 'cancelled' && (
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Compact View */}
                    {selectedOrder !== order.id && (
                      <div className="hidden px-6 py-4 sm:flex sm:items-center sm:justify-end gap-4">
                        <span className="font-bold text-lg text-foreground">
                          ${order.total.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="border-border p-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium text-foreground">No orders found</p>
                  <p className="text-muted-foreground">
                    You don&apos;t have any {status} orders yet
                  </p>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Orders;
