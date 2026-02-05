import React from 'react';
import Hero from './Hero/Hero';

import Features from './Features';
import BrowsProducts from './BrowsProducts';
import HowItWorks from './HowItWorks';
import PopulerProducts from './PopulerProducts';
import LatestProducts from './LatestProducts';
import Trusted from './Trusted';
import TrendingProducts from './TrendingProducts';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      <BrowsProducts />
      <HowItWorks />
      <PopulerProducts />
      <LatestProducts />
      <TrendingProducts />
      <Trusted />
    </div>
  );
};

export default Home;
