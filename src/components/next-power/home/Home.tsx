'use client';
import type { ApiHomePage, ApiHomeSection } from '@/lib/api/types';
import { useHomePage } from '@/lib/query/shop';
import { ErrorState } from '@/components/common/QueryState';
import Hero from './Hero/Hero';
import Features from './Features';
import CategoryGrid from './CategoryGrid';
import Solutions from './Solutions';
import FeaturedBanners from './FeaturedBanners';
import ProductSection from './ProductSection';
import SystemVideos from './SystemVideos';
import HowItWorks from './HowItWorks';
import Trusted from './Trusted';
import Billboard from './Billboard';
import ComboOffer from './ComboOffer';
import Reveal from './Reveal';

// One section, by its type. The seller centre's editor shows its previews with it too.
export const HomeSection = ({ section }: { section: ApiHomeSection }) => {
  switch (section.type) {
    case 'features':
      return <Features items={section.items} />;
    case 'categories':
      return <CategoryGrid title={section.title} />;
    case 'promoCards':
      return <Solutions section={section} />;
    case 'products':
      return <ProductSection section={section} />;
    case 'banners':
      return <FeaturedBanners section={section} />;
    case 'billboard':
      return <Billboard section={section} />;
    case 'combo':
      return <ComboOffer section={section} />;
    case 'videos':
      return <SystemVideos section={section} />;
    case 'steps':
      return <HowItWorks section={section} />;
    case 'help':
      return <Trusted section={section} />;
    default:
      // A section type this shop doesn't know yet.
      return null;
  }
};

// The home page as the seller centre (Home page) sets it: the hero, then the visible sections
// in their order. `initialPage` comes from the server render.
const Home = ({ initialPage }: { initialPage: ApiHomePage | null }) => {
  const { data: page, error, refetch } = useHomePage(initialPage ?? undefined);

  if (!page) {
    return error ? (
      <div className="container py-10">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    ) : (
      <div aria-hidden="true" className="-mt-(--header-h) h-[100dvh] animate-pulse bg-slate-900" />
    );
  }

  return (
    <div className="pb-4">
      <Hero hero={page.hero} />
      {page.sections
        .filter((section) => section.visible)
        .map((section) => (
          <Reveal key={section.id}>
            <HomeSection section={section} />
          </Reveal>
        ))}
    </div>
  );
};

export default Home;
