'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import Image from 'next/image';


const ProductImgCarousel = ({ images }: { images: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={0}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        onSwiper={setMainSwiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className=""
      >
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <Image
              height={385}
              width={385}
              src={item || '/placeholder.svg'}
              className="w-full h-full object-cover"
              alt={item}
            />
          </SwiperSlide>
        ))}
        <button
          onClick={() => mainSwiper?.slidePrev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white transition-colors"
        >
          <IoIosArrowDropleftCircle size={30} />
        </button>
        <button
          onClick={() => mainSwiper?.slideNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white transition-colors"
        >
          <IoIosArrowDroprightCircle size={30} />
        </button>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mt-3"
      >
        {images.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`cursor-pointer ${activeIndex === index && 'border-2 border-green-600'}`}
          >
            <Image
              height={50}
              width={50}
              src={item || '/placeholder.svg'}
              className="w-full h-full object-cover"
              alt={item}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImgCarousel;
