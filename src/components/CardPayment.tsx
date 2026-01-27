import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';
import { useState } from 'react';
import PaymentOrOrderSuccess from './PaymentOrOrderSuccess';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

// Define validation schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid card number format (XXXX XXXX XXXX XXXX)'),
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date format (MM/YY)'),
  cvv: z
    .string()
    .min(3, 'CVV must be at least 3 digits')
    .max(4, 'CVV can be maximum 4 digits')
    .regex(/^\d+$/, 'CVV must contain only numbers'),
  cardholderName: z
    .string()
    .min(1, 'Cardholder name is required')
    .min(2, 'Cardholder name must be at least 2 characters'),
  saveCard: z.boolean(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const CardPayment = ({ payable }: { payable: number }) => {
  const router = useRouter();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      saveCard: false,
    },
  });

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const onSubmit = async (data: PaymentFormData) => {
    try {
      // Simulate API call
      console.log('Payment submitted:', data);
      // Show loading toast
      const toastId = toast.loading('Processing payment...');
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Payment Successful!', { id: toastId });
      setShowPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentSuccess(false);
        router.push('/products');
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const formatted = formatCardNumber(e.target.value);
    onChange(formatted);
    // Trigger validation after formatting
    setTimeout(() => trigger('cardNumber'), 0);
  };

  const handleExpiryDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const formatted = formatExpiryDate(e.target.value);
    onChange(formatted);
    setTimeout(() => trigger('expiryDate'), 0);
  };

  const handleCVVChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    onChange(digits);
    setTimeout(() => trigger('cvv'), 0);
  };

  return showPaymentSuccess ? (
    <PaymentOrOrderSuccess />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Card Logos */}
      <div className="flex gap-2 mb-6 pb-4 border-b">
        <div className="w-10 h-6 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
          VISA
        </div>
        <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
          MC
        </div>
        <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
          AMEX
        </div>
        <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
          DC
        </div>
        <div className="text-sm text-gray-600 ml-auto flex items-center">Other Cards</div>
      </div>

      {/* Card Number */}
      <div>
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                type="text"
                placeholder="Enter Card Number"
                onChange={(e) => handleCardNumberChange(e, field.onChange)}
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
              )}
            </div>
          )}
        />
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  type="text"
                  placeholder="MM/YY"
                  onChange={(e) => handleExpiryDateChange(e, field.onChange)}
                  maxLength={5}
                  className={`px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* CVV */}
        <div>
          <Controller
            name="cvv"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  type={showCVV ? 'text' : 'password'}
                  placeholder="CVC/CVV"
                  onChange={(e) => handleCVVChange(e, field.onChange)}
                  maxLength={4}
                  className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCVV(!showCVV)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-gray-600"
                >
                  {showCVV ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <Controller
          name="cardholderName"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                type="text"
                placeholder="Card Holder Name"
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-sm mt-1">{errors.cardholderName.message}</p>
              )}
            </div>
          )}
        />
      </div>

      {/* Save Card Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <Controller
          name="saveCard"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="w-4 h-4 rounded border-gray-300"
            />
          )}
        />
        <label className="text-sm text-gray-600 cursor-pointer flex-1">
          Save card & remember me
        </label>
        <HelpCircle size={16} className="text-orange-500 cursor-help" />
      </div>

      {/* Pay Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* {isSubmitting ? 'Processing...' : '👆 PAY 500.00 BDT'} */}
        {isSubmitting ? 'Processing...' : `👆 PAY ${payable.toFixed(2)} BDT`}
      </Button>
    </form>
  );
};

export default CardPayment;
