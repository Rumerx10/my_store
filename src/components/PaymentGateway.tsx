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

export default function PaymentGateway({
  payable,
  setPayNow,
}: {
  payable: number;
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


  const generateOTP = () => {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    return otp;
  };

  const handleMobileBankingClick = (provider: string) => {
    setSelectedProvider(provider);
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.trim().length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    const otp = generateOTP();
    setGeneratedOTP(otp);
    toast.success(`Your OTP is : ${otp}`);

    // Open OTP modal
    setTimeout(() => setShowOTPModal(true), 500);
  };

  const handleOTPSubmit = () => {
    if (otpInput === generatedOTP) {
      setShowOTPModal(false);
      setShowSuccessModal(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/products');
      }, 3000);
    } else {
      toast.error('OTP is incorrect. Please try again.');
      setOtpInput('');
    }
  };

  return (
    <div className="flex bg-white items-center justify-center h-full p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        {/* Top Actions */}
        <div
          onClick={() => setPayNow(false)}
          className="flex justify-end items-center p-4 bg-gray-50 border-b"
        >
          <button className="text-gray-800 hover:scale-125 duration-300 hover:text-gray-600 ml-2">
            <X size={20} />
          </button>
        </div>

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
          {activeTab === 'cards' && (
            <CardPayment payable={payable} />
          )}
          {activeTab === 'mobile' && (
            <MobilePayment handleMobileBankingClick={handleMobileBankingClick} />
          )}
        </div>
      </div>
      {showPhoneModal && (
        <PhoneModal
          setShowPhoneModal={setShowPhoneModal}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          selectedProvider={selectedProvider}
          handlePhoneSubmit={handlePhoneSubmit}
        />
      )}

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal
          setShowOTPModal={setShowOTPModal}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          handleOTPSubmit={handleOTPSubmit}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && <PaymentOrOrderSuccess />}
    </div>
  );
}
