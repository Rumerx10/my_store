import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import ReduxProvider from '@/redux/provider';
import { Toaster } from 'react-hot-toast';
import { SITE } from '@/docs/site';
import GridPulses from '@/components/shared/GridPulses';
import SunLight from '@/components/shared/SunLight';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lift"
        >
          Skip to content
        </a>
        <SunLight />
        <GridPulses />
        <Toaster position="top-center" reverseOrder={false} />
        <ReduxProvider>
          <Navbar />
          <div className="pt-(--header-h) pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))]">
            <main id="main" className="min-h-[60dvh]">
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
