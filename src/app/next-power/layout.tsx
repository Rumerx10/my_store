import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/next-power/shared/Navbar/Navbar';
import Footer from '@/components/next-power/shared/Footer/Footer';
import GridPulses from '@/components/next-power/shared/GridPulses';
import SunLight from '@/components/next-power/shared/SunLight';
import Providers from '@/components/next-power/Providers';
import PageBackground from '@/components/common/PageBackground';
import { NEXT_POWER_BACKGROUND } from './background';
import { SITE } from '@/docs/site';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
};

// NextPower's storefront and dashboards, served under /next-power.
export default function NextPowerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lift dark:focus:bg-slate-900"
      >
        Skip to content
      </a>
      {/* NextPower's page background: set in ./background.ts. */}
      <PageBackground {...NEXT_POWER_BACKGROUND} />
      <SunLight />
      <GridPulses />
      {/* react-hot-toast sets its colours inline, so the dark ones need !important. */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ className: 'dark:bg-slate-800! dark:text-slate-100!' }}
      />
      <Providers>
        <Navbar />
        <div className="pt-(--header-h) pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))]">
          <main id="main" className="min-h-[60dvh]">
            {children}
          </main>
          <Footer />
        </div>
      </Providers>
    </>
  );
}
