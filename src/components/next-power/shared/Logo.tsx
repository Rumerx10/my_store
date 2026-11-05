import Image from 'next/image';
import Link from 'next/link';
import { Chakra_Petch, Exo_2 } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SITE } from '@/docs/site';

const exo = Exo_2({ subsets: ['latin'], weight: ['800'], style: ['italic'], display: 'swap' });
const chakra = Chakra_Petch({ subsets: ['latin'], weight: ['600'], display: 'swap' });

// The shield (public/logos; also the favicon, app/next-power/icon.png) with the name in Exo 2
// italic and the tagline in spaced Chakra Petch capitals, in the logo's navy and sun orange.
// Set the height with className (h-10 by default); the width follows.
const Logo = ({ className }: { className?: string }) => (
  <Link
    href="/next-power"
    aria-label={`${SITE.name} home`}
    className={cn('inline-flex h-10 shrink-0 items-center gap-2 rounded-lg', className)}
  >
    <Image
      src="/logos/nextpower-icon.png"
      alt=""
      width={40}
      height={40}
      priority
      className="h-full w-auto shrink-0"
    />
    <span className="flex flex-col leading-none">
      <span
        className={cn(
          exo.className,
          'text-[1.4rem] font-extrabold italic text-[#041439] dark:text-slate-100',
        )}
      >
        NEXTPOWER
      </span>
      <span
        className={cn(
          chakra.className,
          'mt-1 text-[0.5rem] font-semibold tracking-[0.16em] text-[#a65c09] dark:text-[#f5bf30]',
        )}
      >
        THE FUTURE OF ENERGY
      </span>
    </span>
  </Link>
);

export default Logo;
