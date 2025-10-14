'use client';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination, Autoplay } from 'swiper/modules';
import { HOW_IT_WORKS } from '@/docs/homeDocs';
import HowItWorksCard from './HowItWorksCard';

const HowItWorksCarousel = () => {
  return (
    <div>
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={30}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="h-[370px]"
      >
        {HOW_IT_WORKS.map((step, index) => (
          <SwiperSlide className="">
            <HowItWorksCard key={index} {...step} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HowItWorksCarousel;
