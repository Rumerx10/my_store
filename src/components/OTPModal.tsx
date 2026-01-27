import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const OTPModal = ({
  setShowOTPModal,
  otpInput,
  setOtpInput,
  handleOTPSubmit,
}: {
  setShowOTPModal: (value: boolean) => void;
  otpInput: string;
  setOtpInput: (value: string) => void;
  handleOTPSubmit: () => void;
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold mb-2 text-gray-800">Enter OTP</h3>
        <p className="text-sm text-gray-600 mb-4">An OTP has been sent to your phone</p>
        <Input
          type="text"
          placeholder="Enter 5-digit OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
          maxLength={5}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-center text-2xl tracking-widest font-semibold"
        />
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setShowOTPModal(false);
              setOtpInput('');
            }}
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-2 rounded"
          >
            Cancel
          </Button>
          <Button
            onClick={handleOTPSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
