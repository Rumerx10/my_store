import { Badge } from '@/components/ui/badge';
import { HOW_IT_WORKS } from '@/docs/homeDocs';
import HowItWorksCarousel from '../HowItWorksCarousel';
import HowItWorksCard from '../HowItWorksCard';

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1c7293] via-[#1c7293]/80 to-[#1c7293]/60">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-white/20 to-white/30 text-white border-0 mb-4 shadow-lg backdrop-blur-sm">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple Steps to Shop</h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Experience seamless shopping with our user-friendly process designed for your
            convenience
          </p>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, index) => (
            <HowItWorksCard key={index} {...step} />
          ))}
        </div>
        <div className="md:hidden">
          <HowItWorksCarousel />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
