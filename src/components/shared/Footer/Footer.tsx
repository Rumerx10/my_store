import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import Logo from '../Logo';
import { FOOTER_LINKS, SITE } from '@/docs/site';

const PAYMENT_LOGOS = [
  { src: '/bkash.png', alt: 'bKash' },
  { src: '/nagad.png', alt: 'Nagad' },
  { src: '/rocket.png', alt: 'Rocket' },
  { src: '/cashondelivery.png', alt: 'Cash on delivery' },
];

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/70 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8 lg:py-16">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
            {SITE.description}
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-gray-600 dark:text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-gray-400 dark:text-slate-500"
                aria-hidden="true"
              />
              {SITE.address}
            </li>
            <li>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="flex items-center gap-2.5 rounded transition-colors hover:text-gray-900 dark:hover:text-slate-100"
              >
                <Phone
                  className="size-4 shrink-0 text-gray-400 dark:text-slate-500"
                  aria-hidden="true"
                />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 rounded transition-colors hover:text-gray-900 dark:hover:text-slate-100"
              >
                <Mail
                  className="size-4 shrink-0 text-gray-400 dark:text-slate-500"
                  aria-hidden="true"
                />
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-3">
          {FOOTER_LINKS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-gray-600 dark:text-slate-400 transition-colors hover:text-gray-900 dark:hover:text-slate-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/70 dark:border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm text-gray-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs">We accept</span>
            <ul className="flex items-center gap-2">
              {PAYMENT_LOGOS.map((logo) => (
                <li
                  key={logo.alt}
                  className="flex h-8 w-12 items-center justify-center rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-1"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={40}
                    height={24}
                    className="h-5 w-auto object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
