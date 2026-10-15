'use client';
import Hero from './Hero/Hero';
import Features from './Features';
import CategoryGrid from './CategoryGrid';
import Solutions from './Solutions';
import FeaturedBanners from './FeaturedBanners';
import ProductSection from './ProductSection';
import SystemVideos from './SystemVideos';
import HowItWorks from './HowItWorks';
import Trusted from './Trusted';

const Home = () => {
  return (
    <div className="pb-4">
      <Hero />
      <Features />
      <CategoryGrid />
      <Solutions />
      <ProductSection
        title="Popular right now"
        desc="The panels, inverters and batteries our customers choose most."
        href="/products?searchTerm=popular"
        filter={(p) => p.popular}
      />
      <FeaturedBanners />
      <ProductSection
        title="Biggest discounts"
        desc="Marked down from the regular price, while stock lasts."
        href="/deals"
        linkLabel="All deals"
        filter={(p) => p.discountPercentage >= 5 && p.stock > 0}
        sort={(a, b) => b.discountPercentage - a.discountPercentage}
        limit={4}
      />
      <ProductSection
        title="For business"
        desc="Commercial inverters, storage cabinets and controllers for shops, offices and factories."
        href="/products?searchTerm=business"
        filter={(p) => p.category === 'commercial'}
        limit={4}
      />
      <SystemVideos />
      <ProductSection
        title="New arrivals"
        desc="The latest GoodWe models in the store."
        href="/products?searchTerm=latest"
        filter={(p) => p.latest}
        limit={4}
      />
      <HowItWorks />
      <Trusted />
    </div>
  );
};

export default Home;
