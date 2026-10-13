import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, formatPrice } from '@/lib/utils';

const paymentSchema = yup.object({
  cardNumber: yup
    .string()
    .required('Enter your card number')
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Card numbers have 16 digits'),
  expiryDate: yup
    .string()
    .required('Enter the expiry date')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use the MM/YY format, for example 08/28'),
  cvv: yup
    .string()
    .required('Enter the security code')
    .matches(/^\d{3,4}$/, 'The security code has 3 or 4 digits'),
  cardholderName: yup
    .string()
    .trim()
    .required('Enter the name on the card')
    .min(2, 'Enter the full name on the card'),
  saveCard: yup.boolean().required(),
});

type PaymentFormData = yup.InferType<typeof paymentSchema>;

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(' ') ?? '';
};

const formatExpiryDate = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="mt-1.5 text-xs text-red">
      {message}
    </p>
  ) : null;

const CardPayment = ({ payable, onPaid }: { payable: number; onPaid: () => void }) => {
  const [showCVV, setShowCVV] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
    mode: 'onTouched',
    defaultValues: { cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', saveCard: false },
  });

  const onSubmit = async () => {
    // Simulated payment request; no card data leaves the browser in this demo.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success('Payment received');
    onPaid();
  };

  const inputClass = (hasError: boolean) =>
    cn('h-11', hasError && 'border-red focus-visible:ring-red/20');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-900">
          Card number
        </Label>
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
              aria-invalid={Boolean(errors.cardNumber)}
              aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
              className={cn('mt-1.5 tabular-nums', inputClass(Boolean(errors.cardNumber)))}
            />
          )}
        />
        <FieldError id="cardNumber-error" message={errors.cardNumber?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-900">
            Expiry date
          </Label>
          <Controller
            name="expiryDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="expiryDate"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                aria-invalid={Boolean(errors.expiryDate)}
                aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                className={cn('mt-1.5 tabular-nums', inputClass(Boolean(errors.expiryDate)))}
              />
            )}
          />
          <FieldError id="expiryDate-error" message={errors.expiryDate?.message} />
        </div>

        <div>
          <Label htmlFor="cvv" className="text-sm font-medium text-gray-900">
            Security code
          </Label>
          <div className="relative mt-1.5">
            <Controller
              name="cvv"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="cvv"
                  type={showCVV ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVV"
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  aria-invalid={Boolean(errors.cvv)}
                  aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                  className={cn('pr-11 tabular-nums', inputClass(Boolean(errors.cvv)))}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowCVV(!showCVV)}
              aria-label={showCVV ? 'Hide security code' : 'Show security code'}
              className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            >
              {showCVV ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError id="cvv-error" message={errors.cvv?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="cardholderName" className="text-sm font-medium text-gray-900">
          Name on card
        </Label>
        <Controller
          name="cardholderName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cardholderName"
              autoComplete="cc-name"
              placeholder="As printed on the card"
              aria-invalid={Boolean(errors.cardholderName)}
              aria-describedby={errors.cardholderName ? 'cardholderName-error' : undefined}
              className={cn('mt-1.5', inputClass(Boolean(errors.cardholderName)))}
            />
          )}
        />
        <FieldError id="cardholderName-error" message={errors.cardholderName?.message} />
      </div>

      <div className="flex items-center gap-3">
        <Controller
          name="saveCard"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="saveCard"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              className="data-[state=checked]:border-brand data-[state=checked]:bg-brand"
            />
          )}
        />
        <Label htmlFor="saveCard" className="cursor-pointer text-sm font-normal text-gray-700">
          Save this card for next time
        </Label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
      >
        <Lock className="size-4" aria-hidden="true" />
        {isSubmitting ? 'Processing payment…' : `Pay ${formatPrice(payable)}`}
      </button>
    </form>
  );
};

export default CardPayment;
