import { MdOutlinePendingActions } from 'react-icons/md';
import { GoChecklist } from 'react-icons/go';
import { TbTruckDelivery } from 'react-icons/tb';
import DeliveredSvg from '@/svg/DeliveredSvg';
import { PiShippingContainer } from 'react-icons/pi';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { CardHeader } from '@/components/ui/card';

const OrderTimeline = ({ orderId, date }: { orderId: string; date: string }) => {
  const steps = [
    {
      label: 'Pending',
      date: '03 July,2025',
      icon: <MdOutlinePendingActions size={32} />,
      status: 'completed',
    },
    {
      label: 'Confirmed',
      date: '03 July,2025',
      icon: <GoChecklist size={32} />,
      status: 'completed',
    },
    {
      label: 'Shipping',
      date: '03 July,2025',
      icon: <PiShippingContainer size={32} />,
      status: 'current',
    },
    {
      label: 'Out for Delivery',
      date: '03 July,2025',
      icon: <TbTruckDelivery size={32} />,
      status: 'pending',
    },
    {
      label: 'Delivered',
      date: '03 July,2025',
      icon: <DeliveredSvg />,
      status: 'pending',
    },
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3>
            Order :: <span className="text-teal-700">{orderId}</span>
          </h3>
          <div>
            <p className="bg-teal-100 text-teal-700 px-4 flex items-center justify-center font-medium py-1 rounded-sm text-xs ">
              {date}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-10">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const isCompleted = step.status === 'completed';

            return (
              <div key={i} className={`relative flex flex-col justify-center items-center w-full`}>
                {i !== 0 && (
                  <div
                    className={`absolute top-[80%] -translate-y-1/2 right-[65%] w-[70%] h-[2px] 
                      ${isCompleted ? 'bg-teal-700' : 'bg-gray-300'}`}
                  />
                )}

                <p className={`${isCompleted ? 'text-black' : 'text-gray-300'} font-medium mt-3`}>
                  {step.label}
                </p>
                <p
                  className={`font-normal font-inter ${isCompleted ? 'text-teal-700' : 'text-gray-300'}  mt-[2px] leading-none`}
                >
                  {step.date}
                </p>

                <div
                  className={`mt-5 rounded-full ${isCompleted ? 'bg-teal-700 text-white' : 'text-gray-300 ring-2 ring-gray-300'}  inline-flex items-center justify-center  p-2`}
                >
                  {step.icon}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTimeline;
