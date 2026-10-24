import { Input } from './ui/input';
import { Label } from './ui/label';

const OTPModal = ({
  onCancel,
  otpInput,
  setOtpInput,
  handleOTPSubmit,
  phoneNumber,
  error,
}: {
  onCancel: () => void;
  otpInput: string;
  setOtpInput: (value: string) => void;
  handleOTPSubmit: () => void;
  phoneNumber: string;
  error?: string;
}) => {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleOTPSubmit();
      }}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
        Enter verification code
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
        We sent a 5-digit code to <span className="font-medium tabular-nums">{phoneNumber}</span>.
      </p>
      <Label
        htmlFor="otp"
        className="mt-5 block text-sm font-medium text-gray-900 dark:text-slate-100"
      >
        Verification code
      </Label>
      <Input
        id="otp"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        placeholder="•••••"
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
        maxLength={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'otp-error' : undefined}
        className="mt-1.5 h-12 text-center text-lg font-semibold tracking-[0.5em] tabular-nums"
      />
      {error && (
        <p id="otp-error" role="alert" className="mt-1.5 text-xs text-red">
          {error}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 flex-1 rounded-lg border border-gray-300 dark:border-white/15 font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={otpInput.length < 5}
          className="h-11 flex-1 rounded-lg bg-brand font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify and pay
        </button>
      </div>
    </form>
  );
};

export default OTPModal;
