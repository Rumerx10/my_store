'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const OrderSummary = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items) || [];

  const calculation = () => {
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5;
    const total = subTotal + shipping;

    return { subTotal, shipping, total };
  };

  return (
    <div
      className={`container px-4 mx-auto flex items-center justify-center transition-all duration-300 `}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 p-5 h-full">
          {/* Left side - Cart Items */}
          <Card className="bg-white p-5 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
            <div className="flex flex-col gap-2">
              {cartItems.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`}>
                  <div key={item.id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-2">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-18 h-18 border rounded-lg shrink-0">
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <h3 className="font-medium text-md text-gray-800">{item.title}</h3>
                              <p className="text-xs text-gray-500">Brand Name</p>
                            </div>
                          </div>
                          {/* Price and Quantity */}
                          <div className="text-md font-medium flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800">${item.price}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Label htmlFor={`quantity-${item.id}`} className="text-gray-600">
                                Quantity:
                              </Label>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="flex items-center"
                              >
                                <span className="text-gray-800 font-semibold">{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <hr className="my-2" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Right side - Address & Payment */}
          <Card className="bg-white p-5 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Shipping & Payment</h2>

            {/* Address Dropdown */}
            <div className="">
              <Label htmlFor="address" className="block mb-2 text-gray-700 font-medium">
                Select Delivery Address
              </Label>
              <div className="mt-4 space-y-3">
                {[
                  {
                    id: 'home',
                    title: '🏠 Home Address',
                    address: '123 Main Street, Mirpur-12, Pallabi, Dhaka-1216, Bangladesh',
                    phone: '+880 1712 345678',
                  },
                  {
                    id: 'office',
                    title: '🏢 Office Address',
                    address: '456 Business Road, Gulshan-2, Dhaka-1212, Bangladesh',
                    phone: '+880 1812 345678',
                  },
                ].map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => console.log('Selected:', addr.id)}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        id={`addr-${addr.id}`}
                        name="address"
                        value={addr.id}
                        className="mt-1"
                      />
                      <div>
                        <label
                          htmlFor={`addr-${addr.id}`}
                          className="font-medium text-gray-800 cursor-pointer"
                        >
                          {addr.title}
                        </label>
                        <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                        <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-10">
              <h3 className="font-medium text-gray-700 mb-3">Payment Method</h3>
              {/* Order Summary */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculation().subTotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${calculation().shipping}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-700">${calculation().total}</span>
                </div>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-6"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-700 font-semibold py-6"
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Cash on Delivery
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
