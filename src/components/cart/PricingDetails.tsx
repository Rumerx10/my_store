'use client';
import { Tag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SHIPPING_OPTIONS } from '@/docs/checkout';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Coupon = [{ code: 'SAVE10', discount: 10 }]; // CHANGED: Made uppercase for consistency

const PricingDetails = () => {
  const tax = 5;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [couponCode, setCouponCode] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');

  const calculations = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = (subTotal * tax) / 100;
    const appliedCoupon = Coupon.find((c) => c.code === couponCode);
    const couponDiscount = appliedCoupon ? (subTotal * appliedCoupon.discount) / 100 : 0;
    const shippingOption = SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping);
    const shippingCost = shippingOption?.price || 0;
    const giftWrapFee = giftWrap ? 4.99 : 0;
    const total = subTotal + taxAmount + shippingCost + giftWrapFee;

    return {
      totalItems,
      subTotal,
      taxAmount,
      couponDiscount,
      shippingCost,
      giftWrapFee,
      total,
      appliedCoupon,
    };
  }, [cartItems, couponCode, selectedShipping, giftWrap, tax]); // ADDED: Added all dependencies

  const applyCoupon = () => {
    const isExist = Coupon.find((coupon) => coupon.code === couponCode); // CHANGED: Removed .toUpperCase()
    if (!isExist) {
      alert('Invalid Coupon!!');
      setCouponCode('');
      setCouponApplied(false);
    } else {
      calculations.total -= calculations.couponDiscount;
      setCouponApplied(true);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Coupon Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-6 h-6" color="green" />
            Promo Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <Button
              size="lg"
              variant="outline"
              onClick={applyCoupon}
              disabled={!couponCode || couponApplied}
            >
              {couponApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Try: SAVE10</p>{' '}
        </CardContent>
      </Card>
      {/* Pricing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_1fr] gap-5">
              <label className="line-clamp-2">{item.title}</label>
              <div className="flex justify-between">
                {item.quantity} X {item.price.toFixed(2)} <span>=</span>{' '}
                <span className="text-end">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({calculations.totalItems} items)</span>
              <span>${calculations.totalItems}</span>{' '}
            </div>
            {couponApplied && calculations.couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({couponCode})</span>
                <span>-${calculations.couponDiscount.toFixed(2)}</span>{' '}
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${calculations.shippingCost.toFixed(2)}</span>{' '}
            </div>

            {giftWrap && (
              <div className="flex justify-between">
                <span>Gift wrap</span>
                <span>${calculations.giftWrapFee.toFixed(2)}</span>{' '}
              </div>
            )}

            <div className="flex justify-between">
              <span>Tax {tax}%</span>
              <span>${calculations.taxAmount.toFixed(2)}</span>{' '}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${calculations.total.toFixed(2)}</span>
          </div>
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedShipping} onValueChange={setSelectedShipping}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHIPPING_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex justify-between gap-16 items-center w-full">
                    <div>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-muted-foreground">{option.days}</p>
                    </div>
                    <span className="font-medium">${option.price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Gift Wrap */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gift-wrap"
              checked={giftWrap}
              onCheckedChange={(checked) => setGiftWrap(checked as boolean)}
            />
            <Label htmlFor="gift-wrap" className="flex-1">
              <div className="flex justify-between">
                <span>Gift wrap</span>
                <span className="font-medium">$4.99</span>
              </div>
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingDetails;
