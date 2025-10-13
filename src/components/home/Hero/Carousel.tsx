'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// import required modules
import { EffectCreative, Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';

const Carousel = ({
  images,
  height,
  delay,
  slideDirection,
}: {
  images: string[];
  height: string;
  delay?: number;
  slideDirection?: 'right' | 'left';
}) => {
  const autoplayConfig = {
    delay: delay || 3000,
    disableOnInteraction: false,
    reverseDirection: slideDirection === 'left',
  };

  const navigationConfig = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  };

  return (
    <div>
      <Swiper
        loop={true}
        // grabCursor={true}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        autoplay={autoplayConfig}
        navigation={navigationConfig}
        modules={[EffectCreative, Autoplay, Navigation]}
        className="mySwiper relative"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Image
              height={400}
              width={1920}
              src={img}
              alt="hero images"
              className={`w-full ${height} object-fill`}
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </Swiper>
    </div>
  );
};

export default Carousel;
