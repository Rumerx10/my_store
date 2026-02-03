'use client';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  increaseQuantityInCart,
  reduceQuantityFromCart,
  removeFromCart,
} from '@/redux/features/cart/cartSlice';
import PricingDetails from './PricingDetails';
import EmptyCart from './EmptyCart';

// Sample cart data

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items) || [];
  const dispatch = useDispatch();

  return cartItems.length === 0 ? (
    <EmptyCart />
  ) : (
    <div className="min-h-screen bg-background">
      <div className="container  flex flex-col mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link href="/products" className="hidden md:block border rounded-lg">
            <Button variant="ghost" size="sm" className="bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Cart Items */}
          <div className="flex flex-col gap-5">
            {cartItems.map((item) => {
              return (
                <Link key={item.id} href={`/products/${item.id}`}>
                  <Card key={item.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-2 md:gap-4">
                        {/* Product Image */}
                        <div className="relative w-25 md:w-32 h-25 md:h-32 shrink-0">
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {/* {item.brand} */}
                                Brand Name
                              </p>
                            </div>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dispatch(removeFromCart(item.id));
                              }}
                              className="text-destructive hover:text-destructive p-2 duration-300 cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Trash2 className="w-5 h-5 shrink-0" />
                            </div>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">${item.price}</span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                              <div className="flex gap-2 items-center md:justify-between">
                                <Label
                                  htmlFor={`quantity-${item.id}`}
                                  className="hidden md:block text-sm"
                                >
                                  Quantiy:
                                </Label>
                                <div
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  className="flex w-full items-center border rounded-md"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      dispatch(reduceQuantityFromCart(item.id));
                                    }}
                                    disabled={item.quantity <= 1}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <Input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    value={item.quantity}
                                    className="w-full border-0 shadow-none h-8 text-center"
                                    min="1"
                                    max="10"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      dispatch(increaseQuantityInCart(item.id));
                                    }}
                                    disabled={item.quantity >= 10}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="price" className="text-md font-medium md:hidden">
                                  Price:
                                </Label>
                                <p className="font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-1">
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                <FaStar className="w-5 h-5 text-yellow-400" />
                                <FaStar className="w-5 h-5 text-yellow-400" />
                                <FaStar className="w-5 h-5 text-yellow-400" />
                                <FaStar className="w-5 h-5 text-yellow-400" />
                                <FaStarHalfAlt className="w-5 h-5 text-yellow-400" />
                              </div>
                              {item.rating}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="hidden md:block">|</span> {item.sold} sold{' '}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <PricingDetails />
        </div>
      </div>
    </div>
  );
};

export default Cart;
