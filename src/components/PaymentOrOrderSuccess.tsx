import { Check } from 'lucide-react';

const PaymentOrOrderSuccess = ({
  title = 'Payment Successful!',
  subTitle = 'Your payment has been processed successfully',
}: {
  title?: string;
  subTitle?: string;
}) => {
  return (
    // <div className="backdrop-blur-2xl bg-red-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <Check size={32} className="text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">{title}</h3>
        <p className="text-gray-600 mb-2">{subTitle}</p>
        <p className="text-sm text-gray-500">Redirecting to products page...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    // </div>
  );
};

export default PaymentOrOrderSuccess;
