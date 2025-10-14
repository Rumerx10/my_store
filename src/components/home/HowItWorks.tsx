import { Badge } from '@/components/ui/badge';
import { HOW_IT_WORKS } from '@/docs/homeDocs';
import HowItWorksCarousel from '../HowItWorksCarousel';
import HowItWorksCard from '../HowItWorksCard';

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1c7293] via-[#1c7293]/80 to-[#1c7293]/60">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <Badge className="bg-gradient-to-r from-white/20 to-white/30 text-white border-0 mb-3 md:mb-4 shadow-lg backdrop-blur-sm text-sm md:text-base">
            How It Works
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Simple Steps to Shop
          </h2>
          <p className="sm:text-lg md:text-xl text-white max-w-4xl mx-auto leading-relaxed">
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
