import React from 'react';
import { ArrowRight, ShoppingBag, Sparkles, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

const BrowsProducts = () => {
  const stats = [
    { icon: <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />, label: '500+', value: 'Products' },
    { icon: <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />, label: 'Premium', value: 'Quality' },
    { icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />, label: 'Hot', value: 'Trending' },
    { icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />, label: '24h', value: 'Dispatch' },
  ];

  return (
    <div className="relative w-full min-h-[300px] md:min-h-[400px] lg:min-h-[450px] overflow-hidden bg-[#ffb653]">
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffb653] via-[#ffa53d] to-[#ff9024]"></div>
      
      {/* Glass morphism overlay with blur */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/5"></div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.3)_0px,transparent_50px)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2)_0px,transparent_50px)]"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 md:p-8 lg:p-12">
        {/* Left Content */}
        <div className="flex-1 w-full lg:w-auto mb-6 lg:mb-0 lg:pr-8">
          {/* Badge with glass effect */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md bg-white/20 border border-white/30 mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-white/95">Explore Collection</span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">
            Discover Amazing
            <span className="block bg-gradient-to-r from-white via-orange-100 to-orange-50 bg-clip-text text-transparent drop-shadow-lg mt-1 sm:mt-2">
              Products Await You
            </span>
          </h2>
          
          {/* Description */}
          <p className="text-white/90 mb-4 sm:mb-6 max-w-md text-xs sm:text-sm md:text-base drop-shadow-sm">
            From cutting-edge tech to essential gadgets, explore our carefully curated 
            collection of premium products that blend innovation with style.
          </p>
          
          {/* Stats Grid - Glass cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group p-2 sm:p-3 rounded-xl backdrop-blur-md bg-white/15 border border-white/20 hover:bg-white/25 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="text-white/90">
                      {stat.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm">{stat.label}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/80 drop-shadow-sm">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Content - CTA Button */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end space-y-3 sm:space-y-4">
          {/* Floating Glass Card */}
          <div className="relative group w-full sm:w-auto">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/40 via-orange-200 to-orange-300 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>
            
            {/* Glass card */}
            <div className="absolute inset-0 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/30 group-hover:border-white/50 transition-all duration-300"></div>
            
            <Link 
              href="/products"
              className="relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 group-hover:scale-[1.02] sm:group-hover:scale-105"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  {/* Icon glow */}
                  <div className="absolute -inset-1 bg-white/40 rounded-full blur-md opacity-60 group-hover:opacity-80 transition duration-300"></div>
                  <ShoppingBag className="relative w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-base sm:text-lg font-bold text-white drop-shadow-lg">Browse All Products</div>
                  <div className="text-[10px] sm:text-xs text-white/90 flex items-center justify-center sm:justify-start gap-1 drop-shadow-sm">
                    Discover our complete collection
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-white/90 drop-shadow-sm">
            <div className="flex items-center -space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/40 backdrop-blur-sm bg-gradient-to-br from-white/30 to-white/10 shadow-sm"
                />
              ))}
            </div>
            <span>Join 10k+ satisfied customers</span>
          </div>
        </div>
      </div>
      
      {/* Floating Glass Orbs */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full backdrop-blur-2xl bg-white/10 border border-white/20"></div>
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full backdrop-blur-2xl bg-white/10 border border-white/20"></div>
      
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowsProducts;