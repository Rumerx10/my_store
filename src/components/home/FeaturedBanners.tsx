import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_BANNERS } from '@/docs/homeMedia';

// GoodWe's product banners, with a square crop on phones and the wide one from tablet up.
const FeaturedBanners = () => {
  return (
    <section aria-label="Featured GoodWe systems" className="container mt-8 md:mt-12">
      <ul className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {FEATURED_BANNERS.map((banner) => (
          <li key={banner.href}>
            <Link
              href={banner.href}
              aria-label={banner.label}
              className="group block overflow-hidden rounded-3xl border border-white/70 shadow-lift"
            >
              <div className="relative aspect-[768/800] md:hidden">
                <Image
                  src={banner.mobile}
                  alt={banner.label}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                />
              </div>
              <div className="relative hidden aspect-[1920/950] md:block">
                <Image
                  src={banner.desktop}
                  alt={banner.label}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeaturedBanners;
