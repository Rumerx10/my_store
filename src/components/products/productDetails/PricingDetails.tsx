import React from 'react';

const PricingDetails = ({ price, quantity }: { price: number; quantity: number }) => {
  return (
    <div className="border py-6 px-6 lg:px-6 w-full rounded-lg">
      <h1 className="text-center font-semibold  underline mb-8">Pricing Details</h1>
      <div className="flex flex-col">
        <div className="flex gap-5 items-center justify-between text-xs lg:text-sm text-black-dim">
          <div className="w-1/2">
            <p className="font-semibold whitespace-nowrap">Product Quantity</p>
          </div>
          <div>
            <p>{quantity}</p>
          </div>
        </div>
        <span className="w-full h-[1px] block bg-gray-200 mt-4 mb-4 "></span>
        <div className="flex gap-5  items-center justify-between text-xs lg:text-sm text-black-dim">
          <div className="w-1/2">
            <p className="font-semibold whitespace-nowrap">Unit Price</p>
          </div>
          <div className="">
            <p>৳{price}</p>
          </div>
        </div>
        <span className="w-full h-[1px] block bg-gray-200 mt-4 mb-4 "></span>
        <div className="flex gap-5 items-center justify-between text-xs lg:text-sm text-black-dim">
          <div className="w-1/2">
            <p className="font-semibold whitespace-nowrap">Total</p>
          </div>
          <div className="text-end">
            <p>৳ {(price * quantity).toFixed(2)} + Shipping Charge</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingDetails;
