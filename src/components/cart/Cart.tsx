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
          <Link href="/products" className="border rounded-lg">
            <Button variant="ghost" size="sm" className="bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden md:block">Continue Shopping</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Cart Items */}
          <div className="flex flex-col gap-5">
            {cartItems.map((item) => {
              return (
                <Link href={`/products/${item.id}`}>
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-32 h-32 shrink-0">
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
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">${item.price}</span>
                              {/* {item.originalPrice > item.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )} */}
                            </div>

                            <div className="flex items-center gap-3">
                              <Label htmlFor={`quantity-${item.id}`} className="text-sm">
                                Quantiy:
                              </Label>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="flex items-center border rounded-md"
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
                                  // onChange={(e) =>
                                  //   updateQuantity(item.id, Number.parseInt(e.target.value) || 1)
                                  // }
                                  className="w-16 h-8 text-center border-0 focus-visible:ring-0"
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
                              <div className="text-right min-w-[80px]">
                                <p className="font-semibold">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                {/* {item.originalPrice > item.price && (
                                <p className="text-xs text-muted-foreground line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </p>
                              )} */}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <div className="flex items-center">
                              <FaStar className="w-5 h-5 text-yellow-400" />
                              <FaStar className="w-5 h-5 text-yellow-400" />
                              <FaStar className="w-5 h-5 text-yellow-400" />
                              <FaStar className="w-5 h-5 text-yellow-400" />
                              <FaStarHalfAlt className="w-5 h-5 text-yellow-400" />
                              {item.rating}
                            </div>
                            <div>| {item.sold} sold </div>
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
