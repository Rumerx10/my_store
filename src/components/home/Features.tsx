import { FEATURES } from '@/docs/homeDocs';
import Marquee from 'react-fast-marquee';

const Features = () => {
  return (
    <section className="py-2">
      <Marquee gradient={false} speed={100}>
        <div className="flex items-center space-x-6 sm:space-x-10 md:space-x-16 px-2">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full bg-card/80 border border-border/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-semibold text-xs sm:text-sm text-foreground">
                  {feature.title}
                </span>
                <span className="hidden sm:inline text-xs text-muted-foreground">•</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default Features;
