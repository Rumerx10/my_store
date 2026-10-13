import Image from 'next/image';

export const MOBILE_PROVIDERS = [
  { id: 'bkash', name: 'bKash', logo: '/bkash.png' },
  { id: 'nagad', name: 'Nagad', logo: '/nagad.png' },
  { id: 'rocket', name: 'Rocket', logo: '/rocket.png' },
] as const;

export type MobileProviderId = (typeof MOBILE_PROVIDERS)[number]['id'];

const MobilePayment = ({
  handleMobileBankingClick,
}: {
  handleMobileBankingClick: (provider: MobileProviderId) => void;
}) => {
  return (
    <div>
      <p className="text-sm text-gray-600">Choose your mobile banking provider.</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {MOBILE_PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleMobileBankingClick(provider.id)}
            className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 transition-colors hover:border-brand hover:bg-brand-soft/60"
          >
            <Image
              src={provider.logo}
              alt=""
              width={72}
              height={48}
              className="h-10 w-auto object-contain"
            />
            <span className="text-sm font-medium text-gray-900">{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobilePayment;
