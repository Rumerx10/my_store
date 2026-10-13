import { Input } from './ui/input';
import { Label } from './ui/label';

const PhoneModal = ({
  onCancel,
  phoneNumber,
  setPhoneNumber,
  selectedProvider,
  handlePhoneSubmit,
  error,
}: {
  onCancel: () => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  selectedProvider: string;
  handlePhoneSubmit: () => void;
  error?: string;
}) => {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handlePhoneSubmit();
      }}
    >
      <h3 className="text-lg font-semibold text-gray-900">Pay with {selectedProvider}</h3>
      <p className="mt-1 text-sm text-gray-600">
        Enter the mobile number registered with your {selectedProvider} account. We&apos;ll send
        you a verification code.
      </p>
      <Label htmlFor="wallet-phone" className="mt-5 block text-sm font-medium text-gray-900">
        Mobile number
      </Label>
      <Input
        id="wallet-phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        autoFocus
        placeholder="01XXXXXXXXX"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'wallet-phone-error' : undefined}
        className="mt-1.5 h-11 tabular-nums"
      />
      {error && (
        <p id="wallet-phone-error" role="alert" className="mt-1.5 text-xs text-red">
          {error}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 flex-1 rounded-lg border border-gray-300 font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="h-11 flex-1 rounded-lg bg-brand font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Send code
        </button>
      </div>
    </form>
  );
};

export default PhoneModal;
