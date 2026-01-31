import Image from 'next/image';

const MobilePayment = ({
  handleMobileBankingClick,
}: {
  handleMobileBankingClick: (provider: string) => void;
}) => {
  return (
    <div className="w-full text-center text-gray-600">
      <div className="text-4xl mb-4">📱</div>
      <p className="font-semibold mb-2">Mobile Banking</p>
      <p className="text-sm">Select your mobile banking provider to continue</p>
      <div className="flex gap-4 mt-6">
        <div
          onClick={() => handleMobileBankingClick('Nagad')}
          className="w-full flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="text-2xl mb-2">
            <Image src="/nagad.png" alt="Nagad" width={80} height={80} />
          </div>
        </div>
        <div
          onClick={() => handleMobileBankingClick('Bkash')}
          className="w-full flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="text-2xl mb-2">
            <Image src="/bkash.png" alt="Nagad" width={80} height={80} />
          </div>
        </div>
        <div
          onClick={() => handleMobileBankingClick('Rocket')}
          className="w-full flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="text-2xl mb-2">
            {' '}
            <Image src="/rocket.png" alt="Nagad" width={80} height={80} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePayment;
