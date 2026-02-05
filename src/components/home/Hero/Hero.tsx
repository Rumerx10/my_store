
import Carousel from './Carousel';


const Hero = () => {
  const imagesMain = [
    '/hero/hero1/1.png',
    '/hero/hero1/2.png',
    '/hero/hero1/3.png',
    '/hero/hero1/4.png',
    '/hero/hero1/5.png',
    '/hero/hero1/6.png',
    '/hero/hero1/7.png',
  ];

  // const imagesSubLeft = ['/hero/hero2/1.png', '/hero/hero2/2.png'];
  // const imagesSubRight = ['/hero/hero3/1.png', '/hero/hero3/2.png', '/hero/hero3/3.png'];

  return (
    <section className="bg-white">
      <Carousel 
        height={'h-[350px] md:h-[400px] lg:h-[calc(100vh-154px)]'} // Subtracting navbar height
        delay={5000} 
        images={imagesMain} 
      />
    </section>
  );
};

export default Hero;
