'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PaymentGateway from '@/components/PaymentGateway';
import { useState } from 'react';
import PaymentOrOrderSuccess from '@/components/PaymentOrOrderSuccess';
import { useRouter } from 'next/navigation';

const OrderSummary = () => {
  const router = useRouter();
  const [payNow, setPayNow] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items) || [];
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const calculation = () => {
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5;
    const total = subTotal + shipping;
    return { subTotal, shipping, total };
  };
  const handleCashOnDelivery = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      router.push('/orders');
      setShowSuccessModal(false);
    }, 3000);
  };

  return (
    <div
      className={`container px-4 mx-auto flex items-center justify-center transition-all duration-300 `}
    >
      <div className="w-full flex items-center justify-center min-h-screen">
        {payNow ? (
          <div className={`backdrop-blur-sm bg-transparent duration-300`}>
            <PaymentGateway
              showSuccessModal={showSuccessModal}
              setShowSuccessModal={setShowSuccessModal}
              payNow={payNow}
              payable={calculation().total}
              setPayNow={setPayNow}
            />
          </div>
        ) : showSuccessModal ? (
          <PaymentOrOrderSuccess
            title="Order Placed Successfullt!"
            subTitle="You will be called for confirmation. Payment will be collected after delivery."
          />
        ) : (
          <div className="py-5 w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 md:p-4 h-auto">
            {/* Left side - Cart Items */}
            <Card className="relative bg-white p-5">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
              <div className="flex flex-col gap-2">
                {cartItems.map((item) => (
                  <Link key={item.id} href={`/products/${item.id}`}>
                    <div
                      key={item.id}
                      className="bg-gray-50 hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      <CardContent className="p-2">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-18 h-18 border rounded-lg shrink-0">
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
                            <div className="text-md font-medium flex justify-between sm:items-end gap-4">
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
                                  <span className="text-gray-800 font-semibold">
                                    {item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      {/* {cartItems.length > 1 && <hr className="my-2" />} */}
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
                  <div className="w-full" onClick={() => setPayNow(true)}>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-6"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay Now
                    </Button>
                  </div>

                  <div onClick={handleCashOnDelivery}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-700 font-semibold py-6"
                    >
                      <Truck className="mr-2 h-5 w-5" />
                      Cash on Delivery
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
