'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  Star,
} from 'lucide-react';
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
import { SHIPPING_OPTIONS } from '@/docs/checkout';
import PricingDetails from './PricingDetails';

// Sample cart data

const Cart = () => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [giftWrap, setGiftWrap] = useState(false);

  const CART_ITEMS = useSelector((state: RootState) => state.cart.items) || [];
  const dispatch = useDispatch();
  console.log('Cart Items :::', CART_ITEMS);

  const calculations = useMemo(() => {
    const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // const savings = CART_ITEMS.reduce(
    //   (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    //   0,
    // );
    const couponDiscount = 0;
    const shipping = SHIPPING_OPTIONS.find((option) => option.id === selectedShipping)?.price || 0;
    const giftWrapFee = giftWrap ? 4.99 : 0;
    const tax = (subtotal - couponDiscount + shipping + giftWrapFee) * 0.08; // 8% tax
    const total = subtotal - couponDiscount + shipping + giftWrapFee + tax;

    return {
      subtotal,
      // savings,
      couponDiscount,
      shipping,
      giftWrapFee,
      tax,
      total,
      itemCount: CART_ITEMS.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [CART_ITEMS, selectedShipping, giftWrap]);

  if (CART_ITEMS.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link href="/products">
                <Button size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure checkout</p>
              </div>
              <div className="text-center">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container  flex flex-col mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {calculations.itemCount} {calculations.itemCount === 1 ? 'item' : 'items'} in your
              cart
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
            {CART_ITEMS.map((item) => {
              // const discount = Math.round(
              //   ((item.originalPrice - item.price) / item.originalPrice) * 100,
              // );

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
                          {/* {discount > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2">
                            -{discount}%
                          </Badge>
                        )} */}
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
                              {/* <Badge variant="secondary" className="mt-1">
                              {item.category}
                            </Badge> */}
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
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
