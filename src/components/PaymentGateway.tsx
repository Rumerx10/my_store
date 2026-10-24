'use client';
import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentMethodId } from '@/redux/features/order/orderSlice';
import { formatPrice } from '@/lib/utils';
import OTPModal from './OTPModal';
import PhoneModal from './PhoneModal';
import CardPayment from './CardPayment';
import MobilePayment, { MOBILE_PROVIDERS, MobileProviderId } from './MobilePayment';

type MobileStep = 'provider' | 'phone' | 'otp';

const BD_MOBILE = /^01[3-9]\d{8}$/;

export default function PaymentGateway({
  payable,
  onPaid,
  onBack,
}: {
  payable: number;
  onPaid: (method: PaymentMethodId) => void;
  onBack: () => void;
}) {
  const [mobileStep, setMobileStep] = useState<MobileStep>('provider');
  const [provider, setProvider] = useState<MobileProviderId>('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const providerName = MOBILE_PROVIDERS.find((p) => p.id === provider)?.name ?? '';

  const handlePhoneSubmit = () => {
    if (!BD_MOBILE.test(phoneNumber)) {
      setPhoneError('Enter an 11-digit mobile number that starts with 01, like 01712345678.');
      return;
    }
    // Demo only: the code is shown on screen instead of being sent by SMS.
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedOTP(otp);
    setPhoneError('');
    toast(`Demo verification code: ${otp}`, { duration: 8000 });
    setMobileStep('otp');
  };

  const handleOTPSubmit = () => {
    if (otpInput !== generatedOTP) {
      setOtpError("That code doesn't match. Check the code and try again.");
      setOtpInput('');
      return;
    }
    toast.success(`Paid with ${providerName}`);
    onPaid(provider);
  };

  return (
    <div className="rounded-xl glass">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 px-5 py-4 md:px-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded text-sm font-medium text-gray-600 dark:text-slate-400 transition-colors hover:text-gray-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to order
        </button>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Amount due{' '}
          <span className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
            {formatPrice(payable)}
          </span>
        </p>
      </div>

      <div className="p-5 md:p-6">
        <h2 className="text-lg text-gray-900 dark:text-slate-100">Pay now</h2>
        <Tabs defaultValue="card" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="size-4" aria-hidden="true" />
              Card
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone className="size-4" aria-hidden="true" />
              Mobile banking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="mt-6">
            <CardPayment payable={payable} onPaid={() => onPaid('card')} />
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            {mobileStep === 'provider' && (
              <MobilePayment
                handleMobileBankingClick={(id) => {
                  setProvider(id);
                  setMobileStep('phone');
                }}
              />
            )}
            {mobileStep === 'phone' && (
              <PhoneModal
                selectedProvider={providerName}
                phoneNumber={phoneNumber}
                setPhoneNumber={(value) => {
                  setPhoneNumber(value);
                  setPhoneError('');
                }}
                handlePhoneSubmit={handlePhoneSubmit}
                onCancel={() => setMobileStep('provider')}
                error={phoneError}
              />
            )}
            {mobileStep === 'otp' && (
              <OTPModal
                phoneNumber={phoneNumber}
                otpInput={otpInput}
                setOtpInput={(value) => {
                  setOtpInput(value);
                  setOtpError('');
                }}
                handleOTPSubmit={handleOTPSubmit}
                onCancel={() => {
                  setOtpInput('');
                  setOtpError('');
                  setMobileStep('phone');
                }}
                error={otpError}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
