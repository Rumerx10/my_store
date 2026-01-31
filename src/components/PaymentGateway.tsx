'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import OTPModal from './OTPModal';
import toast from 'react-hot-toast';
import PhoneModal from './PhoneModal';
import CardPayment from './CardPayment';
import MobilePayment from './MobilePayment';
import { useRouter } from 'next/navigation';
import PaymentOrOrderSuccess from './PaymentOrOrderSuccess';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addOrder } from '@/redux/features/order/orderSlice';
import { clearCart } from '@/redux/features/cart/cartSlice';

// Define cart item interface to match your data structure
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function PaymentGateway({
  payable,
  payNow,
  setPayNow,
}: {
  payable: number;
  payNow: boolean;
  setPayNow: (value: boolean) => void;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cards' | 'mobile'>('cards');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  // Cast cart items to proper type
  const cartitems = (useSelector((state: RootState) => state.cart.items) as CartItem[]) || [];
  const dispatch = useDispatch();

  const generateOTP = () => {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    return otp;
  };

  const handleMobileBankingClick = (provider: string) => {
    setSelectedProvider(provider);
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = () => {
    // Validate phone number
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const otp = generateOTP();
    setGeneratedOTP(otp);
    toast.success(`OTP sent to ${phoneNumber}. OTP is ${otp}`);
    setShowPhoneModal(false);
    setShowOTPModal(true);
    // Open OTP modal after short delay
    // setTimeout(() => setShowOTPModal(true), 500);
  };

  const handleOTPSubmit = () => {
    if (otpInput === generatedOTP) {
      setShowOTPModal(false);
      setShowSuccessModal(true);

      // Create order from cart items
      const orderList = cartitems.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      console.log('Order List:', orderList);

      // Generate order ID
      const orderid = String(Date.now()).substring(6);
      const order = {
        id: `ORD-${orderid}`,
        items: orderList,
        totalAmount: payable,
        status: 'pending',
      };

      // Dispatch actions
      dispatch(addOrder(order));
      dispatch(clearCart());

      // Clear OTP states
      setOtpInput('');
      setGeneratedOTP('');
      setPhoneNumber('');

      // Optional: Redirect after success
      setTimeout(() => {
        router.push('/orders');
        setPayNow(false);
      }, 3000);

      toast.success('Payment successful! Order placed.');
    } else {
      toast.error('OTP is incorrect. Please try again.');
      setOtpInput('');
    }
  };

  return (
    <div className="flex items-center justify-center">
      {payNow && (
        <div className="bg-white rounded-lg shadow-2xl w-full">
          {/* Always show close button if not in success modal */}
          {!showSuccessModal && (
            <div className="flex justify-end items-center p-4 bg-gray-50 border-b">
              <button
                onClick={() => setPayNow(false)}
                className="text-gray-800 hover:scale-125 duration-300 hover:text-gray-600 ml-2"
                aria-label="Close payment gateway"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Conditional content */}
          {showSuccessModal ? (
            <PaymentOrOrderSuccess />
          ) : showOTPModal ? (
            <OTPModal
              setShowOTPModal={setShowOTPModal}
              otpInput={otpInput}
              setOtpInput={setOtpInput}
              handleOTPSubmit={handleOTPSubmit}
            />
          ) : showPhoneModal ? (
            <PhoneModal
              setShowPhoneModal={setShowPhoneModal}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              selectedProvider={selectedProvider}
              handlePhoneSubmit={handlePhoneSubmit}
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b bg-gradient-to-r from-blue-600 to-blue-700">
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`flex-1 py-3 px-4 font-semibold text-sm transition ${
                    activeTab === 'cards'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  CARDS
                </button>
                <button
                  onClick={() => setActiveTab('mobile')}
                  className={`flex-1 py-3 px-4 font-semibold text-sm transition ${
                    activeTab === 'mobile'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  MOBILE BANKING
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'cards' && <CardPayment payable={payable} />}
                {activeTab === 'mobile' && (
                  <MobilePayment handleMobileBankingClick={handleMobileBankingClick} />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
