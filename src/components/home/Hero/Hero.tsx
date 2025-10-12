import CategorySidebar from '@/components/shared/Navbar/MobileNav/CategorySidebar';
import Carousel from './Carousel';
import Sidebar from '@/components/shared/Navbar/MobileNav/CategorySidebar';

const Hero = () => {
  const imagesMain = [
    '/hero/hero1/1.png',
    '/hero/hero1/2.png',
    '/hero/hero1/3.png',
    '/hero/hero1/4.png',
  ];

  const imagesSubLeft = ['/hero/hero2/1.png', '/hero/hero2/2.png'];

  const imagesSubRight = ['/hero/hero3/1.png', '/hero/hero3/2.png', '/hero/hero3/3.png'];

  return (
    <section className="bg-gradient-to-r from-[#90e0ef]/20 via-white to-[#56cfe1]/20">
      <Carousel height={'h-[300px] md:h-[400px] lg:h-[700px]'} delay={5000} images={imagesMain} />
    </section>
  );
};

export default Hero;
