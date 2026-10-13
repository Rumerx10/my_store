import Hero from './Hero/Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import PopulerProducts from './PopulerProducts';
import LatestProducts from './LatestProducts';
import Trusted from './Trusted';
import TrendingProducts from './TrendingProducts';
import DealsPreview from './DealsPreview';

const Home = () => {
  return (
    <div className="pb-4">
      <Hero />
      <Features />
      <PopulerProducts />
      <DealsPreview />
      <LatestProducts />
      <TrendingProducts />
      <HowItWorks />
      <Trusted />
    </div>
  );
};

export default Home;
